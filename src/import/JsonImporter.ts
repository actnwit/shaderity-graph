import Node from '../nodes/Node';
import AbstractSocket from '../sockets/AbstractSocket';
import InputSocket from '../sockets/InputSocket';
import OutputSocket from '../sockets/OutputSocket';
import {ShaderityGraphNodeJson} from '../types/CommonType';

export default class JsonImporter {
  static importJsonToNodes(nodesJson: ShaderityGraphNodeJson[]) {
    this.__createNodes(nodesJson);
    this.__connectSockets(nodesJson);
  }

  private static __createNodes(nodesJson: ShaderityGraphNodeJson[]) {
    for (let i = 0; i < nodesJson.length; i++) {
      const nodeJson = nodesJson[i];

      // Node.__nodeId equals to index of the nodesJson array
      const node = new Node(
        nodeJson.shaderityData.shaderStage,
        nodeJson.shaderityData.shaderCode,
        nodeJson.shaderityData.nodeName
      );

      for (const key in nodeJson.inputNodes) {
        const socketType = nodeJson.inputNodes[key].socketType;
        node.addInputSocket(key, socketType);
      }

      for (const key in nodeJson.outputNodes) {
        const socketType = nodeJson.outputNodes[key].socketType;
        node.addOutputSocket(key, socketType);
      }
    }
  }

  private static __connectSockets(nodesJson: ShaderityGraphNodeJson[]) {
    const nodes = Node.allNodes;
    for (let i = 0; i < nodesJson.length; i++) {
      const outputNodeId = i;
      const outputNodeJson = nodesJson[outputNodeId];

      for (const inSocketKey in outputNodeJson.inputNodes) {
        const inputNodeId = outputNodeJson.inputNodes[inSocketKey].nodeId;
        const inputNodeJson = nodesJson[inputNodeId];

        for (const outSocketKey in inputNodeJson.outputNodes) {
          const nodeId = inputNodeJson.outputNodes[outSocketKey].nodeId;

          if (nodeId === outputNodeId) {
            const inputNode = nodes[inputNodeId];
            const socketOfInputNode = inputNode.getOutputSocket(
              outSocketKey
            ) as OutputSocket;
            const outputNode = nodes[outputNodeId];
            const socketOfOutputNode = outputNode.getInputSocket(
              inSocketKey
            ) as InputSocket;

            AbstractSocket.connectSockets(
              socketOfInputNode,
              socketOfOutputNode
            );
            break;
          }
        }
      }
    }
  }
}
