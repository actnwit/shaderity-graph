import {INode} from '../../../node/INode';
import {IStandardSocket} from '../IStandardSocket';
import {IStandardInputSocket} from '../input/IStandardInputSocket';

export interface IStandardOutputSocket extends IStandardSocket {
  _connectedSockets: IStandardInputSocket[];

  _connectSocketWith(socket: IStandardInputSocket): void;

  get connectedNodes(): INode[];
  get connectedSockets(): IStandardInputSocket[];
}
