import {IConnectableInputSocket} from '../sockets/input/IConnectableInputSocket';
import {INonConnectableInputSocket} from '../sockets/input/INonConnectableInputSocket';
import {IConnectableOutputSocket} from '../sockets/output/IConnectableOutputSocket';
import {ShaderStageEnum} from '../types/CommonEnum';

export type NodeClassName =
  | 'Node'
  | 'AttributeInputNode'
  | 'VaryingInputNode'
  | 'UniformInputNode';

export interface INode {
  get className(): NodeClassName;
  get functionName(): string;
  get shaderCode(): string;
  get shaderStage(): ShaderStageEnum;
  get extensions(): string[];
  get id(): number;
  get _inputSockets(): (IConnectableInputSocket | INonConnectableInputSocket)[];
  get _outputSockets(): IConnectableOutputSocket[];

  getInputNode(socketName: string): INode | undefined;
  getOutputNodes(socketName: string): INode[];
}
