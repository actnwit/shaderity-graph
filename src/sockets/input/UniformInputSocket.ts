import AbstractSocket from '../abstract/AbstractSocket';
import {INode} from '../../node/INode';
import {
  ShaderPrecisionType,
  ShaderUniformData,
  ShaderUniformVarTypeES3,
} from '../../types/CommonType';
import {IUniformInputSocket} from '../interface/input/IUniformInputSocket';

/**
 * The UniformInputSocket is an input socket that receives an uniform variable.
 * If the function corresponding to a node uses an uniform variable,
 * the function must use this socket to receive the variable as an argument.
 */
export default class UniformInputSocket
  extends AbstractSocket
  implements IUniformInputSocket
{
  private __variableName: string;
  private __type: ShaderUniformVarTypeES3;
  private __precision?: ShaderPrecisionType;

  constructor(node: INode, socketName: string, uniform: ShaderUniformData) {
    super(node, socketName);

    this.__variableName = uniform.variableName ?? `u_${node.id}_${socketName}`;
    this.__type = uniform.type;
    this.__precision = uniform.precision;
  }

  /**
   * Get the class name of this socket
   */
  get className(): 'UniformInputSocket' {
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
