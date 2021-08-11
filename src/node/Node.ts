import {
  ShaderStage,
  ShaderStageEnum,
  SocketTypeEnum,
} from '../types/CommonEnum';
import {NodeId} from '../types/CommonType';
import InputSocket from '../sockets/InputSocket';
import OutputSocket from '../sockets/OutputSocket';

export default class Node {
  private static __nodes: Node[] = [];

  private __name: string;
  private __shaderStage: ShaderStageEnum;
  private __shaderCode: string;

  private __id: NodeId;
  private __inputSockets: Map<string, InputSocket> = new Map();
  private __outputSockets: Map<string, OutputSocket> = new Map();

  constructor(shaderStage: ShaderStageEnum, shaderCode: string, name?: string) {
    this.__shaderStage = shaderStage;
    this.__shaderCode = shaderCode;

    this.__id = Node.__nodes.length;
    Node.__nodes[this.__id] = this;

    this.__name = name ?? this.id.toString();
  }

  static get allNodes(): Node[] {
    return this.__nodes;
  }

  static get vertexNodes(): Node[] {
    const vertexNodes: Node[] = [];
    for (const node of this.__nodes) {
      if (node.__shaderStage === ShaderStage.Vertex) {
        vertexNodes.push(node);
      }
    }
    return vertexNodes;
  }

  static get pixelNodes(): Node[] {
    const pixelNodes: Node[] = [];
    for (const node of this.__nodes) {
      if (node.__shaderStage === ShaderStage.Pixel) {
        pixelNodes.push(node);
      }
    }
    return pixelNodes;
  }

  static resetNodes() {
    this.__nodes.length = 0;
  }

  get name() {
    return this.__name;
  }

  get shaderCode() {
    return this.__shaderCode;
  }

  get shaderStage() {
    return this.__shaderStage;
  }

  get id() {
    return this.__id;
  }

  get inputSockets() {
    return this.__inputSockets;
  }

  addInputSocket(key: string, SocketType: SocketTypeEnum) {
    if (this.__inputSockets.has(key)) {
      console.warn('Node.addInputSocket: duplicate the key');
    }

    const inputSocket = new InputSocket(SocketType, this.__id);
    this.__inputSockets.set(key, inputSocket);
  }

  addOutputSocket(key: string, SocketType: SocketTypeEnum) {
    if (this.__outputSockets.has(key)) {
      console.warn('Node.addOutputSocket: duplicate the key');
    }

    this.__outputSockets.set(key, new OutputSocket(SocketType, this.__id));
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
      const connectedNodeID = targetSocket?.connectedNodeIDs[0];
      return Node.__nodes[connectedNodeID];
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
      const connectedNodeIDs = targetSocket.connectedNodeIDs;
      const connectedNodes: Node[] = [];
      for (const nodeId of connectedNodeIDs) {
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
}
