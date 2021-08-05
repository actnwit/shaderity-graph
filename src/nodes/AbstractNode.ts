import {
  AvailableShaderStageEnum,
  NodeId,
  ShaderPrecision,
  ShaderPrecisionEnum,
  ShaderStage,
  ShaderStageEnum,
} from '../types/CommonType';

import AbstractSocket from '../sockets/AbstractSocket';
import InputSocket from '../sockets/InputSocket';
import OutputSocket from '../sockets/OutputSocket';

export default abstract class AbstractNode {
  static nodes: AbstractNode[] = [];

  //TODO:: create checker of shader stage
  abstract readonly availableShaderStage: AvailableShaderStageEnum;

  protected abstract __shaderCode: string;

  protected __shaderFunctionName: string;
  protected __inputSockets: {[key: string]: InputSocket} = {};
  protected __outputSockets: {[key: string]: OutputSocket} = {};

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

  public getInputNodeAll(): {[key: string]: AbstractNode | undefined} {
    const inputNodes: {[key: string]: AbstractNode | undefined} = {};
    for (const key in this.__inputSockets) {
      inputNodes[key] = this.getInputNode(key);
    }
    return inputNodes;
  }

  public getInputNode(keyOfSocket: string): AbstractNode | undefined {
    const targetSocket = this.__inputSockets[keyOfSocket];
    if (targetSocket == null) {
      console.error(
        'AbstractNode.getConnectedNodesWithSocket: Wrong key of socket'
      );
      return undefined;
    }

    const connectedNodeID = targetSocket.connectedNodeIDs[0];
    return AbstractNode.nodes[connectedNodeID];
  }

  public getOutputNodesAll(): {[key: string]: AbstractNode[] | undefined} {
    const outputNodes: {[key: string]: AbstractNode[] | undefined} = {};
    for (const key in this.__outputSockets) {
      outputNodes[key] = this.getOutputNodes(key);
    }
    return outputNodes;
  }

  public getOutputNodes(keyOfSocket: string): AbstractNode[] {
    const targetSocket = this.__outputSockets[keyOfSocket];
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
