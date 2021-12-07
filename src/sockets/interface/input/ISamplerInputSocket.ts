import {ShaderPrecisionType} from '../../../types/CommonType';
import {INode} from '../../../node/INode';
import {ISocket} from '../ISocket';
import {ISamplerOutputSocket} from '../output/ISamplerOutputSocket';

export interface ISamplerInputSocket extends ISocket {
  get connectedNode(): INode | undefined;
  get connectedSocket(): ISamplerOutputSocket | undefined;

  get variableName(): string;
  get precision(): ShaderPrecisionType;

  connectSocketWith(socket: ISamplerOutputSocket): void;
}
