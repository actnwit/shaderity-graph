import {ShaderFunctionData} from '../types/CommonType';

export default class ShaderFunctionDataRepository {
  private static __shaderFunctionData: ShaderFunctionData[] = [];

  static resetShaderFunctionData() {
    this.__shaderFunctionData.length = 0;
  }

  static setShaderFunctionDataArray(shaderFunctionData: ShaderFunctionData[]) {
    this.__shaderFunctionData = shaderFunctionData;
  }

  static addShaderFunctionData(shaderFunctionData: ShaderFunctionData) {
    this.__shaderFunctionData.push(shaderFunctionData);

    const id = this.__shaderFunctionData.length - 1;
    return id;
  }

  // id is the index of the this.__shaderFunctionData
  static getShaderFunctionDataById(id: number) {
    const shaderFunctionData = this.__shaderFunctionData[id];
    if (shaderFunctionData == null) {
      console.error(
        `NodeFunctionDataRepository.getShaderFunctionDataById: the data with id ${id} is not found`
      );
    }
    return shaderFunctionData;
  }
}
