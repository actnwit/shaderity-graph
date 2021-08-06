import {
  ShaderPrecision,
  ShaderPrecisionEnum,
  ShaderStage,
  ShaderStageEnum,
} from '../types/CommonEnum';
import {NodeId} from '../types/CommonType';
import AbstractSocket from '../sockets/AbstractSocket';
import InputSocket from '../sockets/InputSocket';
import OutputSocket from '../sockets/OutputSocket';

export default class Node {
  static nodes: Node[] = [];

  private __shaderCode = '';

  private __shaderFunctionName: string;
  private __inputSockets: {[key: string]: InputSocket} = {};
  private __outputSockets: {[key: string]: OutputSocket} = {};

  private __nodeId: NodeId = 0;
  private __shaderStage: ShaderStageEnum;
  // TODO: support change precision in shader
  private __shaderPrecision: ShaderPrecisionEnum = ShaderPrecision.High;

  constructor(
    shaderFunctionName: string,
    shaderStage: ShaderStageEnum,
    shaderPrecision: ShaderPrecisionEnum
  ) {
    this.__shaderFunctionName = shaderFunctionName;
    this.__shaderStage = shaderStage;
    this.__shaderPrecision = shaderPrecision;

    this.__nodeId = this.__nodeId++;
    Node.nodes[this.__nodeId] = this;
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

  get shaderFunctionName() {
    return this.__shaderFunctionName;
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
    for (const node of Node.nodes) {
      if (node.shaderStage === ShaderStage.Vertex) {
        vertexNodes.push(node);
      }
    }
    return vertexNodes;
  }

  get pixelNodes(): Node[] {
    const pixelNodes: Node[] = [];
    for (const node of Node.nodes) {
      if (node.shaderStage === ShaderStage.Pixel) {
        pixelNodes.push(node);
      }
    }
    return pixelNodes;
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
    return Node.nodes[connectedNodeID];
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
      connectedNodes.push(Node.nodes[nodeId]);
    }

    return connectedNodes;
  }
}
