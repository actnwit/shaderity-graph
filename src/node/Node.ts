import {
  ShaderStage,
  ShaderStageEnum,
  SocketTypeEnum,
} from '../types/CommonEnum';
import {InputSocketData, NodeData, OutputSocketData} from '../types/CommonType';
import ConnectableInputSocket from '../sockets/input/ConnectableInputSocket';
import ConnectableOutputSocket from '../sockets/output/ConnectableOutputSocket';
import {IConnectableOutputSocket} from '../sockets/output/IConnectableOutputSocket';
import {IConnectableInputSocket} from '../sockets/input/IConnectableInputSocket';
import {INode, NodeClassNames} from './INode';
import ShaderFunctionDataRepository from './ShaderFunctionDataRepository';
import AbstractConnectableSocket from '../sockets/AbstractConnectableSocket';

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
  protected __inputSockets: IConnectableInputSocket[] = [];
  protected __outputSockets: IConnectableOutputSocket[] = [];

  constructor(
    nodeData: NodeData,
    socketData: (InputSocketData | OutputSocketData)[]
  ) {
    this.__shaderFunctionName = nodeData.shaderFunctionName;
    this.__shaderStage = nodeData.shaderStage;

    for (let i = 0; i < socketData.length; i++) {
      const socketDatum = socketData[i];
      if (socketDatum.direction === 'input') {
        this.__addInputSocket(
          socketDatum.name,
          socketDatum.type,
          socketDatum.argumentId,
          (socketDatum as InputSocketData).defaultValue
        );
      } else {
        this.__addOutputSocket(
          socketDatum.name,
          socketDatum.type,
          socketDatum.argumentId
        );
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

    AbstractConnectableSocket.connectSockets(inputSocket, outputSocket);
  }

  /**
   * Get the className
   */
  get className(): NodeClassNames {
    return 'Node';
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

    const connectedNode = targetSocket.connectedNode;
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
   * @param socketName name(key) of adding input socket
   * @param socketType glsl type of data to be passed by this socket.
   * @param argumentId The location of the argument of the node function corresponding to this input socket.
   *                   (e.g. argumentId=0 means that this socket corresponds to the first argument of the node's function)
   *                   (e.g. argumentId=1 means that this socket corresponds to the second argument of the node's function)
   * @param defaultValue use this value as input if this socket does not connect with any socket
   */
  private __addInputSocket(
    socketName: string,
    socketType: SocketTypeEnum,
    argumentId: number,
    defaultValue: number[]
  ) {
    const existSocketName = this.__inputSockets.some(
      socket => socket.name === socketName
    );

    if (existSocketName) {
      console.warn('Node.addInputSocket: duplicate socketName');
    }

    const inputSocket = new ConnectableInputSocket(
      socketType,
      this,
      socketName,
      argumentId,
      defaultValue
    );
    this.__inputSockets.push(inputSocket);
  }

  /**
   * @private
   * Add output socket of this node to connect another node
   * @param socketName name(key) of adding output socket
   * @param socketType glsl type of adding output socket
   * @param argumentId The location of the argument of the node function corresponding to this output socket.
   *                   (e.g. argumentId=0 means that this socket corresponds to the first argument of the node's function)
   *                   (e.g. argumentId=1 means that this socket corresponds to the second argument of the node's function)
   * @param defaultValue use this value as output if this socket does not connect with any socket
   */

  private __addOutputSocket(
    socketName: string,
    socketType: SocketTypeEnum,
    argumentId: number
  ) {
    const existSocketName = this.__outputSockets.some(
      socket => socket.name === socketName
    );

    if (existSocketName) {
      console.warn('Node.addOutputSocket: duplicate socketName');
    }

    const outputSocket = new ConnectableOutputSocket(
      socketType,
      this,
      socketName,
      argumentId
    );
    this.__outputSockets.push(outputSocket);
  }
}
