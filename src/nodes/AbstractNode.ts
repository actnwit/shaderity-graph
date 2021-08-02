import {
  AvailableShaderStageEnum,
  NodeId,
  ShaderPrecision,
  ShaderPrecisionEnum,
  ShaderStage,
  ShaderStageEnum,
} from '../types/CommonType';

import AbstractSocket from '../sockets/AbstractSocket';

export default abstract class AbstractNode {
  static nodes: AbstractNode[] = [];

  abstract readonly availableShaderStage: AvailableShaderStageEnum;

  protected abstract __shaderCode: string;

  protected __shaderFunctionName: string;
  protected __inputSockets: {[key: string]: AbstractSocket} = {};
  protected __outputSockets: {[key: string]: AbstractSocket} = {};

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
    AbstractNode.nodes[this.__nodeId] = this;
  }

  static connectSockets(
    inputNode: AbstractNode,
    keyOfSocketForInputNode: string,
    outputNode: AbstractNode,
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
      console.error('AbstractNode.connectWith: Wrong key of socket');
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

  get vertexNodes(): AbstractNode[] {
    const vertexNodes: AbstractNode[] = [];
    for (const node of AbstractNode.nodes) {
      if (node.shaderStage === ShaderStage.Vertex) {
        vertexNodes.push(node);
      }
    }
    return vertexNodes;
  }

  get pixelNodes(): AbstractNode[] {
    const pixelNodes: AbstractNode[] = [];
    for (const node of AbstractNode.nodes) {
      if (node.shaderStage === ShaderStage.Pixel) {
        pixelNodes.push(node);
      }
    }
    return pixelNodes;
  }

  getConnectedNodesWithSocket(
    keyOfSocket: string,
    isInputSocket: boolean
  ): AbstractNode[] {
    const sockets = isInputSocket ? this.__inputSockets : this.__outputSockets;

    const targetSocket = sockets[keyOfSocket];
    if (targetSocket == null) {
      console.error(
        'AbstractNode.getConnectedNodesWithSocket: Wrong key of socket'
      );
      return [];
    }

    const connectedNodeIDs = targetSocket.connectedNodeIDs;
    const connectedNodes: AbstractNode[] = [];
    for (const nodeId of connectedNodeIDs) {
      connectedNodes.push(AbstractNode.nodes[nodeId]);
    }

    return connectedNodes;
  }
}
