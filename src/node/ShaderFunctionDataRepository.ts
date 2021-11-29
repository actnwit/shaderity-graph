import {ShaderFunctionData, ShaderFunctions} from '../types/CommonType';

/**
 * ShaderFunctionDataRepository is a class that manages the functions that nodes have.
 * Each node can get the ShaderFunctionData from this class using shaderFunctionName
 * as a key(see: node.shaderCode).
 * The shaderFunctionName must match the function name in the ShaderFunctionData.
 * The function in the ShaderFunctionData can be overloaded and
 * its behavior can be changed depending on the socket attached to the node.
 *
 * Note1: All the return type of shaderFunctionData should be 'void'.
 *        This is because we do not use the return value of the function.
 *        You need to use 'out' qualifier to output value.
 * Note2: Users can write multiple functions in ShaderFunctionData by being careful
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

export default class ShaderFunctionDataRepository {
  private static __shaderFunctions: ShaderFunctions = {};

  /**
   * Remove all set shaderFunctionData
   */
  static resetRepository() {
    this.__shaderFunctions = {};
  }

  /**
   * Check if there is a shaderFunctionData with the specified function name
   * @returns boolean
   */
  static existShaderFunctionData(functionName: string) {
    const shaderFunctionData = this.__shaderFunctions[functionName];
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
    this.__shaderFunctions[functionName] = shaderFunctionData;
  }

  /**
   * Get the shaderFunctionData corresponding to the function name
   */
  static getShaderFunctionData(functionName: string) {
    const shaderFunctionData = this.__shaderFunctions[functionName];
    if (shaderFunctionData == null) {
      console.error(
        `ShaderFunctionDataRepository.getShaderFunctionData: the data of ${functionName} is not found`
      );
    }
    return shaderFunctionData;
  }
}
