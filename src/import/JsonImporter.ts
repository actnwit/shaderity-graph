import Node from '../node/Node';
import ShaderFunctionCodeRepository from '../node/ShaderFunctionCodeRepository';
import {
  ShaderityGraphNode,
  ShaderityGraphJson,
  StandardInputSocketData,
  ShaderFunctionCodeObject,
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
    this.__setShaderFunctions(json.shaderFunctionCodeObject);

    this.__createNodes(json.shaderityGraphNodes);
    this.__connectSockets(json.shaderityGraphNodes);
  }

  /**
   * @private
   * Register the functions corresponding to each nodes in the ShaderFunctionCodeRepository
   */
  private static __setShaderFunctions(
    shaderFunctionCodeObject: ShaderFunctionCodeObject
  ) {
    for (const nodeFunctionName in shaderFunctionCodeObject) {
      const shaderFunctionCode = shaderFunctionCodeObject[nodeFunctionName];
      ShaderFunctionCodeRepository.setShaderFunctionCode(
        nodeFunctionName,
        shaderFunctionCode
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

        const inputSocketData = socketData as StandardInputSocketData;
        const socketConnectionData = inputSocketData.socketConnectionData;
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
