import AbstractSocket from './AbstractSocket';
import {SocketTypeEnum} from '../types/CommonEnum';
import {SocketClassName} from './ISocket';
import {IOutputSocket} from './IOutputSocket';
import {IInputSocket} from './IInputSocket';
import {INode} from '../node/INode';

export default class OutputSocket
  extends AbstractSocket
  implements IOutputSocket
{
  _connectedSockets: IInputSocket[] = [];

  constructor(
    SocketType: SocketTypeEnum,
    node: INode,
    socketName: string,
    argumentId: number
  ) {
    super(SocketType, node, socketName, argumentId);
  }

  get className(): SocketClassName {
    return 'OutputSocket';
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

  _connectSocketWith(socket: IInputSocket) {
    this._connectedSockets.push(socket);
  }
}
