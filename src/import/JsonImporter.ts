import Node from '../node/Node';
import ShaderFunctionDataRepository from '../node/ShaderFunctionDataRepository';
import {
  ShaderityGraphNode,
  ShaderityGraphJson,
  StandardInputSocketData,
  ShaderFunctions,
  VaryingInputSocketData,
} from '../types/CommonType';

/**
 * This class parses the ShaderityGraphJson and imports it
 * into a format that can be used by this library.
 */
export default class JsonImporter {
  /**
   * Creates nodes and sockets from ShaderityGraphJson, and connects the sockets
   * @param json json to create node graph
   */
  static importShaderityGraphJson(json: ShaderityGraphJson) {
    this.__setShaderFunctions(json.shaderFunctions);

    this.__createNodes(json.shaderityGraphNodes);
    this.__connectSockets(json.shaderityGraphNodes);
  }

  /**
   * @private
   * Register the functions corresponding to each nodes in the ShaderFunctionDataRepository
   */
  private static __setShaderFunctions(shaderFunctions: ShaderFunctions) {
    for (const nodeFunctionName in shaderFunctions) {
      const shaderFunctionData = shaderFunctions[nodeFunctionName];
      ShaderFunctionDataRepository.setShaderFunctionData(
        nodeFunctionName,
        shaderFunctionData
      );
    }
  }

  /**
   * @private
   * Create nodes and the sockets that each node has. At this point,
   * the sockets are not connected to each other. All nodes are independent.
   */
  private static __createNodes(nodesJson: ShaderityGraphNode[]) {
    for (let i = 0; i < nodesJson.length; i++) {
      const nodeJson = nodesJson[i];
      new Node(nodeJson.nodeData, nodeJson.socketDataArray);
    }
  }

  /**
   * @private
   * Connect the socket of each node created by __createNodes method.
   */
  private static __connectSockets(nodesJson: ShaderityGraphNode[]) {
    for (let i = 0; i < nodesJson.length; i++) {
      const outputNodeId = i;
      const outputNodeJson = nodesJson[outputNodeId];

      for (const socketData of outputNodeJson.socketDataArray) {
        if (socketData.direction === 'output') {
          continue;
        }

        const connectableInputSocketData = socketData as
          | StandardInputSocketData
          | VaryingInputSocketData;
        const socketConnectionData =
          connectableInputSocketData.socketConnectionData;
        if (socketConnectionData == null) {
          continue;
        }

        const inputNode = Node.getNodeById(
          socketConnectionData.connectedNodeId
        );
        const outputSocketNameOfInputNode =
          socketConnectionData.connectedSocketName;
        const outputNode = Node.getNodeById(outputNodeId);
        const inputSocketNameOfOutputNode = connectableInputSocketData.name;

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
