import {ShaderFunctionCode} from '../types/CommonType';

/**
 * ShaderFunctionDataRepository is a class that manages the function that Nodes have.
 * The Data is managed by an object whose key is the function name.
 *
 * Note: All the return type of functions in the shaderFunctionCode.shaderFunctionCode
 *       should be 'void'. This is because we do not use the return value of the function.
 *       You need to use 'out' qualifier to output value.
 */
export default class ShaderFunctionCodeRepository {
  private static __shaderFunctionCode: {
    [functionName: string]: ShaderFunctionCode;
  } = {};

  /**
   * Remove all set shaderFunctionCode
   */
  static resetShaderFunctionCode() {
    this.__shaderFunctionCode = {};
  }

  /**
   * Check if there is a shaderFunctionCode with the specified function name
   * @returns boolean
   */
  static existShaderFunctionCode(functionName: string) {
    const shaderFunctionCode = this.__shaderFunctionCode[functionName];
    if (shaderFunctionCode != null) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Add shaderFunctionCode to this repository
   */
  static setShaderFunctionCode(
    functionName: string,
    shaderFunctionCode: ShaderFunctionCode
  ) {
    this.__shaderFunctionCode[functionName] = shaderFunctionCode;
  }

  /**
   * Get the shaderFunctionCode corresponding to the function name
   */
  static getShaderFunctionCode(functionName: string) {
    const shaderFunctionCode = this.__shaderFunctionCode[functionName];
    if (shaderFunctionCode == null) {
      console.error(
        `ShaderFunctionCodeRepository.getShaderFunctionCode: the data of ${functionName} is not found`
      );
    }
    return shaderFunctionCode;
  }
}
