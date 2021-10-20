import {SocketTypeEnum} from '../../types/CommonEnum';
import {SocketClassName} from '../ISocket';
import {IConnectableInputSocket} from './IConnectableInputSocket';
import {IConnectableOutputSocket} from '../output/IConnectableOutputSocket';
import {INode} from '../../node/INode';
import AbstractConnectableSocket from '../AbstractConnectableSocket';

// An InputSocket can connect only one OutputSocket
export default class ConnectableInputSocket
  extends AbstractConnectableSocket
  implements IConnectableInputSocket
{
  _connectedSocket: IConnectableOutputSocket | undefined = undefined;

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

  get defaultValue() {
    return this.__defaultValue;
  }

  get className(): SocketClassName {
    return 'ConnectableInputSocket';
  }

  get connectedNode() {
    return this._connectedSocket?.node;
  }

  get connectedSocket() {
    return this._connectedSocket;
  }

  _connectSocketWith(socket: IConnectableOutputSocket) {
    this._connectedSocket = socket;
  }
}