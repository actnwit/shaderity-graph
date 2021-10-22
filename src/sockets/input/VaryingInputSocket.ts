import AbstractSocket from '../AbstractSocket';
import {SocketClassName} from '../ISocket';
import {INode} from '../../node/INode';
import {
  ShaderPrecisionType,
  ShaderVaryingInterpolationType,
  ShaderVaryingObject,
  ShaderVaryingVarType,
} from '../../types/CommonType';
import {INonConnectableInputSocket} from './INonConnectableInputSocket';

/**
 * The VaryingInputSocket is an input socket that receives an varying variable.
 * If the function corresponding to a node uses an varying variable,
 * the function must use this socket to receive the variable as an argument.
 * This socket can be used only with fragment shader nodes.
 */
export default class VaryingInputSocket
  extends AbstractSocket
  implements INonConnectableInputSocket
{
  private __variableName: string;
  private __type: ShaderVaryingVarType;
  private __precision: ShaderPrecisionType;
  private __interpolationType: ShaderVaryingInterpolationType | undefined;

  constructor(node: INode, socketName: string, varying: ShaderVaryingObject) {
    super(node, socketName);

    this.__variableName = varying.variableName;
    this.__type = varying.type;
    this.__precision = varying.precision ?? 'highp';
    this.__interpolationType = varying.interpolationType;
  }

  /**
   * Get the class name of this socket
   */
  get className(): SocketClassName {
    return 'VaryingInputSocket';
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
   * Get the precision of varying variable
   */
  get precision() {
    return this.__precision;
  }

  /**
   * Get the interpolationType of varying variable(for GLSL ES3.0)
   */
  get interpolationType() {
    return this.__interpolationType;
  }
}
