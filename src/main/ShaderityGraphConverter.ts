import Node from '../node/Node';
import {ShaderCodes, ShaderityGraphJson} from '../types/CommonType';
import JsonImporter from '../import/JsonImporter';
import ShaderGraphResolver from '../shaderGraph/ShaderGraphResolver';
import ShaderFunctionDataRepository from '../node/ShaderFunctionCodeRepository';

/**
 * This class converts ShaderityGraphJson into shader code for GLSL ES3.0.
 * ShaderityGraphJson is defined in ./../types/CommonType.ts
 *
 * Currently, the library expects users to use the createShaderCodesFromJsonFile
 * method or createShaderCodesFromJsonObject method of this class.
 */
export default class ShaderityGraphConverter {
  //TODO: need to set version
  static readonly shaderityGraphVersion = '';

  /**
   * Converts a file of ShaderityGraphJson to a shader code
   * @param src path of the json file
   */
  public static createShaderCodesFromJsonFile(
    src: string
  ): Promise<ShaderCodes> {
    return fetch(src)
      .then(response => response.json())
      .then((data: ShaderityGraphJson) => {
        return this.createShaderCodesFromJsonObject(data);
      });
  }

  /**
   * Converts a ShaderityGraphJson object to a shader code
   * @param json object of ShaderityGraphJson
   */
  public static createShaderCodesFromJsonObject(
    json: ShaderityGraphJson
  ): ShaderCodes {
    if (json.version !== this.shaderityGraphVersion) {
      console.warn(
        'System.createShaderCodesFromJsonObject: mismatch version between json and system'
      );
    }

    Node.resetNodes();
    ShaderFunctionDataRepository.resetShaderFunctionData();

    JsonImporter.importShaderityGraphJson(json);

    if (Node.vertexNodes.length === 0) {
      console.warn(
        'System.createShaderCodesFromJsonObject: no vertex node is found'
      );
    }

    if (Node.fragmentNodes.length === 0) {
      console.warn(
        'System.createShaderCodesFromJsonObject: no fragment node is found'
      );
    }

    const shaderCodes = ShaderGraphResolver.createShaderCodes(
      json.vertexShaderGlobalData,
      json.fragmentShaderGlobalData
    );

    return shaderCodes;
  }
}
