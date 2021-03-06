import {INode} from '../../../node/INode';
import {
  ShaderPrecisionType,
  ShaderVaryingInterpolationType,
  ShaderVaryingVarType,
} from '../../../types/CommonType';
import {IVaryingInputSocket} from '../input/IVaryingInputSocket';
import {ISocket} from '../ISocket';
export interface IVaryingOutputSocket extends ISocket {
  get className(): 'VaryingOutputSocket';
  get variableName(): string;
  get socketType(): ShaderVaryingVarType;
  get precision(): ShaderPrecisionType | undefined;
  get interpolationType(): ShaderVaryingInterpolationType | undefined;
  get connectedNodes(): INode[];
  get connectedSockets(): IVaryingInputSocket[];

  _connectSocketWith(socket: IVaryingInputSocket): void;
}
