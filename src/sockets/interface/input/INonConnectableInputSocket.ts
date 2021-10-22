import {
  ShaderAttributeVarType,
  ShaderPrecisionType,
  ShaderUniformVarTypeES3,
  ShaderVaryingVarType,
} from '../../../types/CommonType';
import {ISocket} from '../ISocket';

export interface INonConnectableInputSocket extends ISocket {
  get variableName(): string;
  get socketType():
    | ShaderAttributeVarType
    | ShaderVaryingVarType
    | ShaderUniformVarTypeES3;
  get precision(): ShaderPrecisionType;
}
