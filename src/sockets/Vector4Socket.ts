import {NodeId} from '../types/CommonType';
import AbstractSocket, {
  SocketDirectionEnum,
  SocketType,
} from './AbstractSocket';

export default class Vector4Socket extends AbstractSocket {
  constructor(socketDirection: SocketDirectionEnum, nodeID: NodeId) {
    super(SocketType.Vector4, socketDirection, nodeID);
  }
}
