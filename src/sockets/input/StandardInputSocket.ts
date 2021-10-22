import {SocketTypeEnum} from '../../types/CommonEnum';
import {IStandardInputSocket} from '../interface/input/IStandardInputSocket';
import {IStandardOutputSocket} from '../interface/output/IStandardOutputSocket';
import {INode} from '../../node/INode';
import AbstractStandardSocket from '../abstract/AbstractStandardSocket';

/**
 * The StandardInputSocket is an input socket that can connect to a StandardOutputSocket.
 * This socket can connect to at most one StandardOutputSocket.
 */
export default class StandardInputSocket
  extends AbstractStandardSocket
  implements IStandardInputSocket
{
  _connectedSocket: IStandardOutputSocket | undefined = undefined;

  /**
   * @private
   * If this socket does not connect with output socket,
   * the __defaultValue is used as input value.
   */
  private __defaultValue: number[];

  constructor(
    socketType: SocketTypeEnum,
    node: INode,
    socketName: string,
    defaultValue: number[]
  ) {
    super(socketType, node, socketName);
    this.__defaultValue = defaultValue;
  }

  /**
   * get the defaultValue of this socket
   */
  get defaultValue() {
    return this.__defaultValue;
  }

  /**
   * Get the class name of this socket
   */
  get className(): 'StandardInputSocket' {
    return 'StandardInputSocket';
  }

  /**
   * Get the node that has the socket connected to this socket
   * @returns connected node or undefined
   */
  get connectedNode() {
    return this._connectedSocket?.node;
  }

  /**
   * Get the socket that is connected to this socket
   * @returns connected socket or undefined
   */
  get connectedSocket() {
    return this._connectedSocket;
  }

  _connectSocketWith(socket: IStandardOutputSocket) {
    this._connectedSocket = socket;
  }
}
