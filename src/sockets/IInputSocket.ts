import {IOutputSocket} from './IOutputSocket';
import {ISocket} from './ISocket';

export interface IInputSocket extends ISocket {
  _connectedSocket?: IOutputSocket;

  _connectSocketWith(socket: IOutputSocket): void;

  get connectedNodeId(): number;
  get connectedSocket(): IOutputSocket | undefined;
}
