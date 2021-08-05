import ConstantVariableShader from '../nodeShaders/ConstantVariableShader';
import {SocketDirection} from '../sockets/AbstractSocket';
import Vector4Socket from '../sockets/Vector4Socket';
import {
  AvailableShaderStage,
  ShaderPrecision,
  ShaderPrecisionEnum,
  ShaderStageEnum,
} from '../types/CommonType';
import {ComponentTypeEnum} from '../types/ComponentType';
import {CompositionType, CompositionTypeEnum} from '../types/CompositionType';
import AbstractNode from './AbstractNode';

export default class ConstantVariableNode extends AbstractNode {
  readonly availableShaderStage = AvailableShaderStage.VertexAndPixel;
  protected __shaderCode: string;

  constructor(
    shaderStage: ShaderStageEnum,
    inputValue: number[] | boolean,
    {
      shaderPrecision = ShaderPrecision.High,
      componentType,
      compositionType,
    }: {
      shaderPrecision: ShaderPrecisionEnum;
      componentType: ComponentTypeEnum;
      compositionType: CompositionTypeEnum;
    }
  ) {
    super('ConstantVariableNode', shaderStage, shaderPrecision);
    this.__shaderFunctionName += ' ' + this.nodeId;

    const outputSocketName = compositionType.getGlslStr(componentType);

    // TODO: support the other composition types
    switch (compositionType) {
      case CompositionType.Vec4:
        this.__outputSockets[outputSocketName] = new Vector4Socket(
          SocketDirection.Input,
          this.nodeId
        );
        break;
      default:
        throw Error('ConstantVariableNode: unsupported error');
    }

    // TODO: Change shader code to Shaderity format
    // TODO: Passing inputValues as uniform values to the shader
    this.__shaderCode = ConstantVariableShader.getShaderCode(
      this.shaderFunctionName,
      componentType,
      compositionType,
      inputValue
    );
  }
}