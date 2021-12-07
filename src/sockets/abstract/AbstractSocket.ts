import {INode} from '../../node/INode';
import {SamplerTypeEnum, SocketTypeEnum} from '../../types/CommonEnum';
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
 *  - AbstractStandardSocket
 *     - StandardInputSocket
 *     - StandardOutputSocket
 *  - AttributeInputSocket
 *  - UniformInputSocket
 *  - AbstractVaryingSocket
 *    - VaryingInputSocket
 *    - VaryingOutputSocket
 *
 * StandardInputSocket can be connected to StandardOutputSocket and vice versa.
 * VaryingInputSocket can be connected to VaryingOutputSocket and vice versa.
 * Attribute/UniformInputSocket is a socket that cannot be connected to other sockets.
 * Attribute/UniformInputSocket are usually not visible in the GUI.
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
  get socketName() {
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
      this.className === 'StandardInputSocket' ||
      this.className === 'AttributeInputSocket' ||
      this.className === 'VaryingInputSocket' ||
      this.className === 'UniformInputSocket' ||
      this.className === 'SamplerInputSocket'
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
    | ShaderUniformVarTypeES3
    | SamplerTypeEnum;
}
