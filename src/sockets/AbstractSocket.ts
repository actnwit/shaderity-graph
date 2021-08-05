import {NodeId} from '../types/CommonType';

export const SocketType = {
  Int: 'int',
  Float: 'float',
  Vector2: 'vector2',
  Vector3: 'vector3',
  Vector4: 'vector4',
  Mat22: 'mat22',
  Mat33: 'mat33',
  Mat44: 'mat44',
} as const;

export type SocketTypeEnum = typeof SocketType[keyof typeof SocketType];

export const SocketDirection = {
  Input: 'input',
  Output: 'output',
} as const;

export type SocketDirectionEnum =
  typeof SocketDirection[keyof typeof SocketDirection];

export default abstract class AbstractSocket {

  private __connectedSockets: AbstractSocket[] = [];
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
      socketA.__connectedSockets.push(socketB);
      socketB.__connectedSockets.push(socketA);
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
}
