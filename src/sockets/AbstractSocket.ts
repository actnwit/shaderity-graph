import {
  SocketDirectionEnum,
  SocketType,
  SocketTypeEnum,
} from '../types/CommonEnum';
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

  // In the case of an input socket, the length of the return value must be 1 or 0.
  get connectedNodeIDs() {
    const nodeIDs: NodeId[] = [];
    for (const socket of this.__connectedSockets) {
      nodeIDs.push(socket.__nodeId);
    }
    return nodeIDs;
  }

  get glslTypeStr() {
    switch (this.__socketType) {
      case SocketType.Int:
        return 'int';
      case SocketType.Float:
        return 'float';
      case SocketType.Vec2:
        return 'vec2';
      case SocketType.Vec3:
        return 'vec3';
      case SocketType.Vec4:
        return 'vec4';
      case SocketType.IVec2:
        return 'ivec2';
      case SocketType.IVec3:
        return 'ivec3';
      case SocketType.IVec4:
        return 'ivec4';
      case SocketType.Mat22:
        return 'mat2';
      case SocketType.Mat33:
        return 'mat3';
      case SocketType.Mat44:
        return 'mat4';
      case SocketType.Texture2D:
        return 'sampler2D';
      case SocketType.TextureCube:
        return 'samplerCube';
      default:
        return 'unknown';
    }
  }

  protected abstract __connectSocket(socket: AbstractSocket): void;
}
