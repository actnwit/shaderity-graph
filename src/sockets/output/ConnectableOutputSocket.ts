import {SocketTypeEnum} from '../../types/CommonEnum';
import {SocketClassName} from '../ISocket';
import {IConnectableOutputSocket} from './IConnectableOutputSocket';
import {IConnectableInputSocket} from '../input/IConnectableInputSocket';
import {INode} from '../../node/INode';
import AbstractConnectableSocket from '../AbstractConnectableSocket';

/**
 * The ConnectableOutputSocket is an output socket that can connect to ConnectableInputSockets.
 * This socket can connect to multiple ConnectableInputSockets.
 */
export default class ConnectableOutputSocket
  extends AbstractConnectableSocket
  implements IConnectableOutputSocket
{
  _connectedSockets: IConnectableInputSocket[] = [];

  constructor(socketType: SocketTypeEnum, node: INode, socketName: string) {
    super(socketType, node, socketName);
  }

  /**
   * Get the class name of this socket
   */
  get className(): SocketClassName {
    return 'ConnectableOutputSocket';
  }

  /**
   * Get the nodes that have a socket connected to this socket.
   * @returns array of connected Nodes
   */
  get connectedNodes() {
    const nodes: INode[] = new Array(this._connectedSockets.length);
    // the order of nodes is same to this._connectedSockets
    for (let i = 0; i < this._connectedSockets.length; i++) {
      nodes[i] = this._connectedSockets[i].node;
    }
    return nodes;
  }

  /**
   * Get the sockets that are connected to this socket.
   * @returns array of connected sockets
   */
  get connectedSockets() {
    return this._connectedSockets;
  }

  /**
   * Connect this socket and a connectable input socket
   * @param socket The socket to connect to
   */
  _connectSocketWith(socket: IConnectableInputSocket) {
    this._connectedSockets.push(socket);
  }
}
