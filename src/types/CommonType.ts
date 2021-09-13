import {SocketTypeEnum} from './CommonEnum';

export type NodeId = number;

export type ShaderCodes = {
  vertexShaderCode: string;
  pixelShaderCode: string;
};

export type ShaderityGraphJson = {
  version: string;
  shaderName: string;
  nodes: ShaderityGraphNode[];
};

export type ShaderityGraphNode = {
  inputNodes: {[key: string]: ConnectedNode};
  outputNodes: {[key: string]: ConnectedNode};
  nodeData: {
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
