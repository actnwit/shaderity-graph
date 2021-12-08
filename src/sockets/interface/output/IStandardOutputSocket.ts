import {INode} from '../../../node/INode';
import {IStandardInputSocket} from '../input/IStandardInputSocket';
import {ShaderPrecisionType} from '../../../types/CommonType';
import {ISocket} from '../ISocket';

export interface IStandardOutputSocket extends ISocket {
  get connectedNodes(): INode[];
  get connectedSockets(): IStandardInputSocket[];
  get precision(): ShaderPrecisionType | undefined;

  _connectSocketWith(socket: IStandardInputSocket): void;
}
