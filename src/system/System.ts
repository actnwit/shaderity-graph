import Node from '../nodes/Node';
import {
  ShaderCodes,
  ShaderityGraphJson,
  ShaderityGraphNodeJson,
} from '../types/CommonType';

export default class System {
  public static createShaderCodes(json: ShaderityGraphJson): ShaderCodes {
    Node.resetNodes();

    // TODO: implement this method
    const shaderityNodes = this.createShaderityNodes(json.nodes);

    // TODO: implement this method
    const vertexShaderCode = this.createVertexShaderCode(
      shaderityNodes.vertexShaderNodes
    );

    // TODO: implement this method
    const pixelShaderCode = this.createPixelShaderCode(
      shaderityNodes.pixelShaderNodes
    );

    return {
      vertexShaderCode: vertexShaderCode,
      pixelShaderCode: pixelShaderCode,
    };
  }

  static createShaderityNodes(nodesJson: ShaderityGraphNodeJson[]) {
    console.log(nodesJson);
    return {
      vertexShaderNodes: [] as Node[],
      pixelShaderNodes: [] as Node[],
    };
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
