import {SocketTypeEnum} from '../../types/CommonEnum';
import {SocketClassName} from '../ISocket';
import {IConnectableOutputSocket} from './IConnectableOutputSocket';
import {IConnectableInputSocket} from '../input/IConnectableInputSocket';
import {INode} from '../../node/INode';
import AbstractConnectableSocket from '../AbstractConnectableSocket';

export default class ConnectableOutputSocket
  extends AbstractConnectableSocket
  implements IConnectableOutputSocket
{
  _connectedSockets: IConnectableInputSocket[] = [];

  constructor(SocketType: SocketTypeEnum, node: INode, socketName: string) {
    super(SocketType, node, socketName);
  }

  get className(): SocketClassName {
    return 'ConnectableOutputSocket';
  }

  get connectedNodes() {
    const nodes: INode[] = new Array(this._connectedSockets.length);
    // the order of nodes is same to this._connectedSockets
    for (let i = 0; i < this._connectedSockets.length; i++) {
      nodes[i] = this._connectedSockets[i].node;
    }
    return nodes;
  }

  get connectedSockets() {
    return this._connectedSockets;
  }

  _connectSocketWith(socket: IConnectableInputSocket) {
    this._connectedSockets.push(socket);
  }
}
