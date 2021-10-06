import {ShaderStage, ShaderStageEnum} from '../types/CommonEnum';
import {
  NodeData,
  ConnectableInputSocketData,
  ConnectableOutputSocketData,
  UniformInputSocketData,
  VaryingInputSocketData,
  AttributeInputSocketData,
} from '../types/CommonType';
import ConnectableInputSocket from '../sockets/input/ConnectableInputSocket';
import ConnectableOutputSocket from '../sockets/output/ConnectableOutputSocket';
import {IConnectableOutputSocket} from '../sockets/output/IConnectableOutputSocket';
import {IConnectableInputSocket} from '../sockets/input/IConnectableInputSocket';
import {INode} from './INode';
import ShaderFunctionDataRepository from './ShaderFunctionDataRepository';
import AbstractConnectableSocket from '../sockets/AbstractConnectableSocket';
import AttributeInputSocket from '../sockets/input/AttributeInputSocket';
import UniformInputSocket from '../sockets/input/UniformInputSocket';
import VaryingInputSocket from '../sockets/input/VaryingInputSocket';
import {INonConnectableInputSocket} from '../sockets/input/INonConnectableInputSocket';

/**
 * The node is a object that has a function.
 * Nodes can be connected to each other via input/output sockets.
 * The function corresponding to a node is managed in the ShaderFunctionDataRepository.
 * Nodes with inputs other than sockets are defined as child classes of this node.
 */
export default class Node implements INode {
  protected static __nodes: Node[] = [];

  protected __shaderFunctionName: string;
  protected __shaderStage: ShaderStageEnum;

  protected __id: number;
  protected __inputSockets: (
    | IConnectableInputSocket
    | INonConnectableInputSocket
  )[] = [];
  protected __outputSockets: IConnectableOutputSocket[] = [];

  constructor(
    nodeData: NodeData,
    socketDataArray: (
      | ConnectableInputSocketData
      | ConnectableOutputSocketData
      | AttributeInputSocketData
      | VaryingInputSocketData
      | UniformInputSocketData
    )[]
  ) {
    this.__shaderFunctionName = nodeData.shaderFunctionName;
    this.__shaderStage = nodeData.shaderStage;

    for (let i = 0; i < socketDataArray.length; i++) {
      const socketData = socketDataArray[i];
      if (socketData.direction === 'input') {
        this.__addInputSocket(
          socketData as
            | ConnectableInputSocketData
            | AttributeInputSocketData
            | VaryingInputSocketData
            | UniformInputSocketData
        );
      } else {
        this.__addOutputSocket(socketData);
      }
    }

    const existShaderFunctionData =
      ShaderFunctionDataRepository.existShaderFunctionData(
        this.__shaderFunctionName
      );
    if (!existShaderFunctionData) {
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

    if (inputSocket.className !== 'ConnectableInputSocket') {
      console.error(
        'Node.connectNodes: the input socket is non-connectable socket'
      );
      return;
    }

    AbstractConnectableSocket.connectSockets(
      inputSocket as ConnectableInputSocket,
      outputSocket
    );
  }

  /**
   * Get the name of the function that corresponds to this node in the shader
   */
  get functionName() {
    return this.__shaderFunctionName;
  }

  /**
   * Get the corresponding node function from ShaderFunctionDataRepository
   */
  get shaderCode() {
    const shaderCode =
      ShaderFunctionDataRepository.getShaderFunctionData(
        this.__shaderFunctionName
      )?.shaderFunctionCode ??
      `// function name ${this.__shaderFunctionName} is not found`;

    return shaderCode;
  }

  /**
   * Get the shaderStage where this node will be used
   */
  get shaderStage() {
    return this.__shaderStage;
  }

  /**
   * Get the webgl extension used by the functions of this node
   */
  get extensions() {
    const extensions =
      ShaderFunctionDataRepository.getShaderFunctionData(
        this.__shaderFunctionName
      )?.extensions ?? [];

    return extensions;
  }

  /**
   * Get the id of this node
   */
  get id() {
    return this.__id;
  }

  /**
   * @private
   * Get the inputSockets of this node
   */
  get _inputSockets() {
    return this.__inputSockets;
  }

  /**
   * @private
   * Get the outputSockets of this node
   */
  get _outputSockets() {
    return this.__outputSockets;
  }

  /**
   * Get connected input node by input socket name
   * */
  getInputNode(socketName: string) {
    const targetSocket = this.__getInputSocket(socketName);
    if (targetSocket == null) {
      return undefined;
    }

    if (targetSocket.className !== 'ConnectableInputSocket') {
      return undefined;
    }

    const cInputSocket = targetSocket as ConnectableInputSocket;
    const connectedNode = cInputSocket.connectedNode;
    return connectedNode;
  }

  /**
   * Get connected output node by output socket name
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
    const resultSocket = this.__inputSockets.find(
      inputSockets => inputSockets.name === socketName
    );

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
    const resultSocket = this.__outputSockets.find(
      outputSockets => outputSockets.name === socketName
    );

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
      | ConnectableInputSocketData
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

    const type = socketData.type;
    const argumentId = socketData.argumentId;

    let inputSocket;
    if ((socketData as AttributeInputSocketData).attribute != null) {
      const aSocketData = socketData as AttributeInputSocketData;
      inputSocket = new AttributeInputSocket(
        type,
        this,
        socketName,
        argumentId,
        aSocketData.attribute
      );
    } else if ((socketData as VaryingInputSocketData).varying != null) {
      const vSocketData = socketData as VaryingInputSocketData;
      inputSocket = new VaryingInputSocket(
        type,
        this,
        socketName,
        argumentId,
        vSocketData.varying
      );
    } else if ((socketData as UniformInputSocketData).uniform != null) {
      const uSocketData = socketData as UniformInputSocketData;
      inputSocket = new UniformInputSocket(
        type,
        this,
        socketName,
        argumentId,
        uSocketData.uniform
      );
    } else {
      const cSocketData = socketData as ConnectableInputSocketData;
      inputSocket = new ConnectableInputSocket(
        socketData.type,
        this,
        socketName,
        socketData.argumentId,
        cSocketData.defaultValue
      );
    }

    this.__inputSockets.push(inputSocket);
  }

  private __checkDuplicationOfInputSocket(socketName: string) {
    const existSocketName = this.__inputSockets.some(
      socket => socket.name === socketName
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

  private __addOutputSocket(socketData: ConnectableOutputSocketData) {
    const socketName = socketData.name;

    const duplicateOutputSocket =
      this.__checkDuplicationOfOutputSocket(socketName);

    if (duplicateOutputSocket) {
      console.error(
        `Node.__checkDuplicationOfOutputSocket: duplicate socketName ${socketName}`
      );
      return;
    }

    const outputSocket = new ConnectableOutputSocket(
      socketData.type,
      this,
      socketName,
      socketData.argumentId
    );
    this.__outputSockets.push(outputSocket);
  }

  private __checkDuplicationOfOutputSocket(socketName: string) {
    const existSocketName = this.__outputSockets.some(
      socket => socket.name === socketName
    );

    if (existSocketName) {
      return true;
    } else {
      return false;
    }
  }
}
