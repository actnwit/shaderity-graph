import {SocketTypeEnum} from '../../types/CommonEnum';
import {INode} from '../../node/INode';
import {
  ShaderAttributeVarType,
  ShaderUniformVarTypeES3,
  ShaderVaryingVarType,
} from '../../types/CommonType';

export type SocketClassName =
  | 'StandardInputSocket'
  | 'AttributeInputSocket'
  | 'VaryingInputSocket'
  | 'UniformInputSocket'
  | 'StandardOutputSocket'
  | 'VaryingOutputSocket'
  | 'ShaderOutputSocket'
  | 'SamplerInputSocket'
  | 'SamplerOutputSocket';

export interface ISocket {
  get className(): SocketClassName;
  get socketName(): string;
  get socketType():
    | SocketTypeEnum
    | ShaderAttributeVarType
    | ShaderVaryingVarType
    | ShaderUniformVarTypeES3;
  get node(): INode;
  isInputSocket(): boolean;
}
