import {ISocket} from '../sockets/ISocket';
import {ShaderStageEnum} from '../types/CommonEnum';

export interface INode {
  get functionName(): string;
  get shaderCode(): string;
  get shaderStage(): ShaderStageEnum;
  get id(): number;
  get _extensions(): string[];
  get _sockets(): ISocket[];

  getInputNode(socketName: string): INode | undefined;
  getOutputNodes(socketName: string): INode[];
}
