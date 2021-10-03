import Node from '../node/Node';
import {ShaderCodes, ShaderityGraphJson} from '../types/CommonType';
import JsonImporter from '../import/JsonImporter';
import NodeSorter from './NodeSorter';
import ShaderGraphResolver from '../shader/ShaderGraphResolver';
import ShaderFunctionDataRepository from '../node/ShaderFunctionDataRepository';

export default class System {
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

    const sortedVertexNode = NodeSorter.sortTopologically(Node.vertexNodes);
    const sortedFragmentNode = NodeSorter.sortTopologically(Node.fragmentNodes);

    const vertexShaderCode = ShaderGraphResolver.createShaderCode(
      sortedVertexNode,
      'vertex',
      json.vertexShaderGlobalData
    );

    const fragmentShaderCode = ShaderGraphResolver.createShaderCode(
      sortedFragmentNode,
      'fragment',
      json.fragmentShaderGlobalData
    );

    return {
      vertexShader: vertexShaderCode,
      fragmentShader: fragmentShaderCode,
    };
  }
}
