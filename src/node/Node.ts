import {
  ShaderStage,
  ShaderStageEnum,
  SocketDirection,
} from '../types/CommonEnum';
import {
  NodeData,
  StandardInputSocketData,
  StandardOutputSocketData,
  UniformInputSocketData,
  VaryingInputSocketData,
  AttributeInputSocketData,
  VaryingOutputSocketData,
  SocketData,
} from '../types/CommonType';
import StandardInputSocket from '../sockets/input/StandardInputSocket';
import StandardOutputSocket from '../sockets/output/StandardOutputSocket';
import {INode} from './INode';
import ShaderFunctionDataRepository from './ShaderFunctionDataRepository';
import AbstractStandardSocket from '../sockets/abstract/AbstractStandardSocket';
import AttributeInputSocket from '../sockets/input/AttributeInputSocket';
import UniformInputSocket from '../sockets/input/UniformInputSocket';
import VaryingInputSocket from '../sockets/input/VaryingInputSocket';
import {ISocket} from '../sockets/interface/ISocket';
import VaryingOutputSocket from '../sockets/output/VaryingOutputSocket';
import AbstractVaryingSocket from '../sockets/abstract/AbstractVaryingSocket';

/**
 * A node is an object that contains functions to be used in the shader.
 * Each node has its sockets for input and output.
 * The sockets corresponds to a function argument of a node.
 *
 * The node graph which is the collection of connected nodes is transformed into a shader by
 * calling the node functions sequentially. Nodes are connected to each other via standard
 * sockets, and data can be passed between them.
 *
 * Note: Data of attribute/varying/uniform variable must be passed to a node through a
 *       non-standard socket such as AttributeInputSocket/VaryingInputSocket/UniformInputSocket.
 *       Do not write these variables directly into the function of each node.
 *       They must be specified in the function arguments.
 */
export default class Node implements INode {
  protected static __nodes: Node[] = [];

  protected __shaderFunctionName: string;
  protected __shaderStage: ShaderStageEnum;

  protected __id: number;
  protected __sockets: ISocket[] = [];

  /**
   * Create a new node
   * @param nodeData define shader function name and shader stage
   * @param socketDataArray define sockets. The order of the socketData must match the order of
   *                        the arguments of the node's shader function.
   */
  constructor(nodeData: NodeData, socketDataArray: SocketData[]) {
    this.__shaderFunctionName = nodeData.shaderFunctionName;
    this.__shaderStage = nodeData.shaderStage;

    for (let i = 0; i < socketDataArray.length; i++) {
      const socketData = socketDataArray[i];
      if (socketData.direction === SocketDirection.Input) {
        this.__addInputSocket(socketData);
      } else {
        this.__addOutputSocket(socketData);
      }
    }

    const existShaderFunctionCode =
      ShaderFunctionDataRepository.existShaderFunctionCode(
        this.__shaderFunctionName
      );
    if (!existShaderFunctionCode) {
      console.warn(
        `Node: function ${this.__shaderFunctionName} is not found in ShaderFunctionDataRepository`
      );
    }

    this.__id = Node.__nodes.length;
    Node.__nodes[this.__id] = this;
  }

  /**
   * Get all created nodes
   */
  static get allNodes(): Node[] {
    return this.__nodes;
  }

  /**
   * Get all created vertex nodes
   */
  static get vertexNodes(): Node[] {
    const vertexNodes: Node[] = [];
    for (const node of this.__nodes) {
      if (node.shaderStage === ShaderStage.Vertex) {
        vertexNodes.push(node);
      }
    }
    return vertexNodes;
  }

  /**
   * Get all created fragment nodes
   */
  static get fragmentNodes(): Node[] {
    const fragmentNodes: Node[] = [];
    for (const node of this.__nodes) {
      if (node.shaderStage === ShaderStage.Fragment) {
        fragmentNodes.push(node);
      }
    }
    return fragmentNodes;
  }

  /**
   * Remove all created nodes
   */
  static resetNodes() {
    this.__nodes.length = 0;
  }

  /**
   * Get the node with the specified id
   */
  static getNodeById(id: number) {
    return this.__nodes[id];
  }

  /**
   * Connects two nodes via a specified socket.
   * @param inputNode previous node
   * @param outputSocketNameOfInputNode the socket name to be connected on the previous node
   * @param outputNode post node
   * @param inputSocketNameOfOutputNode the socket name to be connected on the post node
   */
  static connectNodes(
    inputNode: Node,
    outputSocketNameOfInputNode: string,
    outputNode: Node,
    inputSocketNameOfOutputNode: string
  ) {
    const outputSocket = inputNode.__getOutputSocket(
      outputSocketNameOfInputNode
    );
    const inputSocket = outputNode.__getInputSocket(
      inputSocketNameOfOutputNode
    );

    if (inputSocket == null || outputSocket == null) {
      console.error('Node.connectNodes: socket is not found');
      return;
    }

    if (
      inputSocket.className === 'StandardInputSocket' &&
      outputSocket.className === 'StandardOutputSocket'
    ) {
      AbstractStandardSocket.connectSockets(inputSocket, outputSocket);
      return;
    }

    if (
      inputSocket.className === 'VaryingInputSocket' &&
      outputSocket.className === 'VaryingOutputSocket'
    ) {
      AbstractVaryingSocket.connectSockets(inputSocket, outputSocket);
      return;
    }

    console.error('Node.connectNodes: the input socket is non-standard socket');
  }

  /**
   * Get the name of the function that corresponds to this node in the shader
   */
  get functionName() {
    return this.__shaderFunctionName;
  }

  /**
   * Get the corresponding function of this node from ShaderFunctionDataRepository
   */
  get shaderCode() {
    const shaderCode =
      ShaderFunctionDataRepository.getShaderFunctionCode(
        this.__shaderFunctionName
      )?.code ?? `// function name ${this.__shaderFunctionName} is not found`;

    return shaderCode;
  }

  /**
   * Get the shaderStage where this node will be used
   */
  get shaderStage() {
    return this.__shaderStage;
  }

  /**
   * Get the id of this node
   */
  get id() {
    return this.__id;
  }

  /**
   * @private
   * Get the webgl extension used by the functions of this node
   */
  get _extensions() {
    const extensions =
      ShaderFunctionDataRepository.getShaderFunctionCode(
        this.__shaderFunctionName
      )?.extensions ?? [];

    return extensions;
  }

  /**
   * @private
   * Get all the sockets of this node
   */
  get _sockets() {
    return this.__sockets;
  }

  /**
   * Get connected previous node by input socket name
   * */
  getInputNode(socketName: string) {
    const targetSocket = this.__getInputSocket(socketName);
    if (targetSocket == null) {
      return undefined;
    }

    if (
      targetSocket.className === 'AttributeInputSocket' ||
      targetSocket.className === 'UniformInputSocket'
    ) {
      // non-connectable socket cannot connect another node
      return undefined;
    }

    const connectedNode = targetSocket.connectedNode;
    return connectedNode;
  }

  /**
   * Get connected following node by output socket name
   * */
  getOutputNodes(socketName: string) {
    const targetSocket = this.__getOutputSocket(socketName);
    if (targetSocket == null) {
      return [];
    }

    const connectedNodes = targetSocket.connectedNodes;
    return connectedNodes;
  }

  /**
   * @private
   * Get input socket by socket name
   * */
  private __getInputSocket(socketName: string) {
    const resultSocket = this.__sockets.find(
      socket => socket.isInputSocket() && socket.name === socketName
    ) as
      | StandardInputSocket
      | AttributeInputSocket
      | VaryingInputSocket
      | UniformInputSocket;

    if (resultSocket == null) {
      console.error(
        `Node.__getInputSocket: socket name ${socketName} is not exist`
      );
      return undefined;
    }

    return resultSocket;
  }

  /**
   * @private
   * Get output socket by socket name
   * */
  private __getOutputSocket(socketName: string) {
    const resultSocket = this.__sockets.find(
      socket => !socket.isInputSocket() && socket.name === socketName
    ) as StandardOutputSocket | VaryingOutputSocket;

    if (resultSocket == null) {
      console.error(
        `Node.__getOutputSocket: socket name ${socketName} is not exist`
      );
      return undefined;
    }

    return resultSocket;
  }

  /**
   * @private
   * Add input socket of this node to connect another node
   */
  private __addInputSocket(
    socketData:
      | StandardInputSocketData
      | AttributeInputSocketData
      | VaryingInputSocketData
      | UniformInputSocketData
  ) {
    const socketName = socketData.name;

    const duplicateInputSocket =
      this.__checkDuplicationOfInputSocket(socketName);

    if (duplicateInputSocket) {
      console.error(
        `Node.__checkDuplicationOfInputSocket: duplicate socketName ${socketName}`
      );
      return;
    }

    let inputSocket;
    if ((socketData as AttributeInputSocketData).attributeData != null) {
      const aSocketData = socketData as AttributeInputSocketData;
      inputSocket = new AttributeInputSocket(
        this,
        socketName,
        aSocketData.attributeData
      );
    } else if ((socketData as VaryingInputSocketData).varyingData != null) {
      const vSocketData = socketData as VaryingInputSocketData;
      inputSocket = new VaryingInputSocket(
        this,
        socketName,
        vSocketData.varyingData
      );
    } else if ((socketData as UniformInputSocketData).uniformData != null) {
      const uSocketData = socketData as UniformInputSocketData;
      inputSocket = new UniformInputSocket(
        this,
        socketName,
        uSocketData.uniformData
      );
    } else {
      const sSocketData = socketData as StandardInputSocketData;
      inputSocket = new StandardInputSocket(
        sSocketData.type,
        this,
        socketName,
        sSocketData.defaultValue
      );
    }

    this.__sockets.push(inputSocket);
  }

  private __checkDuplicationOfInputSocket(socketName: string) {
    const existSocketName = this.__sockets.some(
      socket => socket.isInputSocket() && socket.name === socketName
    );

    if (existSocketName) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @private
   * Add output socket of this node to connect another node
   */

  private __addOutputSocket(
    socketData: StandardOutputSocketData | VaryingOutputSocketData
  ) {
    const socketName = socketData.name;

    const duplicateOutputSocket =
      this.__checkDuplicationOfOutputSocket(socketName);

    if (duplicateOutputSocket) {
      console.error(
        `Node.__checkDuplicationOfOutputSocket: duplicate socketName ${socketName}`
      );
      return;
    }

    let outputSocket;
    if ((socketData as VaryingOutputSocketData).varyingData != null) {
      const vSocketData = socketData as VaryingOutputSocketData;
      outputSocket = new VaryingOutputSocket(
        this,
        socketName,
        vSocketData.varyingData
      );
    } else {
      const sSocketData = socketData as StandardOutputSocketData;
      outputSocket = new StandardOutputSocket(
        sSocketData.type,
        this,
        socketName
      );
    }

    this.__sockets.push(outputSocket);
  }

  private __checkDuplicationOfOutputSocket(socketName: string) {
    const existSocketName = this.__sockets.some(
      socket => !socket.isInputSocket() && socket.name === socketName
    );

    if (existSocketName) {
      return true;
    } else {
      return false;
    }
  }
}
