import AbstractSocket from './AbstractSocket';
import {NodeId} from '../types/CommonType';
import {SocketDirection, SocketTypeEnum} from '../types/CommonEnum';
import {SocketClassName} from './ISocket';
import {IInputSocket} from './IInputSocket';
import {IOutputSocket} from './IOutputSocket';

// An InputSocket can connect only one OutputSocket
export default class InputSocket
  extends AbstractSocket
  implements IInputSocket
{
  _connectedSocket: IOutputSocket | undefined = undefined;

  constructor(SocketType: SocketTypeEnum, nodeId: NodeId) {
    super(SocketType, SocketDirection.Input, nodeId);
  }

  get className(): SocketClassName {
    return 'InputSocket';
  }

  get connectedNodeId() {
    return this._connectedSocket?.nodeId ?? -1;
  }

  get connectedSocket() {
    return this._connectedSocket;
  }

  _connectSocketWith(socket: IOutputSocket) {
    this._connectedSocket = socket;
  }
}
