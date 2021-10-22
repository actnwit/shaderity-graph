import AbstractSocket from '../abstract/AbstractSocket';
import {SocketClassName} from '../ISocket';
import {INode} from '../../node/INode';
import {
  ShaderPrecisionType,
  ShaderUniformObject,
  ShaderUniformVarTypeES3,
} from '../../types/CommonType';
import {INonConnectableInputSocket} from './INonConnectableInputSocket';

/**
 * The UniformInputSocket is an input socket that receives an uniform variable.
 * If the function corresponding to a node uses an uniform variable,
 * the function must use this socket to receive the variable as an argument.
 */
export default class UniformInputSocket
  extends AbstractSocket
  implements INonConnectableInputSocket
{
  private __variableName: string;
  private __type: ShaderUniformVarTypeES3;
  private __precision: ShaderPrecisionType;

  constructor(node: INode, socketName: string, uniform: ShaderUniformObject) {
    super(node, socketName);

    this.__variableName = uniform.variableName;
    this.__type = uniform.type;
    this.__precision = uniform.precision ?? 'highp';
  }

  /**
   * Get the class name of this socket
   */
  get className(): SocketClassName {
    return 'UniformInputSocket';
  }

  /**
   * Get the uniform variable name
   */
  get variableName() {
    return this.__variableName;
  }

  /**
   * Get the glsl type of uniform variable
   */
  get socketType() {
    return this.__type;
  }

  /**
   * Get the precision of uniform variable
   */
  get precision() {
    return this.__precision;
  }
}
