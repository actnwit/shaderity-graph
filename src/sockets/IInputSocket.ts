import {INode} from '../node/INode';
import {IOutputSocket} from './IOutputSocket';
import {ISocket} from './ISocket';

export interface IInputSocket extends ISocket {
  _connectedSocket?: IOutputSocket;

  _connectSocketWith(socket: IOutputSocket): void;

  get connectedNode(): INode | undefined;
  get connectedSocket(): IOutputSocket | undefined;
}
