import AbstractSocket from './AbstractSocket';
import {NodeId} from '../types/CommonType';
import {SocketDirection, SocketTypeEnum} from '../types/CommonEnum';

// An InputSocket can connect only one OutputSocket
export default class InputSocket extends AbstractSocket {
  constructor(SocketType: SocketTypeEnum, nodeID: NodeId) {
    super(SocketType, SocketDirection.Input, nodeID);
  }

  protected __connectSocket(socket: AbstractSocket) {
    this.__connectedSockets[0] = socket;
  }
}
