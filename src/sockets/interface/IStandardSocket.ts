import {ISocket} from './ISocket';

export interface IStandardSocket extends ISocket {
  _connectSocketWith(socket: ISocket): void;
}
