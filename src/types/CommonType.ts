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
  inputNodes: {[key: string]: number};
  outputNodes: {[key: string]: number};
  shaderityData: {
    nodeName?: string;
    shaderStage: 'vertex' | 'pixel' | 'noUse';
    shaderCode: string;
    extras: {[key: string]: unknown};
  };
  extras: {[key: string]: unknown};
};
