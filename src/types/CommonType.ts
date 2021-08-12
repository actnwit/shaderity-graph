import {SocketTypeEnum} from './CommonEnum';

export type NodeId = number;

export type ShaderCodes = {
  vertexShaderCode: string;
  pixelShaderCode: string;
};

export type ShaderityGraphJson = {
  version: string;
  shaderName: string;
  nodes: ShaderityGraphNodeJson[];
};

export type ShaderityGraphNodeJson = {
  inputNodes: {[key: string]: ConnectedNode};
  outputNodes: {[key: string]: ConnectedNode};
  shaderityData: {
    shaderFunctionName: string;
    shaderFunctionCode: string;
    shaderStage: 'vertex' | 'pixel' | 'noUse';
    extras: {[key: string]: unknown};
  };
  extras: {[key: string]: unknown};
};

export type ConnectedNode = {
  nodeId: number;
  socketType: SocketTypeEnum;
};
