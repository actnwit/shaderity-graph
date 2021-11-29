import {INode} from '../../node/INode';
import {SocketTypeEnum} from '../../types/CommonEnum';
import AbstractSocket from './AbstractSocket';
import {IStandardInputSocket} from '../interface/input/IStandardInputSocket';
import {IStandardOutputSocket} from '../interface/output/IStandardOutputSocket';

/**
 * The roll of standard sockets are connecting nodes.
 * The user can connect sockets by Node.connectNodes method.
 */
export default abstract class AbstractStandardSocket extends AbstractSocket {
  private __socketType: SocketTypeEnum;

  constructor(socketType: SocketTypeEnum, node: INode, socketName: string) {
    super(node, socketName);
    this.__socketType = socketType;
  }

  /**
   * Connecting input and output sockets
   * @param inputSocket input socket contained in the output node
   * @param outputSocket output socket contained in the input node
   */
  static connectSockets(
    inputSocket: IStandardInputSocket,
    outputSocket: IStandardOutputSocket
  ) {
    if (inputSocket.socketType === outputSocket.socketType) {
      inputSocket._connectSocketWith(outputSocket);
      outputSocket._connectSocketWith(inputSocket);
    } else {
      console.error('AbstractSocket.connectSockets: socketType is different');
    }
  }

  /**
   * Get the glsl type of data to be passed between sockets
   */
  get socketType() {
    return this.__socketType;
  }

  /**
   * Get the class name of this socket
   */
  abstract get className(): 'StandardInputSocket' | 'StandardOutputSocket';

  /**
   * Connect this socket and the argument socket
   * @param socket The socket to connect to
   */
  abstract _connectSocketWith(
    socket: IStandardInputSocket | IStandardOutputSocket
  ): void;
}
