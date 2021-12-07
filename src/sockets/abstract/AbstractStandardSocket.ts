import {INode} from '../../node/INode';
import {SocketTypeEnum} from '../../types/CommonEnum';
import AbstractSocket from './AbstractSocket';

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
   * Get the glsl type of data to be passed between sockets
   */
  get socketType() {
    return this.__socketType;
  }

  /**
   * Get the class name of this socket
   */
  abstract get className(): 'StandardInputSocket' | 'StandardOutputSocket';
}
