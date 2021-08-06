import {
  ShaderStage,
  ShaderStageEnum,
  SocketTypeEnum,
} from '../types/CommonEnum';
import {NodeId} from '../types/CommonType';
import AbstractSocket from '../sockets/AbstractSocket';
import InputSocket from '../sockets/InputSocket';
import OutputSocket from '../sockets/OutputSocket';

export default class Node {
  private static __nodes: Node[] = [];

  private __nodeName: string;
  private __shaderStage: ShaderStageEnum;
  private __shaderCode: string;

  private __nodeId: NodeId = 0;
  private __inputSockets: {[key: string]: InputSocket} = {};
  private __outputSockets: {[key: string]: OutputSocket} = {};

  constructor(
    shaderStage: ShaderStageEnum,
    shaderCode: string,
    nodeName?: string
  ) {
    this.__shaderStage = shaderStage;
    this.__shaderCode = shaderCode;

    this.__nodeId = this.__nodeId++;
    Node.__nodes[this.__nodeId] = this;

    this.__nodeName = nodeName ?? this.nodeId.toString();
  }

  static connectSockets(
    inputNode: Node,
    keyOfSocketForInputNode: string,
    outputNode: Node,
    keyOfSocketForOutputNode: string
  ) {
    const socketsInInputNode = inputNode.__outputSockets;
    const targetSocketInInputNode = socketsInInputNode[keyOfSocketForInputNode];

    const socketsInOutputNode = outputNode.__inputSockets;
    const targetSocketInOutputNode =
      socketsInOutputNode[keyOfSocketForOutputNode];

    if (targetSocketInInputNode != null && targetSocketInOutputNode != null) {
      AbstractSocket.connectSockets(
        targetSocketInInputNode,
        targetSocketInOutputNode
      );
    } else {
      console.error('Node.connectWith: Wrong key of socket');
    }
  }

  get nodeName() {
    return this.__nodeName;
  }

  get shaderCode() {
    return this.__shaderCode;
  }

  get shaderStage() {
    return this.__shaderStage;
  }

  get nodeId() {
    return this.__nodeId;
  }

  get vertexNodes(): Node[] {
    const vertexNodes: Node[] = [];
    for (const node of Node.__nodes) {
      if (node.shaderStage === ShaderStage.Vertex) {
        vertexNodes.push(node);
      }
    }
    return vertexNodes;
  }

  get pixelNodes(): Node[] {
    const pixelNodes: Node[] = [];
    for (const node of Node.__nodes) {
      if (node.shaderStage === ShaderStage.Pixel) {
        pixelNodes.push(node);
      }
    }
    return pixelNodes;
  }

  public addInputSocket(key: string, SocketType: SocketTypeEnum) {
    if (this.__inputSockets[key] != null) {
      console.warn('Node.addInputSocket: duplicate the key');
    }

    this.__inputSockets[key] = new InputSocket(SocketType, this.__nodeId);
  }

  public addOutputSocket(key: string, SocketType: SocketTypeEnum) {
    if (this.__outputSockets[key] != null) {
      console.warn('Node.addOutputSocket: duplicate the key');
    }

    this.__outputSockets[key] = new OutputSocket(SocketType, this.__nodeId);
  }

  public getInputNodeAll(): {[key: string]: Node | undefined} {
    const inputNodes: {[key: string]: Node | undefined} = {};
    for (const key in this.__inputSockets) {
      inputNodes[key] = this.getInputNode(key);
    }
    return inputNodes;
  }

  public getInputNode(keyOfSocket: string): Node | undefined {
    const targetSocket = this.__inputSockets[keyOfSocket];
    if (targetSocket == null) {
      console.error('Node.getConnectedNodesWithSocket: Wrong key of socket');
      return undefined;
    }

    const connectedNodeID = targetSocket.connectedNodeIDs[0];
    return Node.__nodes[connectedNodeID];
  }

  public getOutputNodesAll(): {[key: string]: Node[] | undefined} {
    const outputNodes: {[key: string]: Node[] | undefined} = {};
    for (const key in this.__outputSockets) {
      outputNodes[key] = this.getOutputNodes(key);
    }
    return outputNodes;
  }

  public getOutputNodes(keyOfSocket: string): Node[] {
    const targetSocket = this.__outputSockets[keyOfSocket];
    if (targetSocket == null) {
      console.error('Node.getConnectedNodesWithSocket: Wrong key of socket');
      return [];
    }

    const connectedNodeIDs = targetSocket.connectedNodeIDs;
    const connectedNodes: Node[] = [];
    for (const nodeId of connectedNodeIDs) {
      connectedNodes.push(Node.__nodes[nodeId]);
    }

    return connectedNodes;
  }
}
