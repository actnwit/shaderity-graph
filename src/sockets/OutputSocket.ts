import {NodeId} from '../types/CommonType';
import AbstractSocket, {
  SocketDirection,
  SocketTypeEnum,
} from './AbstractSocket';

export default class OutputSocket extends AbstractSocket {
  constructor(SocketType: SocketTypeEnum, nodeID: NodeId) {
    super(SocketType, SocketDirection.Output, nodeID);
  }

  protected __connectSocket(socket: AbstractSocket) {
    this.__connectedSockets.push(socket);
  }
}
