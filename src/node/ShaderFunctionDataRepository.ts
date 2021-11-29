import {ShaderFunctionData, ShaderFunctions} from '../types/CommonType';

/**
 * ShaderFunctionDataRepository is a class that manages the shader function codes that nodes have.
 * Each node can get the ShaderFunctionData from this class using shaderFunctionDataKey
 * as a key(see: node.shaderCode).
 * The shader function code corresponding to each node must contain at least the definition of
 * the function with node.functionName.
 *
 * Note1: The order of each socket in node.__sockets and the order of the arguments in shader
 *        function codes corresponding to node.functionName must match.
 * Note2: If you want to assign a value to a built-in variable other than gl_Position and
 *        gl_FragColor, you need to do it in the shader function code. Use the
 *        ShaderOutputSocket to output gl_Position and gl_FragColor(or the corresponding
 *        output variable).
 * Note3: The return value of all shader function codes corresponding to node.functionName
 *        should be void. This is because we do not use the return value of the function.
 *        To output values, you need to use the 'out' modifier in the function argument.
 * Note4: Users can write multiple functions in ShaderFunctionData by being careful
 *        about the function names.
 * Note5: The function in the ShaderFunctionData can be overloaded and
 *        its behavior can be changed depending on the socket attached to the node.
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
  static existShaderFunctionData(shaderFunctionDataKey: string) {
    const shaderFunctionData = this.__shaderFunctions[shaderFunctionDataKey];
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
    shaderFunctionDataKey: string,
    shaderFunctionData: ShaderFunctionData
  ) {
    this.__shaderFunctions[shaderFunctionDataKey] = shaderFunctionData;
  }

  /**
   * Get the shaderFunctionData corresponding to the function name
   */
  static getShaderFunctionData(shaderFunctionDataKey: string) {
    const shaderFunctionData = this.__shaderFunctions[shaderFunctionDataKey];
    if (shaderFunctionData == null) {
      console.error(
        `ShaderFunctionDataRepository.getShaderFunctionData: the data of ${shaderFunctionDataKey} is not found`
      );
    }
    return shaderFunctionData;
  }
}
