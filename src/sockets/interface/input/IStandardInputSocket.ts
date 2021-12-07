import {INode} from '../../../node/INode';
import {IStandardOutputSocket} from '../output/IStandardOutputSocket';
import {ISocket} from '../ISocket';

export interface IStandardInputSocket extends ISocket {
  _connectedSocket?: IStandardOutputSocket;

  get defaultValue(): number[];
  get connectedNode(): INode | undefined;
  get connectedSocket(): IStandardOutputSocket | undefined;

  connectSocketWith(socket: IStandardOutputSocket): void;
}
