import AbstractSocket from './AbstractSocket';
import {NodeId} from '../types/CommonType';
import {SocketDirection, SocketTypeEnum} from '../types/CommonEnum';

export default class OutputSocket extends AbstractSocket {
  constructor(SocketType: SocketTypeEnum, nodeID: NodeId) {
    super(SocketType, SocketDirection.Output, nodeID);
  }

  protected __connectSocket(socket: AbstractSocket) {
    this.__connectedSockets.push(socket);
  }
}
