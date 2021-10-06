import {IConnectableInputSocket} from '../sockets/input/IConnectableInputSocket';
import {IConnectableOutputSocket} from '../sockets/output/IConnectableOutputSocket';
import {ShaderStageEnum} from '../types/CommonEnum';

export type NodeClassNames =
  | 'Node'
  | 'AttributeInputNode'
  | 'VaryingInputNode'
  | 'UniformInputNode';

export interface INode {
  get className(): NodeClassNames;
  get functionName(): string;
  get shaderCode(): string;
  get shaderStage(): ShaderStageEnum;
  get extensions(): string[];
  get id(): number;
  get _inputSockets(): IConnectableInputSocket[];
  get _outputSockets(): IConnectableOutputSocket[];

  getInputNode(socketName: string): INode | undefined;
  getOutputNodes(socketName: string): INode[];
}
