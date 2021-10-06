import AbstractSocket from '../AbstractSocket';
import {SocketTypeEnum} from '../../types/CommonEnum';
import {SocketClassName} from '../ISocket';
import {INode} from '../../node/INode';
import {
  ShaderPrecisionType,
  ShaderUniformObject,
  ShaderUniformVarTypeES3,
} from '../../types/CommonType';
import {INonConnectableInputSocket} from './INonConnectableInputSocket';

export default class UniformInputSocket
  extends AbstractSocket
  implements INonConnectableInputSocket
{
  private __variableName: string;
  private __type: ShaderUniformVarTypeES3;
  private __precision: ShaderPrecisionType;

  constructor(
    SocketType: SocketTypeEnum,
    node: INode,
    socketName: string,
    argumentId: number,
    uniform: ShaderUniformObject
  ) {
    super(SocketType, node, socketName, argumentId);

    this.__variableName = uniform.variableName;
    this.__type = uniform.type;
    this.__precision = uniform.precision ?? 'highp';
  }

  get className(): SocketClassName {
    return 'UniformInputSocket';
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
}
