import {INode} from '../../../node/INode';
import {IStandardOutputSocket} from '../output/IStandardOutputSocket';
import {ISocket} from '../ISocket';

export interface IStandardInputSocket extends ISocket {
  _connectedSocket?: IStandardOutputSocket;

  _connectSocketWith(socket: IStandardOutputSocket): void;

  get defaultValue(): number[];
  get connectedNode(): INode | undefined;
  get connectedSocket(): IStandardOutputSocket | undefined;
}
