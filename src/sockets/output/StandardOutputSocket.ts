import {IStandardOutputSocket} from '../interface/output/IStandardOutputSocket';
import {IStandardInputSocket} from '../interface/input/IStandardInputSocket';
import {INode} from '../../node/INode';
import AbstractStandardSocket from '../abstract/AbstractStandardSocket';
import {
  ShaderStandardOutputData,
  ShaderPrecisionType,
} from '../../types/CommonType';

/**
 * The StandardOutputSocket is an output socket that can connect to StandardInputSockets.
 * This socket can connect to multiple StandardInputSockets.
 */
export default class StandardOutputSocket
  extends AbstractStandardSocket
  implements IStandardOutputSocket
{
  _connectedSockets: IStandardInputSocket[] = [];

  private __precision?: ShaderPrecisionType;

  constructor(
    node: INode,
    socketName: string,
    shaderData: ShaderStandardOutputData
  ) {
    super(shaderData.type, node, socketName);
    this.__precision = shaderData.precision;
  }

  /**
   * Get the class name of this socket
   */
  get className(): 'StandardOutputSocket' {
    return 'StandardOutputSocket';
  }

  /**
   * Get the precision of varying variable
   */
  get precision() {
    return this.__precision;
  }

  /**
   * Get the nodes that have a socket connected to this socket.
   * @returns array of connected Nodes
   */
  get connectedNodes() {
    const nodes: INode[] = new Array(this._connectedSockets.length);
    // the order of nodes is same to this._connectedSockets
    for (let i = 0; i < this._connectedSockets.length; i++) {
      nodes[i] = this._connectedSockets[i].node;
    }
    return nodes;
  }

  /**
   * Get the sockets that are connected to this socket.
   * @returns array of connected sockets
   */
  get connectedSockets() {
    return this._connectedSockets;
  }

  /**
   * Connect this socket and a standard input socket
   * @param socket The socket to connect to
   */
  _connectSocketWith(socket: IStandardInputSocket) {
    this._connectedSockets.push(socket);
  }
}
