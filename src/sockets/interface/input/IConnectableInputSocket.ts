import {INode} from '../../../node/INode';
import {IConnectableOutputSocket} from '../output/IConnectableOutputSocket';
import {IConnectableSocket} from '../IConnectableSocket';

export interface IConnectableInputSocket extends IConnectableSocket {
  _connectedSocket?: IConnectableOutputSocket;

  _connectSocketWith(socket: IConnectableOutputSocket): void;

  get defaultValue(): number[];
  get connectedNode(): INode | undefined;
  get connectedSocket(): IConnectableOutputSocket | undefined;
}
