import {SocketType} from '../../types/CommonEnum';
import AbstractSocket from '../abstract/AbstractSocket';
import {INode} from '../../node/INode';
import {ISocket} from '../interface/ISocket';

/**
 */
export default class ShaderOutputSocket
  extends AbstractSocket
  implements ISocket
{
  constructor(node: INode, socketName: string) {
    super(node, socketName);
  }

  /**
   * Get the class name of this socket
   */
  get className(): 'ShaderOutputSocket' {
    return 'ShaderOutputSocket';
  }

  /**
   * Get the glsl type of data to be passed between sockets
   */
  get socketType() {
    return SocketType.Vec4;
  }
}
