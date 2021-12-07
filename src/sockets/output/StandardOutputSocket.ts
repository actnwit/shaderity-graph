import {IStandardOutputSocket} from '../interface/output/IStandardOutputSocket';
import {IStandardInputSocket} from '../interface/input/IStandardInputSocket';
import {INode} from '../../node/INode';
import {
  ShaderStandardOutputData,
  ShaderPrecisionType,
} from '../../types/CommonType';
import {SocketTypeEnum} from '../../types/CommonEnum';
import AbstractSocket from '../abstract/AbstractSocket';

/**
 * The StandardOutputSocket is an output socket that can connect to StandardInputSockets.
 * This socket can connect to multiple StandardInputSockets.
 */
export default class StandardOutputSocket
  extends AbstractSocket
  implements IStandardOutputSocket
{
  _connectedSockets: IStandardInputSocket[] = [];

  private __socketType: SocketTypeEnum;
  private __precision?: ShaderPrecisionType;

  constructor(
    node: INode,
    socketName: string,
    shaderData: ShaderStandardOutputData
  ) {
    super(node, socketName);
    this.__socketType = shaderData.type;
    this.__precision = shaderData.precision;
  }

  /**
   * Get the class name of this socket
   */
  get className(): 'StandardOutputSocket' {
    return 'StandardOutputSocket';
  }

  /**
   * Get the glsl type of data to be passed between sockets
   */
  get socketType() {
    return this.__socketType;
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
   * @private
   * Connect socket from this socket to a standard input socket
   * Do not call this method except from the connectSocketWith method of the StandardInputSocket class
   *
   * @param inputSocket The input socket to connect to
   */
  _connectSocketWith(inputSocket: IStandardInputSocket) {
    this._connectedSockets.push(inputSocket);
  }
}
