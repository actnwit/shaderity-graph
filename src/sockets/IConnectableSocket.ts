import {ISocket} from './ISocket';

export interface IConnectableSocket extends ISocket {
  _connectSocketWith(socket: ISocket): void;
}
