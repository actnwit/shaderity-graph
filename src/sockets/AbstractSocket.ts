import {SocketTypeEnum} from '../types/CommonEnum';
import {NodeId} from '../types/CommonType';
import {IInputSocket} from './IInputSocket';
import {IOutputSocket} from './IOutputSocket';
import {ISocket, SocketClassName} from './ISocket';

export default abstract class AbstractSocket implements ISocket {
  private __name: string;
  private __socketType: SocketTypeEnum;
  private __nodeId: NodeId;
  private __argumentId: number;

  constructor(
    socketType: SocketTypeEnum,
    nodeId: NodeId,
    socketName: string,
    argumentId: number
  ) {
    this.__name = socketName;
    this.__socketType = socketType;
    this.__nodeId = nodeId;
    this.__argumentId = argumentId;
  }

  static connectSockets(
    inputSocket: IInputSocket,
    outputSocket: IOutputSocket
  ) {
    if (inputSocket.socketType === outputSocket.socketType) {
      inputSocket._connectSocketWith(outputSocket);
      outputSocket._connectSocketWith(inputSocket);
    } else {
      console.error('AbstractSocket.connectSockets: socketType is different');
    }
  }

  get name() {
    return this.__name;
  }

  get socketType() {
    return this.__socketType;
  }

  get nodeId() {
    return this.__nodeId;
  }

  get argumentId() {
    return this.__argumentId;
  }

  abstract get className(): SocketClassName;
  abstract _connectSocketWith(socket: ISocket): void;
}
