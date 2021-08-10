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
  private __inputSockets: {[key: string]: InputSocket} = {};
  private __outputSockets: {[key: string]: OutputSocket} = {};

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
    if (this.__inputSockets[key] != null) {
      console.warn('Node.addInputSocket: duplicate the key');
    }

    this.__inputSockets[key] = new InputSocket(SocketType, this.__id);
  }

  addOutputSocket(key: string, SocketType: SocketTypeEnum) {
    if (this.__outputSockets[key] != null) {
      console.warn('Node.addOutputSocket: duplicate the key');
    }

    this.__outputSockets[key] = new OutputSocket(SocketType, this.__id);
  }

  getInputNodeAll(): {[key: string]: Node | undefined} {
    const inputNodes: {[key: string]: Node | undefined} = {};
    for (const key in this.__inputSockets) {
      inputNodes[key] = this.getInputNode(key);
    }
    return inputNodes;
  }

  getInputNode(keyOfSocket: string): Node | undefined {
    const targetSocket = this.getInputSocket(keyOfSocket);
    if (targetSocket != null) {
      const connectedNodeID = targetSocket?.connectedNodeIDs[0];
      return Node.__nodes[connectedNodeID];
    } else {
      return undefined;
    }
  }

  getInputSocket(keyOfSocket: string): InputSocket | undefined {
    const targetSocket = this.__inputSockets[keyOfSocket];
    if (targetSocket == null) {
      console.error('Node.getInputSocket: Wrong key of socket');
      return undefined;
    }

    return targetSocket;
  }

  getOutputNodesAll(): {[key: string]: Node[] | undefined} {
    const outputNodes: {[key: string]: Node[] | undefined} = {};
    for (const key in this.__outputSockets) {
      outputNodes[key] = this.getOutputNodes(key);
    }
    return outputNodes;
  }

  getOutputNodes(keyOfSocket: string): Node[] {
    const targetSocket = this.getOutputSocket(keyOfSocket);

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

  getOutputSocket(keyOfSocket: string): OutputSocket | undefined {
    const targetSocket = this.__outputSockets[keyOfSocket];
    if (targetSocket == null) {
      console.error('Node.getOutputSocket: Wrong key of socket');
      return undefined;
    }

    return targetSocket;
  }
}
