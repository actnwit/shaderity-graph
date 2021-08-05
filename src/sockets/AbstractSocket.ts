import {SocketDirectionEnum, SocketTypeEnum} from '../types/CommonEnum';
import {NodeId} from '../types/CommonType';

export default abstract class AbstractSocket {
  protected __connectedSockets: AbstractSocket[] = [];

  private __socketType: SocketTypeEnum;
  private __socketDirection: SocketDirectionEnum;
  private __nodeId: NodeId;

  constructor(
    socketType: SocketTypeEnum,
    socketDirection: SocketDirectionEnum,
    nodeId: NodeId
  ) {
    this.__socketType = socketType;
    this.__socketDirection = socketDirection;
    this.__nodeId = nodeId;
  }

  static connectSockets(socketA: AbstractSocket, socketB: AbstractSocket) {
    if (
      socketA.__socketType === socketB.__socketType &&
      socketA.__socketDirection !== socketB.__socketDirection
    ) {
      socketA.__connectSocket(socketB);
      socketB.__connectSocket(socketA);
    } else {
      console.error(
        'AbstractSocket.connectSockets: Invalid socket connection.'
      );
    }
  }

  get connectedNodeIDs() {
    const nodeIDs: NodeId[] = [];
    for (const socket of this.__connectedSockets) {
      nodeIDs.push(socket.__nodeId);
    }
    return nodeIDs;
  }

  protected abstract __connectSocket(socket: AbstractSocket): void;
}
