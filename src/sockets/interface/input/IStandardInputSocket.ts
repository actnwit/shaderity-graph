import {INode} from '../../../node/INode';
import {IStandardOutputSocket} from '../output/IStandardOutputSocket';
import {IStandardSocket} from '../IStandardSocket';

export interface IStandardInputSocket extends IStandardSocket {
  _connectedSocket?: IStandardOutputSocket;

  _connectSocketWith(socket: IStandardOutputSocket): void;

  get defaultValue(): number[];
  get connectedNode(): INode | undefined;
  get connectedSocket(): IStandardOutputSocket | undefined;
}
