import {INode} from '../../node/INode';
import {
  ShaderVaryingInterpolationType,
  ShaderVaryingData,
  ShaderVaryingVarType,
  ShaderPrecisionType,
} from '../../types/CommonType';
import AbstractSocket from './AbstractSocket';

/**
 * The roll of varying sockets are passing data from the vertex shader to the fragment shader.
 * The user can connect sockets by Node.connectNodes method.
 */
export default abstract class AbstractVaryingSocket extends AbstractSocket {
  protected __variableName: string;
  private __type: ShaderVaryingVarType;

  constructor(
    node: INode,
    socketName: string,
    varying: ShaderVaryingData,
    variableName: string
  ) {
    super(node, socketName);

    this.__variableName = variableName;
    this.__type = varying.type;
  }

  /**
   * Get the varying variable name
   */
  get variableName() {
    return this.__variableName;
  }

  /**
   * Get the glsl type of varying variable
   */
  get socketType() {
    return this.__type;
  }

  /**
   * Get the class name of this socket
   */
  abstract get className(): 'VaryingInputSocket' | 'VaryingOutputSocket';

  /**
   * Get the interpolationType of varying variable(for GLSL ES3.0)
   */
  abstract get interpolationType(): ShaderVaryingInterpolationType | undefined;

  /**
   * Get the precision of varying variable
   */
  abstract get precision(): ShaderPrecisionType | undefined;
}
