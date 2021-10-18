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

  get className(): SocketClassName {
    return 'VaryingInputSocket';
  }

  get variableName() {
    return this.__variableName;
  }

  get socketType() {
    return this.__type;
  }

  get precision() {
    return this.__precision;
  }

  get interpolationType() {
    return this.__interpolationType;
  }
}
