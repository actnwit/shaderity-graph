import {INode} from '../../../node/INode';
import {ISamplerInputSocket} from '../input/ISamplerInputSocket';
import {IUniformInputSocket} from '../input/IUniformInputSocket';
import {ISocket} from '../ISocket';

export interface ISamplerOutputSocket extends ISocket {
  _connectSocketWith(socket: ISamplerInputSocket): void;

  get connectedNodes(): INode[];
  get connectedSockets(): ISamplerInputSocket[];
  get correspondingUniformInputSocket(): IUniformInputSocket;
}
