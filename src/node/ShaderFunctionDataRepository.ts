import {ShaderFunctionData} from '../types/CommonType';

/**
 * ShaderFunctionDataRepository is a class that manages the function that Nodes have.
 * The Data is managed by an object whose key is the function name.
 *
 * Note: All the return type of functions in the shaderFunctionData.shaderFunctionCode
 *       should be 'void'. This is because we do not use the return value of the function.
 *       You need to use 'out' qualifier to output value.
 */
export default class ShaderFunctionDataRepository {
  private static __shaderFunctionData: {
    [functionName: string]: ShaderFunctionData;
  } = {};

  /**
   * Remove all set shaderFunctionData
   */
  static resetShaderFunctionData() {
    this.__shaderFunctionData = {};
  }

  /**
   * Check if there is a shaderFunctionData with the specified function name
   * @returns boolean
   */
  static existShaderFunctionData(functionName: string) {
    const shaderFunctionData = this.__shaderFunctionData[functionName];
    if (shaderFunctionData != null) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Add shaderFunctionData to this repository
   */
  static setShaderFunctionData(
    functionName: string,
    shaderFunctionData: ShaderFunctionData
  ) {
    this.__shaderFunctionData[functionName] = shaderFunctionData;
  }

  /**
   * Get the shaderFunctionData corresponding to the function name
   */
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
