import {INode} from '../node/INode';
import {SocketTypeEnum} from '../types/CommonEnum';
import {IInputSocket} from './input/IInputSocket';
import {IOutputSocket} from './output/IOutputSocket';
import {ISocket, SocketClassName} from './ISocket';

/**
 * The roll of sockets are connecting nodes.
 * Users are expected to use this class through Node class.
 */
export default abstract class AbstractSocket implements ISocket {
  private __name: string;
  private __socketType: SocketTypeEnum;
  private __node: INode;
  private __argumentId: number;

  constructor(
    socketType: SocketTypeEnum,
    node: INode,
    socketName: string,
    argumentId: number
  ) {
    this.__name = socketName;
    this.__socketType = socketType;
    this.__node = node;
    this.__argumentId = argumentId;
  }

  /**
   * Connecting input/output sockets
   * @param inputSocket input socket contained in the output node
   * @param outputSocket output socket contained in the input node
   */
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

  /**
   * Get the socket name
   */
  get name() {
    return this.__name;
  }

  /**
   * Get the glsl type of data to be passed between sockets
   */
  get socketType() {
    return this.__socketType;
  }

  /**
   * Get the node to which this socket is attached
   */
  get node() {
    return this.__node;
  }

  /**
   * Get the location of the argument of the node function corresponding to this socket
   */
  get argumentId() {
    return this.__argumentId;
  }

  abstract get className(): SocketClassName;
  abstract _connectSocketWith(socket: ISocket): void;
}
