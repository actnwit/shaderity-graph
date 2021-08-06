import Node from '../nodes/Node';
import {ShaderityGraphNodeJson} from '../types/CommonType';

export default class JsonImporter {
  static importJsonToNodes(nodesJson: ShaderityGraphNodeJson[]) {
    for (let i = 0; i < nodesJson.length; i++) {
      const nodeJson = nodesJson[i];

      // Node.__nodeId equals to index of the nodesJson array
      new Node(
        nodeJson.shaderityData.shaderStage,
        nodeJson.shaderityData.shaderCode,
        nodeJson.shaderityData.nodeName
      );
    }
  }
}
