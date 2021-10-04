import {ShaderStage, SocketTypeEnum} from '../types/CommonEnum';
import {NodeData} from '../types/CommonType';
import InputSocket from '../sockets/InputSocket';
import OutputSocket from '../sockets/OutputSocket';
import {IOutputSocket} from '../sockets/IOutputSocket';
import {IInputSocket} from '../sockets/IInputSocket';
import AbstractSocket from '../sockets/AbstractSocket';
import ShaderFunctionDataRepository from './ShaderFunctionDataRepository';
import {INode} from './INode';

export type NodeClassNames =
  | 'Node'
  | 'AttributeInputNode'
  | 'VaryingInputNode'
  | 'UniformInputNode';

export default class Node implements INode {
  protected static __nodes: Node[] = [];

  protected __shaderFunctionName: string;
  protected __shaderFunctionDataId: number;
  protected __shaderStage: 'vertex' | 'fragment' | 'noUse';

  protected __id: number;
  protected __inputSockets: IInputSocket[] = [];
  protected __outputSockets: IOutputSocket[] = [];

  constructor(nodeData: NodeData) {
    this.__shaderFunctionName = nodeData.shaderFunctionName;
    this.__shaderFunctionDataId = nodeData.shaderFunctionDataId;
    this.__shaderStage = nodeData.shaderStage;

    this.__id = Node.__nodes.length;
    Node.__nodes[this.__id] = this;
  }

  static get allNodes(): Node[] {
    return this.__nodes;
  }

  static get vertexNodes(): Node[] {
    const vertexNodes: Node[] = [];
    for (const node of this.__nodes) {
      if (node.shaderStage === ShaderStage.Vertex) {
        vertexNodes.push(node);
      }
    }
    return vertexNodes;
  }

  static get fragmentNodes(): Node[] {
    const fragmentNodes: Node[] = [];
    for (const node of this.__nodes) {
      if (node.shaderStage === ShaderStage.Fragment) {
        fragmentNodes.push(node);
      }
    }
    return fragmentNodes;
  }

  static resetNodes() {
    this.__nodes.length = 0;
  }

  static getNodeById(id: number) {
    return this.__nodes[id];
  }

  static connectNodes(
    inputNode: Node,
    outputSocketNameOfInputNode: string,
    outputNode: Node,
    inputSocketNameOfOutputNode: string
  ) {
    const outputSocket = inputNode._getOutputSocket(
      outputSocketNameOfInputNode
    );
    const inputSocket = outputNode._getInputSocket(inputSocketNameOfOutputNode);

    if (inputSocket == null || outputSocket == null) {
      console.error('Node.connectNodes: socket is not found');
      return;
    }

    AbstractSocket.connectSockets(inputSocket, outputSocket);
  }

  get className(): NodeClassNames {
    return 'Node';
  }

  get functionName() {
    return this.__shaderFunctionName;
  }

  get shaderCode() {
    const shaderCode =
      ShaderFunctionDataRepository.getShaderFunctionDataById(
        this.__shaderFunctionDataId
      )?.shaderFunctionCode ??
      `// no shader code in the node with id=${this.__shaderFunctionDataId}`;

    return shaderCode;
  }

  get shaderStage() {
    return this.__shaderStage;
  }

  get extensions() {
    const extensions =
      ShaderFunctionDataRepository.getShaderFunctionDataById(
        this.__shaderFunctionDataId
      )?.extensions ?? [];

    return extensions;
  }

  get id() {
    return this.__id;
  }

  get _inputSockets() {
    return this.__inputSockets;
  }

  get _outputSockets() {
    return this.__outputSockets;
  }

  // The argumentId indicates that this socket corresponds to the nth argument of the node's function.
  addInputSocket(
    socketName: string,
    SocketType: SocketTypeEnum,
    argumentId: number,
    defaultValue: number[]
  ) {
    const existSocketName = this.__inputSockets.some(
      socket => socket.name === socketName
    );

    if (existSocketName) {
      console.warn('Node.addInputSocket: duplicate socketName');
    }

    const inputSocket = new InputSocket(
      SocketType,
      this,
      socketName,
      argumentId,
      defaultValue
    );
    this.__inputSockets.push(inputSocket);
  }

  addOutputSocket(
    socketName: string,
    SocketType: SocketTypeEnum,
    argumentId: number
  ) {
    const existSocketName = this.__outputSockets.some(
      socket => socket.name === socketName
    );

    if (existSocketName) {
      console.warn('Node.addOutputSocket: duplicate socketName');
    }

    const outputSocket = new OutputSocket(
      SocketType,
      this,
      socketName,
      argumentId
    );
    this.__outputSockets.push(outputSocket);
  }

  getInputNode(socketName: string) {
    const targetSocket = this._getInputSocket(socketName);
    if (targetSocket == null) {
      return undefined;
    }

    const connectedNode = targetSocket.connectedNode;
    return connectedNode;
  }

  getOutputNodes(socketName: string) {
    const targetSocket = this._getOutputSocket(socketName);
    if (targetSocket == null) {
      return [];
    }

    const connectedNodes = targetSocket.connectedNodes;
    return connectedNodes;
  }

  _getInputSocket(socketName: string) {
    const resultSocket = this.__inputSockets.find(
      inputSockets => inputSockets.name === socketName
    );

    if (resultSocket == null) {
      console.error(
        `Node.getInputSocket: socket name ${socketName} is not exist`
      );
      return undefined;
    }

    return resultSocket;
  }

  _getOutputSocket(socketName: string) {
    const resultSocket = this.__outputSockets.find(
      outputSockets => outputSockets.name === socketName
    );

    if (resultSocket == null) {
      console.error(
        `Node.getOutputSocket: socket name ${socketName} is not exist`
      );
      return undefined;
    }

    return resultSocket;
  }
}
