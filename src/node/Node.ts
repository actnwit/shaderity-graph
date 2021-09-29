import {ShaderStage, SocketTypeEnum} from '../types/CommonEnum';
import {NodeData, NodeId} from '../types/CommonType';
import InputSocket from '../sockets/InputSocket';
import OutputSocket from '../sockets/OutputSocket';
import {IOutputSocket} from '../sockets/IOutputSocket';
import {IInputSocket} from '../sockets/IInputSocket';

export type NodeClassNames =
  | 'Node'
  | 'AttributeInputNode'
  | 'VaryingInputNode'
  | 'UniformInputNode';

export default class Node {
  protected static __nodes: Node[] = [];

  protected __nodeData: NodeData;

  protected __id: NodeId;
  protected __inputSockets: IInputSocket[] = [];
  protected __outputSockets: IOutputSocket[] = [];

  constructor(nodeData: NodeData) {
    this.__nodeData = nodeData;

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

  static get pixelNodes(): Node[] {
    const pixelNodes: Node[] = [];
    for (const node of this.__nodes) {
      if (node.shaderStage === ShaderStage.Pixel) {
        pixelNodes.push(node);
      }
    }
    return pixelNodes;
  }

  static resetNodes() {
    this.__nodes.length = 0;
  }

  static getNodeById(id: NodeId) {
    return this.__nodes[id];
  }

  get className(): NodeClassNames {
    return 'Node';
  }

  get name() {
    return this.__nodeData.shaderFunctionName;
  }

  get shaderCode() {
    return this.__nodeData.shaderFunctionCode;
  }

  get shaderStage() {
    return this.__nodeData.shaderStage;
  }

  get extensions() {
    return this.__nodeData.extensions ?? [];
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
    argumentId: number
  ) {
    const existSocketName = this.__inputSockets.some(
      socket => socket.name === socketName
    );

    if (existSocketName) {
      console.warn('Node.addInputSocket: duplicate socketName');
    }

    const inputSocket = new InputSocket(
      SocketType,
      this.__id,
      socketName,
      argumentId
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
      this.__id,
      socketName,
      argumentId
    );
    this.__outputSockets.push(outputSocket);
  }

  getInputNode(socketName: string): Node | undefined {
    const targetSocket = this._getInputSocket(socketName);
    if (targetSocket == null) {
      return undefined;
    }

    const connectedNodeId = targetSocket.connectedNodeId;
    return Node.__nodes[connectedNodeId];
  }

  getOutputNodes(socketName: string): Node[] {
    const targetSocket = this._getOutputSocket(socketName);
    if (targetSocket == null) {
      return [];
    }

    const connectedNodeIds = targetSocket.connectedNodeIds;
    const connectedNodes: Node[] = [];
    for (const nodeId of connectedNodeIds) {
      connectedNodes.push(Node.__nodes[nodeId]);
    }
    return connectedNodes;
  }

  _getInputSocket(socketName: string): IInputSocket | undefined {
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

  _getOutputSocket(socketName: string): IOutputSocket | undefined {
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
