import {IInputSocket} from '../sockets/IInputSocket';
import {IOutputSocket} from '../sockets/IOutputSocket';
import {ShaderStageEnum, SocketTypeEnum} from '../types/CommonEnum';

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
  get _shaderFunctionDataId(): number;

  addInputSocket(
    socketName: string,
    SocketType: SocketTypeEnum,
    argumentId: number,
    defaultValue: number[]
  ): void;
  addOutputSocket(
    socketName: string,
    SocketType: SocketTypeEnum,
    argumentId: number
  ): void;
  getInputNode(socketName: string): INode | undefined;
  getOutputNodes(socketName: string): INode[];
  _getInputSocket(socketName: string): IInputSocket | undefined;
  _getOutputSocket(socketName: string): IOutputSocket | undefined;
}
