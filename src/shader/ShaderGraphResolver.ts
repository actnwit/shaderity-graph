import Node from '../node/Node';

export default class ShaderGraphResolver {
  static createVertexShaderCode(sortedVertexNodes: Node[]) {
    console.log(sortedVertexNodes);
    return '';
  }

  static createPixelShaderCode(sortedPixelNodes: Node[]) {
    console.log(sortedPixelNodes);
    return '';
  }
}
