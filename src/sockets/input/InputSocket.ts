import AbstractSocket from '../AbstractSocket';
import {SocketTypeEnum} from '../../types/CommonEnum';
import {SocketClassName} from '../ISocket';
import {IInputSocket} from './IInputSocket';
import {IOutputSocket} from '../output/IOutputSocket';
import {INode} from '../../node/INode';

// An InputSocket can connect only one OutputSocket
export default class InputSocket
  extends AbstractSocket
  implements IInputSocket
{
  _connectedSocket: IOutputSocket | undefined = undefined;

  private __defaultValue: number[];

  constructor(
    SocketType: SocketTypeEnum,
    node: INode,
    socketName: string,
    argumentId: number,
    defaultValue: number[]
  ) {
    super(SocketType, node, socketName, argumentId);
    this.__defaultValue = defaultValue;
  }

  get defaultValue() {
    return this.__defaultValue;
  }

  get className(): SocketClassName {
    return 'InputSocket';
  }

  get connectedNode() {
    return this._connectedSocket?.node;
  }

  get connectedSocket() {
    return this._connectedSocket;
  }

  _connectSocketWith(socket: IOutputSocket) {
    this._connectedSocket = socket;
  }
}
