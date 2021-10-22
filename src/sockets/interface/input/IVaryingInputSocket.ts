import {INode} from '../../../node/INode';
import {
  ShaderPrecisionType,
  ShaderVaryingInterpolationType,
  ShaderVaryingVarType,
} from '../../../types/CommonType';
import {ISocket} from '../ISocket';
import {IVaryingOutputSocket} from '../output/IVaryingOutputSocket';

export interface IVaryingInputSocket extends ISocket {
  _connectedSocket: IVaryingOutputSocket | undefined;

  get className(): 'VaryingInputSocket';
  get variableName(): string;
  get socketType(): ShaderVaryingVarType;
  get precision(): ShaderPrecisionType;
  get interpolationType(): ShaderVaryingInterpolationType | undefined;
  get connectedNode(): INode | undefined;
  get connectedSocket(): IVaryingOutputSocket | undefined;

  _connectSocketWith(socket: ISocket): void;
}
