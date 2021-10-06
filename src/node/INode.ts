import {IInputSocket} from '../sockets/input/IInputSocket';
import {IOutputSocket} from '../sockets/output/IOutputSocket';
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
  get _inputSockets(): IInputSocket[];
  get _outputSockets(): IOutputSocket[];

  getInputNode(socketName: string): INode | undefined;
  getOutputNodes(socketName: string): INode[];
}
