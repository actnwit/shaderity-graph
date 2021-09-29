import {INode} from '../node/INode';
import {IInputSocket} from './IInputSocket';
import {ISocket} from './ISocket';

export interface IOutputSocket extends ISocket {
  _connectedSockets: IInputSocket[];

  _connectSocketWith(socket: IInputSocket): void;

  get connectedNodes(): INode[];
  get connectedSockets(): IInputSocket[];
}
