import {SocketTypeEnum} from '../../types/CommonEnum';
import {SocketClassName} from '../ISocket';
import {IConnectableInputSocket} from './IConnectableInputSocket';
import {IConnectableOutputSocket} from '../output/IConnectableOutputSocket';
import {INode} from '../../node/INode';
import AbstractConnectableSocket from '../AbstractConnectableSocket';

/**
 * The ConnectableInputSocket is an input socket that can connect to a ConnectableOutputSocket.
 * This socket can connect to at most one ConnectableOutputSocket.
 */
export default class ConnectableInputSocket
  extends AbstractConnectableSocket
  implements IConnectableInputSocket
{
  _connectedSocket: IConnectableOutputSocket | undefined = undefined;

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
  get className(): SocketClassName {
    return 'ConnectableInputSocket';
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

  _connectSocketWith(socket: IConnectableOutputSocket) {
    this._connectedSocket = socket;
  }
}
