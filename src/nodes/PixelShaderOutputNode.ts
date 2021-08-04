import {SocketType} from '../sockets/AbstractSocket';
import {
  AvailableShaderStage,
  ShaderPrecisionEnum,
  ShaderStage,
} from '../types/CommonEnum';
import AbstractNode from './AbstractNode';
import PixelShaderOutputShaderityObject from '../nodeShaders/shaderityShaders/PixelShaderOutput.glsl';
import InputSocket from '../sockets/InputSocket';

export default class PixelShaderOutputNode extends AbstractNode {
  // TODO: support change precision in shader
  private static shaderCode = PixelShaderOutputShaderityObject.code as string;

  readonly availableShaderStage = AvailableShaderStage.Pixel;

  protected __shaderCode: string;

  constructor(shaderPrecision: ShaderPrecisionEnum) {
    super('pixelShaderOutput', ShaderStage.Pixel, shaderPrecision);

    this.__inputSockets['pixelColor'] = new InputSocket(
      SocketType.Vector4,
      this.nodeId
    );

    this.__shaderCode = PixelShaderOutputNode.shaderCode;
  }
}
