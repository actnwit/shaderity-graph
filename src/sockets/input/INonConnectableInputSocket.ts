import {
  ShaderAttributeVarType,
  ShaderPrecisionType,
  ShaderUniformVarTypeES3,
  ShaderVaryingVarType,
} from '../../types/CommonType';
import {ISocket} from '../ISocket';

export interface INonConnectableInputSocket extends ISocket {
  get variableName(): string;
  get type():
    | ShaderAttributeVarType
    | ShaderVaryingVarType
    | ShaderUniformVarTypeES3;
  get precision(): ShaderPrecisionType;
}
