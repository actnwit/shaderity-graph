import AbstractSocket from '../abstract/AbstractSocket';
import {SocketClassName} from '../ISocket';
import {INode} from '../../node/INode';
import {
  ShaderAttributeObject,
  ShaderAttributeVarType,
  ShaderPrecisionType,
} from '../../types/CommonType';
import {INonConnectableInputSocket} from './INonConnectableInputSocket';

/**
 * The AttributeInputSocket is an input socket that receives an attribute variable.
 * If the function corresponding to a node uses an attribute variable,
 * the function must use this socket to receive the variable as an argument.
 * This socket can be used only with vertex shader nodes.
 */
export default class AttributeInputSocket
  extends AbstractSocket
  implements INonConnectableInputSocket
{
  private __variableName: string;
  private __type: ShaderAttributeVarType;
  private __precision: ShaderPrecisionType;
  private __location: number | undefined;

  constructor(
    node: INode,
    socketName: string,
    attribute: ShaderAttributeObject
  ) {
    super(node, socketName);

    this.__variableName = attribute.variableName;
    this.__type = attribute.type;
    this.__precision = attribute.precision ?? 'highp';
    this.__location = attribute.location;
  }

  /**
   * Get the class name of this socket
   */
  get className(): SocketClassName {
    return 'AttributeInputSocket';
  }

  /**
   * Get the attribute variable name
   */
  get variableName() {
    return this.__variableName;
  }

  /**
   * Get the glsl type of attribute variable
   */
  get socketType() {
    return this.__type;
  }

  /**
   * Get the precision of attribute variable
   */
  get precision() {
    return this.__precision;
  }

  /**
   * Get the location of attribute variable(for GLSL ES3.0)
   */
  get location() {
    return this.__location;
  }
}
