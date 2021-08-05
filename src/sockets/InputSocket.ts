import {NodeId} from '../types/CommonType';
import AbstractSocket, {
  SocketDirection,
  SocketTypeEnum,
} from './AbstractSocket';

// An InputSocket can connect only one OutputSocket
export default class InputSocket extends AbstractSocket {
  constructor(SocketType: SocketTypeEnum, nodeID: NodeId) {
    super(SocketType, SocketDirection.Input, nodeID);
  }
}
