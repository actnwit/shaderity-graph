import ShaderityNode from '../node/ShaderityNode';
import {ShaderityObjects, ShaderityGraphJson} from '../types/CommonType';
import JsonImporter from '../import/JsonImporter';
import ShaderGraphResolver from '../shaderGraph/ShaderGraphResolver';
import ShaderFunctionDataRepository from '../node/ShaderFunctionDataRepository';

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
   * Converts a file of ShaderityGraphJson to shaderity objects
   * @param src path of the json file
   */
  public static createShaderityObjectsFromJsonFile(
    src: string
  ): Promise<ShaderityObjects> {
    return fetch(src)
      .then(response => response.json())
      .then((data: ShaderityGraphJson) => {
        return this.createShaderityObjectsFromJsonObject(data);
      });
  }

  /**
   * Converts a ShaderityGraphJson object to shaderity objects
   * @param json object of ShaderityGraphJson
   */
  public static createShaderityObjectsFromJsonObject(
    json: ShaderityGraphJson
  ): ShaderityObjects {
    if (json.version !== this.shaderityGraphVersion) {
      console.warn(
        'System.createShaderCodesFromJsonObject: mismatch version between json and system'
      );
    }

    ShaderityNode.resetNodes();
    ShaderFunctionDataRepository.resetRepository();

    JsonImporter.importShaderityGraphJson(json);

    if (ShaderityNode.vertexNodes.length === 0) {
      console.warn(
        'System.createShaderCodesFromJsonObject: no vertex node is found'
      );
    }

    if (ShaderityNode.fragmentNodes.length === 0) {
      console.warn(
        'System.createShaderCodesFromJsonObject: no fragment node is found'
      );
    }

    const shaderCodes = ShaderGraphResolver.createShaderityObjects(
      json.vertexShaderGlobalData,
      json.fragmentShaderGlobalData
    );

    return shaderCodes;
  }
}
