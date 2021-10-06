import {INode} from '../node/INode';
import {SocketTypeEnum} from '../types/CommonEnum';
import AbstractSocket from './AbstractSocket';
import {IConnectableInputSocket} from './input/IConnectableInputSocket';
import {ISocket, SocketClassName} from './ISocket';
import {IConnectableOutputSocket} from './output/IConnectableOutputSocket';

/**
 * The roll of connectable sockets are connecting nodes.
 * Users are expected to use this class through Node class.
 */
export default abstract class AbstractConnectableSocket extends AbstractSocket {
  constructor(
    socketType: SocketTypeEnum,
    node: INode,
    socketName: string,
    argumentId: number
  ) {
    super(socketType, node, socketName, argumentId);
  }

  /**
   * Connecting input/output sockets
   * @param inputSocket input socket contained in the output node
   * @param outputSocket output socket contained in the input node
   */
  static connectSockets(
    inputSocket: IConnectableInputSocket,
    outputSocket: IConnectableOutputSocket
  ) {
    if (inputSocket.socketType === outputSocket.socketType) {
      inputSocket._connectSocketWith(outputSocket);
      outputSocket._connectSocketWith(inputSocket);
    } else {
      console.error('AbstractSocket.connectSockets: socketType is different');
    }
  }

  abstract get className(): SocketClassName;
  abstract _connectSocketWith(socket: ISocket): void;
}
