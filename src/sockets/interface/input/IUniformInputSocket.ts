import {
  ShaderPrecisionType,
  ShaderUniformVarTypeES3,
} from '../../../types/CommonType';
import {ISocket} from '../ISocket';

export interface IUniformInputSocket extends ISocket {
  get className(): 'UniformInputSocket';
  get variableName(): string;
  get socketType(): ShaderUniformVarTypeES3;
  get precision(): ShaderPrecisionType | undefined;
}
