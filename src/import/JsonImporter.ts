import AttributeInputNode from '../node/AttributeInputNode';
import Node from '../node/Node';
import UniformInputNode from '../node/UniformInputNode';
import VaryingInputNode from '../node/VaryingInputNode';
import AbstractSocket from '../sockets/AbstractSocket';
import InputSocket from '../sockets/InputSocket';
import OutputSocket from '../sockets/OutputSocket';
import {
  AttributeInputNodeData,
  ShaderityGraphNode,
  UniformInputNodeData,
  VaryingInputNodeData,
} from '../types/CommonType';

export default class JsonImporter {
  static importJsonToNodes(nodesJson: ShaderityGraphNode[]) {
    this.__createNodes(nodesJson);
    this.__connectSockets(nodesJson);
  }

  private static __createNodes(nodesJson: ShaderityGraphNode[]) {
    for (let i = 0; i < nodesJson.length; i++) {
      const nodeJson = nodesJson[i];
      const nodeData = nodeJson.nodeData;

      // Node.__nodeId equals to index of the nodesJson array
      let node: Node;
      if ((nodeData as AttributeInputNodeData).attribute != null) {
        node = new AttributeInputNode(nodeData as AttributeInputNodeData);
      } else if ((nodeData as VaryingInputNodeData).varying != null) {
        node = new VaryingInputNode(nodeData as VaryingInputNodeData);
      } else if ((nodeData as UniformInputNodeData).uniform != null) {
        node = new UniformInputNode(nodeData as UniformInputNodeData);
      } else {
        node = new Node(nodeData);
      }

      for (const key in nodeJson.inputNodes) {
        const socketType = nodeJson.inputNodes[key].socketType;
        node.addInputSocket(
          key,
          socketType,
          nodeJson.inputNodes[key].argumentId
        );
      }

      for (const key in nodeJson.outputNodes) {
        const socketType = nodeJson.outputNodes[key].socketType;
        node.addOutputSocket(
          key,
          socketType,
          nodeJson.outputNodes[key].argumentId
        );
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
              socketOfOutputNode,
              socketOfInputNode
            );
            break;
          }
        }
      }
    }
  }
}
