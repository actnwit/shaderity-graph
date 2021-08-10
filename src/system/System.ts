import Node from '../nodes/Node';
import {ShaderCodes, ShaderityGraphJson} from '../types/CommonType';
import JsonImporter from '../import/JsonImporter';

export default class System {
  public static createShaderCodes(json: ShaderityGraphJson): ShaderCodes {
    Node.resetNodes();

    // TODO: implement this method
    JsonImporter.importJsonToNodes(json.nodes);

    // TODO: implement this method
    const sortedShaderityGraphNodes = {
      vertexNodes: this.sortTopologically(Node.vertexNodes),
      pixelNodes: this.sortTopologically(Node.pixelNodes),
    };

    // TODO: implement this method
    const vertexShaderCode = this.createVertexShaderCode(
      sortedShaderityGraphNodes.vertexNodes
    );

    // TODO: implement this method
    const pixelShaderCode = this.createPixelShaderCode(
      sortedShaderityGraphNodes.pixelNodes
    );

    return {
      vertexShaderCode: vertexShaderCode,
      pixelShaderCode: pixelShaderCode,
    };
  }

  static sortTopologically(shaderityNodes: Node[]): Node[] {
    console.log(shaderityNodes);
    return [];
  }

  static createVertexShaderCode(vertexShaderityNodes: Node[]) {
    console.log(vertexShaderityNodes);
    return '';
  }

  static createPixelShaderCode(pixelShaderityNodes: Node[]) {
    console.log(pixelShaderityNodes);
    return '';
  }
}
