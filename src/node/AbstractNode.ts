import {ShaderStage, ShaderStageEnum} from '../types/CommonEnum';
import {NodeData, SocketData} from '../types/CommonType';
import StandardInputSocket from '../sockets/input/StandardInputSocket';
import StandardOutputSocket from '../sockets/output/StandardOutputSocket';
import AttributeInputSocket from '../sockets/input/AttributeInputSocket';
import UniformInputSocket from '../sockets/input/UniformInputSocket';
import VaryingInputSocket from '../sockets/input/VaryingInputSocket';
import {ISocket} from '../sockets/interface/ISocket';
import VaryingOutputSocket from '../sockets/output/VaryingOutputSocket';
import {INode, NodeClassName} from './INode';
import SamplerInputSocket from '../sockets/input/SamplerInputSocket';
import SamplerOutputSocket from '../sockets/output/SamplerOutputSocket';

/**
 * A node is an object that has sockets for input and output.
 */
export default abstract class AbstractNode implements INode {
  private static __nodes: AbstractNode[] = [];

  private __shaderStage: ShaderStageEnum;
  private __id: number;

  private __sockets: ISocket[] = [];

  protected static __existVertexShaderOutputSocket = false;
  protected static __existFragmentShaderOutputSocket = false;

  /**
   * Create a new node
   * @param nodeData contains data of shader stage
   */
  constructor(nodeData: NodeData, socketDataArray: SocketData[]) {
    this.__shaderStage = nodeData.shaderStage;
    this.__id = AbstractNode.__nodes.length;
    AbstractNode.__nodes[this.__id] = this;

    this.__addSockets(socketDataArray);
  }

  /**
   * Get all created nodes
   */
  static get allNodes(): AbstractNode[] {
    return this.__nodes;
  }

  /**
   * Get all created vertex nodes
   */
  static get vertexNodes(): AbstractNode[] {
    return this.__nodes.filter(node => node.shaderStage === ShaderStage.Vertex);
  }

  /**
   * Get all created fragment nodes
   */
  static get fragmentNodes(): AbstractNode[] {
    return this.__nodes.filter(
      node => node.shaderStage === ShaderStage.Fragment
    );
  }

  /**
   * Remove all created nodes
   */
  static resetNodes() {
    this.__existVertexShaderOutputSocket = false;
    this.__existFragmentShaderOutputSocket = false;
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
    inputNode: AbstractNode,
    outputSocketNameOfInputNode: string,
    outputNode: AbstractNode,
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
      inputSocket.connectSocketWith(outputSocket);
      return;
    }

    if (
      inputSocket.className === 'VaryingInputSocket' &&
      outputSocket.className === 'VaryingOutputSocket'
    ) {
      inputSocket.connectSocketWith(outputSocket);
      return;
    }

    if (
      inputSocket.className === 'SamplerInputSocket' &&
      outputSocket.className === 'SamplerOutputSocket'
    ) {
      inputSocket.connectSocketWith(outputSocket);
      return;
    }

    console.error('Node.connectNodes: cannot connect these sockets');
  }

  /**
   * Get the shaderStage
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
   * Get variable name corresponding specified socket
   * Return '' if the socket is not found or is StandardInputSocket
   * */
  getVariableNameOfInputSocket(socketName: string) {
    const socket = this.__getInputSocket(socketName);
    if (socket == null || socket.className === 'StandardInputSocket') {
      return '';
    } else {
      return socket.variableName;
    }
  }

  /**
   * @private
   * Get input socket by socket name
   * */
  private __getInputSocket(socketName: string) {
    const resultSocket = this.__sockets.find(
      socket => socket.isInputSocket() && socket.socketName === socketName
    ) as
      | StandardInputSocket
      | AttributeInputSocket
      | VaryingInputSocket
      | UniformInputSocket
      | SamplerInputSocket;

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
      socket => !socket.isInputSocket() && socket.socketName === socketName
    ) as StandardOutputSocket | VaryingOutputSocket | SamplerOutputSocket;

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
   * Add socket to this node
   */
  protected __addSocket(socket: ISocket) {
    this.__sockets.push(socket);
  }

  /**
   * @private
   * Get the class name of this instance
   */
  abstract get className(): NodeClassName;

  /**
   * @private
   * attach sockets to this node
   */
  protected abstract __addSockets(socketDataArray: SocketData[]): void;
}
