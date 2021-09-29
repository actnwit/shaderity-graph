import {ShaderStage, SocketTypeEnum} from '../types/CommonEnum';
import {NodeData, NodeId} from '../types/CommonType';
import InputSocket from '../sockets/InputSocket';
import OutputSocket from '../sockets/OutputSocket';

export type NodeClassNames =
  | 'Node'
  | 'AttributeInputNode'
  | 'VaryingInputNode'
  | 'UniformInputNode';

export default class Node {
  protected static __nodes: Node[] = [];

  protected __nodeData: NodeData;

  protected __id: NodeId;
  protected __inputSockets: Map<string, InputSocket> = new Map();
  protected __outputSockets: Map<string, OutputSocket> = new Map();

  constructor(nodeData: NodeData) {
    this.__nodeData = nodeData;

    this.__id = Node.__nodes.length;
    Node.__nodes[this.__id] = this;
  }

  static get allNodes(): Node[] {
    return this.__nodes;
  }

  static get vertexNodes(): Node[] {
    const vertexNodes: Node[] = [];
    for (const node of this.__nodes) {
      if (node.shaderStage === ShaderStage.Vertex) {
        vertexNodes.push(node);
      }
    }
    return vertexNodes;
  }

  static get pixelNodes(): Node[] {
    const pixelNodes: Node[] = [];
    for (const node of this.__nodes) {
      if (node.shaderStage === ShaderStage.Pixel) {
        pixelNodes.push(node);
      }
    }
    return pixelNodes;
  }

  static resetNodes() {
    this.__nodes.length = 0;
  }

  static getNodeById(id: NodeId) {
    return this.__nodes[id];
  }

  get className(): NodeClassNames {
    return 'Node';
  }

  get name() {
    return this.__nodeData.shaderFunctionName;
  }

  get shaderCode() {
    return this.__nodeData.shaderFunctionCode;
  }

  get shaderStage() {
    return this.__nodeData.shaderStage;
  }

  get extensions() {
    return this.__nodeData.extensions ?? [];
  }

  get id() {
    return this.__id;
  }

  get inputSockets() {
    return this.__inputSockets;
  }

  get outputSockets() {
    return this.__outputSockets;
  }

  addInputSocket(socketName: string, SocketType: SocketTypeEnum) {
    if (this.__inputSockets.has(socketName)) {
      console.warn('Node.addInputSocket: duplicate the key');
    }

    const inputSocket = new InputSocket(SocketType, this.__id, socketName);
    this.__inputSockets.set(socketName, inputSocket);
  }

  addOutputSocket(socketName: string, SocketType: SocketTypeEnum) {
    if (this.__outputSockets.has(socketName)) {
      console.warn('Node.addOutputSocket: duplicate the key');
    }

    this.__outputSockets.set(
      socketName,
      new OutputSocket(SocketType, this.__id, socketName)
    );
  }

  getInputNodeAll(): Map<string, Node> {
    const inputNodes: Map<string, Node> = new Map();
    for (const key of this.__inputSockets.keys()) {
      const node = this.getInputNode(key) as Node;
      inputNodes.set(key, node);
    }
    return inputNodes;
  }

  getInputNode(socketKey: string): Node | undefined {
    const targetSocket = this.getInputSocket(socketKey);
    if (targetSocket != null) {
      const connectedNodeId = targetSocket?.connectedNodeId;
      return Node.__nodes[connectedNodeId];
    } else {
      return undefined;
    }
  }

  getInputSocket(socketKey: string): InputSocket | undefined {
    if (!this.__inputSockets.has(socketKey)) {
      console.error('Node.getInputSocket: Wrong key of socket');
      return undefined;
    }

    const targetSocket = this.__inputSockets.get(socketKey);
    return targetSocket;
  }

  getOutputNodesAll(): Map<string, Node[]> {
    const outputNodes: Map<string, Node[]> = new Map();
    for (const key in this.__outputSockets) {
      outputNodes.set(key, this.getOutputNodes(key));
    }
    return outputNodes;
  }

  getOutputNodes(socketKey: string): Node[] {
    const targetSocket = this.getOutputSocket(socketKey);

    if (targetSocket != null) {
      const connectedNodeIds = targetSocket.connectedNodeIds;
      const connectedNodes: Node[] = [];
      for (const nodeId of connectedNodeIds) {
        connectedNodes.push(Node.__nodes[nodeId]);
      }
      return connectedNodes;
    } else {
      return [];
    }
  }

  getOutputSocket(socketKey: string): OutputSocket | undefined {
    if (!this.__outputSockets.has(socketKey)) {
      console.error('Node.getOutputSocket: Wrong key of socket');
      return undefined;
    }

    const targetSocket = this.__outputSockets.get(socketKey);
    return targetSocket;
  }

  getInputSocketKey(socket: InputSocket): string | undefined {
    let socketKey: string | undefined;
    for (const [key, inputSocket] of this.__inputSockets) {
      if (socket === inputSocket) {
        socketKey = key;
        break;
      }
    }
    return socketKey;
  }

  getOutputSocketKey(socket: OutputSocket): string | undefined {
    let socketKey: string | undefined;
    for (const [key, outputSocket] of this.__outputSockets) {
      if (socket === outputSocket) {
        socketKey = key;
        break;
      }
    }
    return socketKey;
  }
}
