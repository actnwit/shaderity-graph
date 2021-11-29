import {ISocket} from '../sockets/interface/ISocket';
import {ShaderStageEnum} from '../types/CommonEnum';

export interface INode {
  set functionName(name: string);

  get functionName(): string;
  get shaderCode(): string;
  get shaderStage(): ShaderStageEnum;
  get id(): number;
  get _shaderFunctionDataKey(): string;
  get _extensions(): string[];
  get _sockets(): ISocket[];

  getInputNode(socketName: string): INode | undefined;
  getOutputNodes(socketName: string): INode[];
  getVariableNameOfInputSocket(socketName: string): string;
}
