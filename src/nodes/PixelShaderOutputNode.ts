import {SocketDirection} from '../sockets/AbstractSocket';
import Vector4Socket from '../sockets/Vector4Socket';
import {
  AvailableShaderStage,
  ShaderPrecisionEnum,
  ShaderStage,
} from '../types/CommonType';
import AbstractNode from './AbstractNode';
import PixelShaderOutputShaderityObject from '../nodeShaders/shaderityShaders/PixelShaderOutput.glsl';

export default class PixelShaderOutputNode extends AbstractNode {
  // TODO: support change precision in shader
  private static shaderCode = PixelShaderOutputShaderityObject.code as string;

  readonly availableShaderStage = AvailableShaderStage.Pixel;

  protected __shaderCode: string;

  constructor(shaderPrecision: ShaderPrecisionEnum) {
    super('pixelShaderOutput', ShaderStage.Pixel, shaderPrecision);

    this.__inputSockets['pixelColor'] = new Vector4Socket(
      SocketDirection.Input,
      this.nodeId
    );

    this.__shaderCode = PixelShaderOutputNode.shaderCode;
  }
}
