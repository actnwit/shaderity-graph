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

export interface ShaderCodes {
  vertexShader: string;
  fragmentShader: string;
}

export interface ShaderFunctionData {
  code: string;
  extensions?: string[];
  extras?: {[key: string]: unknown};
}

export interface ShaderFunctions {
  [shaderFunctionName: string]: ShaderFunctionData;
}

export interface ShaderityGraphJson {
  version: string;
  shaderityGraphNodes: ShaderityGraphNode[];
  vertexShaderGlobalData?: VertexShaderGlobalData;
  fragmentShaderGlobalData?: FragmentShaderGlobalData;
  shaderFunctions: ShaderFunctions;
  extras?: {[key: string]: unknown};
}

export type SocketData =
  | StandardInputSocketData
  | AttributeInputSocketData
  | VaryingInputSocketData
  | UniformInputSocketData
  | StandardOutputSocketData
  | VaryingOutputSocketData
  | ShaderOutputSocketData;

export interface ShaderityGraphNode {
  nodeData: NodeData;
  socketDataArray: SocketData[]; // the order must be the order of the function arguments for this node
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
  extras?: {[key: string]: unknown};
}

export interface FragmentShaderGlobalData extends VertexShaderGlobalData {
  outputVariableName?: string;
}

export interface SocketConnectionData {
  connectedSocketName: string;
  connectedNodeId: number;
  extras?: {[key: string]: unknown};
}

export interface AbstractSocketData {
  socketName: string;
  direction: SocketDirectionEnum;
  extras?: {[key: string]: unknown};
}

export interface StandardInputSocketData extends AbstractSocketData {
  direction: 'input';
  type: SocketTypeEnum;
  defaultValue: number[];
  socketConnectionData?: SocketConnectionData;
}

export interface StandardOutputSocketData extends AbstractSocketData {
  direction: 'output';
  type: SocketTypeEnum;
}

export type ShaderAttributeData = ShaderAttributeObject;

export interface AttributeInputSocketData extends AbstractSocketData {
  direction: 'input';
  attributeData: ShaderAttributeData;
}

export interface ShaderVaryingInputData {
  type: ShaderVaryingVarType;
}

export interface ShaderVaryingOutputData {
  type: ShaderVaryingVarType;
  precision?: ShaderPrecisionType;
  interpolationType?: ShaderVaryingInterpolationType;
}

export type ShaderVaryingData = ShaderVaryingOutputData;

export interface VaryingInputSocketData extends AbstractSocketData {
  direction: 'input';
  varyingData: ShaderVaryingInputData;
  socketConnectionData?: SocketConnectionData;
}

export interface VaryingOutputSocketData extends AbstractSocketData {
  direction: 'output';
  varyingData: ShaderVaryingOutputData;
}

export interface ShaderUniformData {
  type: ShaderUniformVarTypeES3;
  variableName?: string;
  precision?: ShaderPrecisionType;
}

export interface UniformInputSocketData extends AbstractSocketData {
  direction: 'input';
  uniformData: ShaderUniformData;
}

export interface ShaderOutputSocketData extends AbstractSocketData {
  direction: 'output';
}
