import {IConnectableInputSocket} from '../sockets/input/IConnectableInputSocket';
import {INonConnectableInputSocket} from '../sockets/input/INonConnectableInputSocket';
import {IConnectableOutputSocket} from '../sockets/output/IConnectableOutputSocket';
import {ISocket} from '../sockets/ISocket';
import {ShaderStageEnum} from '../types/CommonEnum';

export interface INode {
  get functionName(): string;
  get shaderCode(): string;
  get shaderStage(): ShaderStageEnum;
  get id(): number;
  get _extensions(): string[];
  get _sockets(): ISocket[];
  get _inputSockets(): (IConnectableInputSocket | INonConnectableInputSocket)[];
  get _outputSockets(): IConnectableOutputSocket[];

  getInputNode(socketName: string): INode | undefined;
  getOutputNodes(socketName: string): INode[];
}
