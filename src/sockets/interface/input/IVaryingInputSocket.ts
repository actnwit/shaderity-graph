import {INode} from '../../../node/INode';
import {
  ShaderPrecisionType,
  ShaderVaryingInterpolationType,
  ShaderVaryingVarType,
} from '../../../types/CommonType';
import {ISocket} from '../ISocket';
import {IVaryingOutputSocket} from '../output/IVaryingOutputSocket';

export interface IVaryingInputSocket extends ISocket {
  get className(): 'VaryingInputSocket';
  get variableName(): string;
  get socketType(): ShaderVaryingVarType;
  get precision(): ShaderPrecisionType | undefined;
  get interpolationType(): ShaderVaryingInterpolationType | undefined;
  get connectedNode(): INode | undefined;
  get connectedSocket(): IVaryingOutputSocket | undefined;

  _setVariableName(newVariableName: string): void;
  connectSocketWith(socket: IVaryingOutputSocket): void;
}
