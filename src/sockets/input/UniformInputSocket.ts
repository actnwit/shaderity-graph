import AbstractSocket from '../AbstractSocket';
import {SocketType, SocketTypeEnum} from '../../types/CommonEnum';
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
    socketType: SocketTypeEnum,
    node: INode,
    socketName: string,
    uniform: ShaderUniformObject
  ) {
    super(socketType, node, socketName);

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

  get socketType() {
    return this.__type;
  }

  get precision() {
    return this.__precision;
  }
}
