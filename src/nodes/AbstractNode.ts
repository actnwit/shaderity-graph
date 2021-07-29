import {
  AvailableShaderStageEnum,
  NodeId,
  ShaderPrecision,
  ShaderPrecisionEnum,
  ShaderStage,
  ShaderStageEnum,
} from '../types/CommonType';

type AbstractSocket = unknown;

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
}
