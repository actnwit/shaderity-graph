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
  public socketName: string;

  private __connectedSockets: AbstractSocket[] = [];
  private __socketType: SocketTypeEnum;
  private __socketDirection: SocketDirectionEnum;
  private __nodeId: NodeId;

  constructor(
    socketName: string,
    socketType: SocketTypeEnum,
    socketDirection: SocketDirectionEnum,
    nodeId: NodeId
  ) {
    this.socketName = socketName;
    this.__socketType = socketType;
    this.__socketDirection = socketDirection;
    this.__nodeId = nodeId;
  }
}
