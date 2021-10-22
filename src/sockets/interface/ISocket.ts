import {SocketTypeEnum} from '../../types/CommonEnum';
import {INode} from '../../node/INode';
import {
  ShaderAttributeVarType,
  ShaderUniformVarTypeES3,
  ShaderVaryingVarType,
} from '../../types/CommonType';

export type SocketClassName =
  | 'ConnectableInputSocket'
  | 'AttributeInputSocket'
  | 'VaryingInputSocket'
  | 'UniformInputSocket'
  | 'ConnectableOutputSocket'
  | 'VaryingOutputSocket';

export interface ISocket {
  get className(): SocketClassName;
  get name(): string;
  get socketType():
    | SocketTypeEnum
    | ShaderAttributeVarType
    | ShaderVaryingVarType
    | ShaderUniformVarTypeES3;
  get node(): INode;
  isInputSocket(): boolean;
}
