import {INode} from '../../node/INode';
import {IConnectableSocket} from '../IConnectableSocket';
import {IConnectableInputSocket} from '../input/IConnectableInputSocket';

export interface IConnectableOutputSocket extends IConnectableSocket {
  _connectedSockets: IConnectableInputSocket[];

  _connectSocketWith(socket: IConnectableInputSocket): void;

  get connectedNodes(): INode[];
  get connectedSockets(): IConnectableInputSocket[];
}
