import {
  ShaderPrecisionType as _ShaderPrecisionType,
  ShaderAttributeVarType as _ShaderAttributeVarType,
  ShaderConstantValueVarTypeES3 as _ShaderConstantValueVarTypeES3,
  ShaderVaryingVarType as _ShaderVaryingVarType,
  ShaderVaryingInterpolationType as _ShaderVaryingInterpolationType,
  ShaderUniformVarTypeES3 as _ShaderUniformVarTypeES3,
  ShaderPrecisionObject as _ShaderPrecisionObject,
  ShaderAttributeObject as _ShaderAttributeObject,
  ShaderConstantValueObject as _ShaderConstantValueObject,
  ShaderUniformObject as _ShaderUniformObject,
  ShaderVaryingObject as _ShaderVaryingObject,
} from 'shaderity/dist/esm';
import {
  ShaderStageEnum,
  SocketDirectionEnum,
  SocketTypeEnum,
} from './CommonEnum';

export type ShaderPrecisionType = _ShaderPrecisionType;
export type ShaderAttributeVarType = _ShaderAttributeVarType;
export type ShaderConstantValueVarTypeES3 = _ShaderConstantValueVarTypeES3;
export type ShaderVaryingVarType = _ShaderVaryingVarType; // equals to _ShaderAttributeVarType
export type ShaderVaryingInterpolationType = _ShaderVaryingInterpolationType;
export type ShaderUniformVarTypeES3 = _ShaderUniformVarTypeES3;
export type ShaderPrecisionObject = _ShaderPrecisionObject;
export type ShaderAttributeObject = _ShaderAttributeObject;
export type ShaderConstantValueObject = _ShaderConstantValueObject;
export type ShaderUniformObject = _ShaderUniformObject;
export type ShaderVaryingObject = _ShaderVaryingObject;

export interface ShaderCodes {
  vertexShader: string;
  fragmentShader: string;
}

export interface ShaderFunctionCode {
  shaderFunctionCode: string;
  extensions?: string[];
}

export interface ShaderityGraphJson {
  version: string;
  shaderName: string;
  nodes: ShaderityGraphNode[];
  vertexShaderGlobalData?: VertexShaderGlobalData;
  fragmentShaderGlobalData?: FragmentShaderGlobalData;
  shaderFunctionCodeObject: {[shaderFunctionName: string]: ShaderFunctionCode};
}

export interface ShaderityGraphNode {
  nodeData: NodeData;
  socketDataArray: (
    | ConnectableInputSocketData
    | ConnectableOutputSocketData
    | AttributeInputSocketData
    | VaryingInputSocketData
    | UniformInputSocketData
  )[]; // the order must be the order of the function arguments for this node
  extras?: {[key: string]: unknown};
}

export interface NodeData {
  shaderFunctionName: string;
  shaderStage: ShaderStageEnum;
  extras?: {[key: string]: unknown};
}

export interface VertexShaderGlobalData {
  defineDirectives?: string[];
  precision?: ShaderPrecisionObject;
  constantValues?: ShaderConstantValueObject[];
}

export interface FragmentShaderGlobalData extends VertexShaderGlobalData {
  outputVariableName?: string;
}

export interface SocketConnectionData {
  connectedSocketName: string;
  connectedNodeId: number;
}

export interface SocketData {
  name: string;
  direction: SocketDirectionEnum;
}

export interface ConnectableInputSocketData extends SocketData {
  direction: 'input';
  type: SocketTypeEnum;
  defaultValue: number[];
  socketConnectionData?: SocketConnectionData;
}

export interface ConnectableOutputSocketData extends SocketData {
  direction: 'output';
  type: SocketTypeEnum;
  socketConnectionData?: SocketConnectionData[];
}

export interface AttributeInputSocketData extends SocketData {
  direction: 'input';
  attributeData: ShaderAttributeObject;
}

export interface VaryingInputSocketData extends SocketData {
  direction: 'input';
  varyingData: ShaderVaryingObject;
}

export interface UniformInputSocketData extends SocketData {
  direction: 'input';
  uniformData: ShaderUniformObject;
}
