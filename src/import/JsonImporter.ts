import Node from '../node/Node';
import AbstractSocket from '../sockets/AbstractSocket';
import InputSocket from '../sockets/InputSocket';
import OutputSocket from '../sockets/OutputSocket';
import {ShaderityGraphNode} from '../types/CommonType';

export default class JsonImporter {
  static importJsonToNodes(nodesJson: ShaderityGraphNode[]) {
    this.__createNodes(nodesJson);
    this.__connectSockets(nodesJson);
  }

  private static __createNodes(nodesJson: ShaderityGraphNode[]) {
    for (let i = 0; i < nodesJson.length; i++) {
      const nodeJson = nodesJson[i];

      // Node.__nodeId equals to index of the nodesJson array
      const node = new Node(nodeJson.nodeData);

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

  private static __connectSockets(nodesJson: ShaderityGraphNode[]) {
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
