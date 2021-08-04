import {ShaderCodes} from '../types/CommonType';

export default class System {
  public static createShaderCodes(json: Object): ShaderCodes {
    // TODO: implement this method
    const shaderityNodes = this.createShaderityNodes(json);

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

  static createShaderityNodes(json: Object) {
    console.log(json);
    return {
      vertexShaderNodes: [] as unknown[],
      pixelShaderNodes: [] as unknown[],
    };
  }

  static createVertexShaderCode(vertexShaderityNodes: unknown[]) {
    console.log(vertexShaderityNodes);
    return '';
  }

  static createPixelShaderCode(pixelShaderityNodes: unknown[]) {
    console.log(pixelShaderityNodes);
    return '';
  }
}
