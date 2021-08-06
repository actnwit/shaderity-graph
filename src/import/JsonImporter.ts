import Node from '../nodes/Node';
import {ShaderityGraphNodeJson} from '../types/CommonType';

export default class JsonImporter {
  static importJsonToNodes(nodesJson: ShaderityGraphNodeJson[]) {
    for (let i = 0; i < nodesJson.length; i++) {
      const nodeJson = nodesJson[i];

      // Node.__nodeId equals to index of the nodesJson array
      const node = new Node(
        nodeJson.shaderityData.shaderStage,
        nodeJson.shaderityData.shaderCode,
        nodeJson.shaderityData.nodeName
      );

      for (const key in nodeJson.inputNodes) {
        node.addInputSocket(key, nodeJson.inputNodes[key].socketType);
      }

      for (const key in nodeJson.outputNodes) {
        node.addOutputSocket(key, nodeJson.outputNodes[key].socketType);
      }
    }
  }
}
