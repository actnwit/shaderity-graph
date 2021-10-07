import {INode} from '../node/INode';
import {SocketTypeEnum} from '../types/CommonEnum';
import {ISocket, SocketClassName} from './ISocket';

/**
 * The roll of the socket is to manage the input and output of each node.
 */
export default abstract class AbstractSocket implements ISocket {
  private __name: string;
  private __socketType: SocketTypeEnum;
  private __node: INode;

  constructor(socketType: SocketTypeEnum, node: INode, socketName: string) {
    this.__name = socketName;
    this.__socketType = socketType;
    this.__node = node;
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

  isInputSocket() {
    if (
      this.className === 'ConnectableInputSocket' ||
      this.className === 'AttributeInputSocket' ||
      this.className === 'VaryingInputSocket' ||
      this.className === 'UniformInputSocket'
    ) {
      return true;
    }

    return false;
  }

  abstract get className(): SocketClassName;
}
