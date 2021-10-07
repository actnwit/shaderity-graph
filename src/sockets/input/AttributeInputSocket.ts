import AbstractSocket from '../AbstractSocket';
import {SocketTypeEnum} from '../../types/CommonEnum';
import {SocketClassName} from '../ISocket';
import {INode} from '../../node/INode';
import {
  ShaderAttributeObject,
  ShaderAttributeVarType,
  ShaderPrecisionType,
} from '../../types/CommonType';
import {INonConnectableInputSocket} from './INonConnectableInputSocket';

export default class AttributeInputSocket
  extends AbstractSocket
  implements INonConnectableInputSocket
{
  private __variableName: string;
  private __type: ShaderAttributeVarType;
  private __precision: ShaderPrecisionType;
  private __location: number | undefined;

  constructor(
    SocketType: SocketTypeEnum,
    node: INode,
    socketName: string,
    attribute: ShaderAttributeObject
  ) {
    super(SocketType, node, socketName);

    this.__variableName = attribute.variableName;
    this.__type = attribute.type;
    this.__precision = attribute.precision ?? 'highp';
    this.__location = attribute.location;
  }

  get className(): SocketClassName {
    return 'AttributeInputSocket';
  }

  get variableName() {
    return this.__variableName;
  }

  get type() {
    return this.__type;
  }

  get precision() {
    return this.__precision;
  }

  get location() {
    return this.__location;
  }
}
