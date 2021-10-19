import {ShaderFunctionCode} from '../types/CommonType';

/**
 * ShaderFunctionCodeRepository is a class that manages the functions that nodes have.
 * Each node can get the ShaderFunctionCode from this class using shaderFunctionName
 * as a key(see: node.shaderCode).
 * The shaderFunctionName must match the function name in the ShaderFunctionCode.
 * The function in the ShaderFunctionCode can be overloaded and
 * its behavior can be changed depending on the socket attached to the node.
 *
 * Note1: All the return type of shaderFunctionCode should be 'void'.
 *        This is because we do not use the return value of the function.
 *        You need to use 'out' qualifier to output value.
 * Note2: Users can write multiple functions in ShaderFunctionCode by being careful
 *        about the function names.
 * Note3: The output of the fragment shader must be assigned to a variable with
 *        the name specified in ShaderityGraphJson.fragmentShaderGlobalData.outputVariableName.
 *        It should be specified in the function corresponding to the last node of the fragment
 *        shader, etc. The default value of outputVariableName is renderTarget0.
 *        e.g. The function corresponding to the last node of the fragment shader
 *          void outputColor(in vec4 outColor) {
 *             renderTarget0 = outColor;
 *          }
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
