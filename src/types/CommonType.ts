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
    nodeName?: string;
    shaderStage: 'vertex' | 'pixel' | 'noUse';
    shaderCode: string;
    extras: {[key: string]: unknown};
  };
  extras: {[key: string]: unknown};
};

export type ConnectedNode = {
  nodeId: number;
  socketType: SocketTypeEnum;
};
