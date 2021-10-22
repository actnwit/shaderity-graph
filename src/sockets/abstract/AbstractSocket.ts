import {INode} from '../../node/INode';
import {SocketTypeEnum} from '../../types/CommonEnum';
import {
  ShaderAttributeVarType,
  ShaderUniformVarTypeES3,
  ShaderVaryingVarType,
} from '../../types/CommonType';
import {ISocket, SocketClassName} from '../interface/ISocket';

/**
 * The roll of the socket is to manage the input and output of each node.
 * The user does not need to use the socket directly.
 * The state of the socket object can be changed via the methods of the node class.
 *
 * Currently, there are 5 concrete socket classes.
 * The parent-child relationship for each class is as follows.
 *
 * AbstractSocket
 *  - AbstractConnectableSocket
 *     - ConnectableInputSocket
 *     - ConnectableOutputSocket
 *  - AttributeInputSocket
 *  - VaryingInputSocket
 *  - UniformInputSocket
 *
 * ConnectableInputSocket can be connected to ConnectableOutputSocket and vice versa.
 * Attribute/Varying/UniformInputSocket is a socket that cannot be connected to other sockets.
 * These non-connectable nodes are usually not visible in the GUI.
 */
export default abstract class AbstractSocket implements ISocket {
  private __name: string;
  private __node: INode;

  constructor(node: INode, socketName: string) {
    this.__name = socketName;
    this.__node = node;
  }

  /**
   * Get the socket name
   */
  get name() {
    return this.__name;
  }

  /**
   * Get the node to which this socket is attached
   */
  get node() {
    return this.__node;
  }

  /**
   * Get this socket is input socket or not
   */
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

  /**
   * Get the class name of this socket
   */
  abstract get className(): SocketClassName;

  /**
   * Get the glsl type of data to be passed between sockets
   */
  abstract get socketType():
    | SocketTypeEnum
    | ShaderAttributeVarType
    | ShaderVaryingVarType
    | ShaderUniformVarTypeES3;
}
