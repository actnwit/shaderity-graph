import {ShaderityObject} from 'shaderity';
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
  NodeTypeEnum,
  SamplerTypeEnum,
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

export interface ShaderityObjects {
  vertexShaderityObject: ShaderityObject;
  fragmentShaderityObject: ShaderityObject;
}

export interface ShaderFunctionData {
  code: string;
  extensions?: string[];
  extras?: {[key: string]: unknown};
}

export interface ShaderFunctions {
  [shaderFunctionDataKey: string]: ShaderFunctionData;
}

export interface ShaderityGraphJson {
  version: string;
  shaderityGraphNodes: ShaderityGraphNode[];
  vertexShaderGlobalData?: ShaderGlobalData;
  fragmentShaderGlobalData?: ShaderGlobalData;
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
  | ShaderOutputSocketData
  | SamplerInputSocketData
  | SamplerOutputSocketData;

export type InputSocketData =
  | StandardInputSocketData
  | AttributeInputSocketData
  | VaryingInputSocketData
  | UniformInputSocketData
  | SamplerInputSocketData;

export type OutputSocketData =
  | StandardOutputSocketData
  | VaryingOutputSocketData
  | ShaderOutputSocketData
  | SamplerOutputSocketData;

export interface ShaderityGraphNode {
  nodeData: NodeData;
  socketDataArray: SocketData[]; // the order must be the order of the function arguments for this node
  extras?: {[key: string]: unknown};
}

export type NodeData = ShaderityNodeData | SamplerInputNodeData;

export interface AbstractNodeData {
  nodeType?: NodeTypeEnum;
  shaderStage: ShaderStageEnum;
  extras?: {[key: string]: unknown};
}

export interface ShaderityNodeData extends AbstractNodeData {
  shaderFunctionName: string;
  shaderFunctionDataKey: string;
  nodeType?: 'shaderityNode';
}

export interface SamplerInputNodeData extends AbstractNodeData {
  nodeType: 'samplerInputNode';
}

export interface ShaderGlobalData {
  defineDirectives?: string[];
  precision?: ShaderPrecisionObject;
  constantValues?: ShaderConstantValueObject[];
  extras?: {[key: string]: unknown};
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

export interface ShaderStandardInputData {
  type: SocketTypeEnum;
  defaultValue?: number[];
}

export interface ShaderStandardOutputData {
  type: SocketTypeEnum;
  precision?: ShaderPrecisionType;
}

export interface StandardInputSocketData extends AbstractSocketData {
  direction: 'in';
  shaderData: ShaderStandardInputData;
  socketConnectionData?: SocketConnectionData;
}

export interface StandardOutputSocketData extends AbstractSocketData {
  direction: 'out';
  shaderData: ShaderStandardOutputData;
}

export type ShaderAttributeData = ShaderAttributeObject;

export interface AttributeInputSocketData extends AbstractSocketData {
  direction: 'in';
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
  direction: 'in';
  varyingData: ShaderVaryingInputData;
  socketConnectionData?: SocketConnectionData;
}

export interface VaryingOutputSocketData extends AbstractSocketData {
  direction: 'out';
  varyingData: ShaderVaryingOutputData;
}

export interface ShaderUniformData {
  type: ShaderUniformVarTypeES3;
  variableName?: string;
  precision?: ShaderPrecisionType;
}

export interface UniformInputSocketData extends AbstractSocketData {
  direction: 'in';
  uniformData: ShaderUniformData;
}

export interface ShaderOutputSocketData extends AbstractSocketData {
  direction: 'out';
}

export interface SamplerInputSocketData extends AbstractSocketData {
  direction: 'in';
  samplerType: SamplerTypeEnum;
  socketConnectionData?: SocketConnectionData;
}

export interface SamplerOutputSocketData extends AbstractSocketData {
  direction: 'out';
  samplerType: SamplerTypeEnum;
}
