import Node from '../node/Node';
import {ShaderCodes, ShaderityGraphJson} from '../types/CommonType';
import JsonImporter from '../import/JsonImporter';
import NodeSorter from '../node/NodeSorter';
import ShaderGraphResolver from '../shader/ShaderGraphResolver';

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

    JsonImporter.importJsonToNodes(json.nodes);

    const sortedShaderityGraphNodes = {
      vertexNodes: NodeSorter.sortTopologically(Node.vertexNodes),
      pixelNodes: NodeSorter.sortTopologically(Node.pixelNodes),
    };

    const vertexShaderCode = ShaderGraphResolver.createVertexShaderCode(
      sortedShaderityGraphNodes.vertexNodes
    );

    const pixelShaderCode = ShaderGraphResolver.createPixelShaderCode(
      sortedShaderityGraphNodes.pixelNodes
    );

    return {
      vertexShaderCode,
      pixelShaderCode,
    };
  }
}
