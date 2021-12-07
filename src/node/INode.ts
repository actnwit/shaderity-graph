import {ISocket} from '../sockets/interface/ISocket';
import {ShaderStageEnum} from '../types/CommonEnum';

export interface INode {
  get shaderStage(): ShaderStageEnum;
  get id(): number;
  get _sockets(): ISocket[];

  getInputNode(socketName: string): INode | undefined;
  getOutputNodes(socketName: string): INode[];
  getVariableNameOfInputSocket(socketName: string): string;
}
