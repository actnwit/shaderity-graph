import {IInputSocket} from './IInputSocket';
import {ISocket} from './ISocket';

export interface IOutputSocket extends ISocket {
  _connectedSockets: IInputSocket[];

  _connectSocketWith(socket: IInputSocket): void;

  get connectedNodeIds(): number[];
  get connectedSockets(): IInputSocket[];
}
