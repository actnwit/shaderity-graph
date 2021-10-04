import {ShaderFunctionData} from '../types/CommonType';

export default class ShaderFunctionDataRepository {
  private static __shaderFunctionData: {
    [functionName: string]: ShaderFunctionData;
  } = {};

  static resetShaderFunctionData() {
    this.__shaderFunctionData = {};
  }

  static existShaderFunctionData(functionName: string) {
    const shaderFunctionData = this.__shaderFunctionData[functionName];
    if (shaderFunctionData != null) {
      return true;
    } else {
      return false;
    }
  }

  static setShaderFunctionData(
    functionName: string,
    shaderFunctionData: ShaderFunctionData
  ) {
    this.__shaderFunctionData[functionName] = shaderFunctionData;
  }

  static getShaderFunctionData(functionName: string) {
    const shaderFunctionData = this.__shaderFunctionData[functionName];
    if (shaderFunctionData == null) {
      console.error(
        `ShaderFunctionDataRepository.getShaderFunctionDataById: the data of ${functionName} is not found`
      );
    }
    return shaderFunctionData;
  }
}
