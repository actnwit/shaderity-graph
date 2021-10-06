import AttributeInputNode from '../node/AttributeInputNode';
import Node from '../node/Node';
import shaderFunctionDataRepository from '../node/ShaderFunctionDataRepository';
import UniformInputNode from '../node/UniformInputNode';
import VaryingInputNode from '../node/VaryingInputNode';
import {
  AttributeInputNodeData,
  ShaderityGraphNode,
  UniformInputNodeData,
  VaryingInputNodeData,
  ShaderityGraphJson,
  ShaderFunctionData,
  ConnectableInputSocketData,
} from '../types/CommonType';

export default class JsonImporter {
  static importShaderityGraphJson(json: ShaderityGraphJson) {
    this.shaderFunctionData(json.shaderFunctionDataObject);

    this.__createNodes(json.nodes);
    this.__connectSockets(json.nodes);
  }

  private static shaderFunctionData(shaderFunctionDataObject: {
    [shaderFunctionName: string]: ShaderFunctionData;
  }) {
    for (const nodeFunctionName in shaderFunctionDataObject) {
      const shaderFunctionData = shaderFunctionDataObject[nodeFunctionName];
      shaderFunctionDataRepository.setShaderFunctionData(
        nodeFunctionName,
        shaderFunctionData
      );
    }
  }

  private static __createNodes(nodesJson: ShaderityGraphNode[]) {
    for (let i = 0; i < nodesJson.length; i++) {
      const nodeJson = nodesJson[i];
      const nodeData = nodeJson.nodeData;
      const socketData = nodeJson.socketDataArray;

      if ((nodeData as AttributeInputNodeData).attribute != null) {
        const attributeInputNode = nodeData as AttributeInputNodeData;
        new AttributeInputNode(attributeInputNode, socketData);
      } else if ((nodeData as VaryingInputNodeData).varying != null) {
        const varyingInputNodeData = nodeData as VaryingInputNodeData;
        new VaryingInputNode(varyingInputNodeData, socketData);
      } else if ((nodeData as UniformInputNodeData).uniform != null) {
        const uniformInputNodeData = nodeData as UniformInputNodeData;
        new UniformInputNode(uniformInputNodeData, socketData);
      } else {
        new Node(nodeData, socketData);
      }
    }
  }

  private static __connectSockets(nodesJson: ShaderityGraphNode[]) {
    for (let i = 0; i < nodesJson.length; i++) {
      const outputNodeId = i;
      const outputNodeJson = nodesJson[outputNodeId];

      for (const socketData of outputNodeJson.socketDataArray) {
        if (socketData.direction === 'output') {
          continue;
        }

        const inputSocketData = socketData as ConnectableInputSocketData;
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
