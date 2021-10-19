import Node from '../node/Node';
import {ShaderCodes, ShaderityGraphJson} from '../types/CommonType';
import JsonImporter from '../import/JsonImporter';
import ShaderGraphResolver from '../shaderGraph/ShaderGraphResolver';
import ShaderFunctionDataRepository from '../node/ShaderFunctionDataRepository';

export default class NodeConverter {
  //TODO: need to set version
  static readonly shaderityGraphVersion = '';

  public static createShaderCodesFromJsonFile(
    src: string
  ): Promise<ShaderCodes> {
    return fetch(src)
      .then(response => response.json())
      .then((data: ShaderityGraphJson) => {
        return this.createShaderCodesFromJsonObject(data);
      });
  }

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
      json.fragmentShaderGlobalData,
      json.vertexShaderGlobalData
    );

    return shaderCodes;
  }
}
