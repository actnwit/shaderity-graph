import AbstractSocket from './AbstractSocket';
import {SocketTypeEnum} from '../types/CommonEnum';
import {SocketClassName} from './ISocket';
import {IInputSocket} from './IInputSocket';
import {IOutputSocket} from './IOutputSocket';
import {INode} from '../node/INode';

// An InputSocket can connect only one OutputSocket
export default class InputSocket
  extends AbstractSocket
  implements IInputSocket
{
  _connectedSocket: IOutputSocket | undefined = undefined;

  constructor(
    SocketType: SocketTypeEnum,
    node: INode,
    socketName: string,
    argumentId: number
  ) {
    super(SocketType, node, socketName, argumentId);
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
