import {ComponentType, ComponentTypeEnum} from '../types/ComponentType';
import {CompositionType, CompositionTypeEnum} from '../types/CompositionType';

export type AttributeNames = Array<string>;

export default class ConstantVariableShader {
  static getShaderCode(
    functionName: string,
    componentType: ComponentTypeEnum,
    compositionType: CompositionTypeEnum,
    inputValue: number[] | boolean
  ) {
    let constantValue: string;
    if (componentType.isFloatingPoint()) {
      constantValue = this.floatValueCode(
        compositionType,
        inputValue as number[]
      );
    } else if (componentType.isInteger()) {
      constantValue = this.intValueCode(
        compositionType,
        inputValue as number[]
      );
    } else if (componentType === ComponentType.Bool) {
      constantValue = (inputValue as boolean) ? 'true' : 'false';
    } else {
      throw Error('ConstantVariableShader.getShaderCode: unsupported error');
    }

    // unsupported
    return `
void ${functionName}(
  out ${compositionType.getGlslStr(componentType)} outValue) {
  outValue = ${constantValue};
}
    `;
  }

  private static intValueCode(
    compositionType: CompositionTypeEnum,
    inputValue: number[]
  ) {
    let result: string;

    switch (compositionType) {
      case CompositionType.Scalar:
        result = Math.floor(inputValue[0]).toString();
        break;
      case CompositionType.Vec2:
        result = `ivec2(${Math.floor(inputValue[0])}, ${Math.floor(
          inputValue[1]
        )})`;
        break;
      case CompositionType.Vec3:
        result = `ivec3(${Math.floor(inputValue[0])}, ${Math.floor(
          inputValue[1]
        )}, ${Math.floor(inputValue[2])})`;
        break;
      case CompositionType.Vec4:
        result = `ivec4(${Math.floor(inputValue[0])}, ${Math.floor(
          inputValue[1]
        )}, ${Math.floor(inputValue[2])}, ${Math.floor(inputValue[3])})`;
        break;
      default:
        // unsupported
        throw Error('ConstantVariableShader.intValueCode: unsupported error');
    }

    return result;
  }

  private static floatValueCode(
    compositionType: CompositionTypeEnum,
    inputValue: number[]
  ) {
    let result: string;

    switch (compositionType) {
      case CompositionType.Scalar:
        result = this.convertToStringAsGLSLFloat(inputValue[0]);
        break;
      case CompositionType.Vec2:
        result = `vec2(${this.convertToStringAsGLSLFloat(
          inputValue[0]
        )}, ${this.convertToStringAsGLSLFloat(inputValue[1])})`;
        break;
      case CompositionType.Vec3:
        result = `vec3(${this.convertToStringAsGLSLFloat(
          inputValue[0]
        )}, ${this.convertToStringAsGLSLFloat(
          inputValue[1]
        )}, ${this.convertToStringAsGLSLFloat(inputValue[2])})`;
        break;
      case CompositionType.Vec4:
        result = `vec4(${this.convertToStringAsGLSLFloat(
          inputValue[0]
        )}, ${this.convertToStringAsGLSLFloat(
          inputValue[1]
        )}, ${this.convertToStringAsGLSLFloat(
          inputValue[2]
        )}, ${this.convertToStringAsGLSLFloat(inputValue[3])})`;
        break;
      default:
        // unsupported
        throw Error('ConstantVariableShader.floatValueCode: unsupported error');
    }

    return result;
  }

  private static convertToStringAsGLSLFloat(value: number) {
    if (Number.isInteger(value)) {
      return `${value}.0`;
    } else {
      return '' + value;
    }
  }
}
