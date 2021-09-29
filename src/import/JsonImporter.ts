import AttributeInputNode from '../node/AttributeInputNode';
import Node from '../node/Node';
import UniformInputNode from '../node/UniformInputNode';
import VaryingInputNode from '../node/VaryingInputNode';
import {
  AttributeInputNodeData,
  InputSocketData,
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

      for (let i = 0; i < nodeJson.socketData.length; i++) {
        const socketData = nodeJson.socketData[i];
        const socketType = socketData.type;

        if (socketData.direction === 'input') {
          node.addInputSocket(
            socketData.name,
            socketType,
            socketData.argumentId
          );
        } else {
          node.addOutputSocket(
            socketData.name,
            socketType,
            socketData.argumentId
          );
        }
      }
    }
  }

  private static __connectSockets(nodesJson: ShaderityGraphNode[]) {
    for (let i = 0; i < nodesJson.length; i++) {
      const outputNodeId = i;
      const outputNodeJson = nodesJson[outputNodeId];

      for (const socketData of outputNodeJson.socketData) {
        if (socketData.direction === 'output') {
          continue;
        }

        const inputSocketData = socketData as InputSocketData;
        const socketConnectionData = inputSocketData.socketConnectionDatum;
        if (socketConnectionData == null) {
          continue;
        }

        const inputNode = Node.getNodeById(
          socketConnectionData.connectedNodeId
        );
        const outputSocketNameOfInputNode =
          socketConnectionData.connectedSocketName;
        const outputNode = Node.getNodeById(outputNodeId);
        const inputSocketNameOfOutputNode = inputSocketData.name;

        Node.connectNodes(
          inputNode,
          outputSocketNameOfInputNode,
          outputNode,
          inputSocketNameOfOutputNode
        );
      }
    }
  }
}
