import {
  ShaderPrecisionType as _ShaderPrecisionType,
  ShaderAttributeVarType as _ShaderAttributeVarType,
  ShaderConstantValueVarTypeES3 as _ShaderConstantValueVarTypeES3,
  ShaderVaryingVarType as _ShaderVaryingVarType,
  ShaderVaryingInterpolationType as _ShaderVaryingInterpolationType,
  ShaderPrecisionObject as _ShaderPrecisionObject,
  ShaderAttributeObject as _ShaderAttributeObject,
  ShaderConstantValueObject as _ShaderConstantValueObject,
  ShaderUniformObject as _ShaderUniformObject,
  ShaderVaryingObject as _ShaderVaryingObject,
} from 'shaderity/dist/esm';
import {SocketTypeEnum} from './CommonEnum';

export type ShaderPrecisionType = _ShaderPrecisionType;
export type ShaderAttributeVarType = _ShaderAttributeVarType;
export type ShaderConstantValueVarTypeES3 = _ShaderConstantValueVarTypeES3;
export type ShaderVaryingVarType = _ShaderVaryingVarType; // equals to _ShaderAttributeVarType
export type ShaderVaryingInterpolationType = _ShaderVaryingInterpolationType;
export type ShaderPrecisionObject = _ShaderPrecisionObject;
export type ShaderAttributeObject = _ShaderAttributeObject;
export type ShaderConstantValueObject = _ShaderConstantValueObject;
export type ShaderUniformObject = _ShaderUniformObject;
export type ShaderVaryingObject = _ShaderVaryingObject;

export type GlslTypeStr =
  | 'bool'
  | 'int'
  | 'float'
  | 'vec2'
  | 'vec3'
  | 'vec4'
  | 'ivec2'
  | 'ivec3'
  | 'ivec4'
  | 'sampler2D'
  | 'samplerCube'
  | 'mat2'
  | 'mat3'
  | 'mat4'
  | 'unknown';

export interface ShaderCodes {
  vertexShader: string;
  fragmentShader: string;
}

export interface ShaderFunctionData {
  shaderFunctionCode: string;
  extensions?: string[];
}

export interface ShaderityGraphJson {
  version: string;
  shaderName: string;
  nodes: ShaderityGraphNode[];
  vertexShaderGlobalData?: ShaderGlobalData;
  fragmentShaderGlobalData: FragmentShaderGlobalData;
}

export interface ShaderityGraphNode {
  nodeData:
    | NodeData
    | AttributeInputNodeData
    | VaryingInputNodeData
    | UniformInputNodeData;
  socketData: (InputSocketData | OutputSocketData)[]; // the order must be the order of the function arguments for this node
  extras?: {[key: string]: unknown};
}

export interface NodeData {
  shaderFunctionName: string;
  shaderFunctionCode: string;
  shaderStage: 'vertex' | 'fragment' | 'noUse';
  extensions?: string[];
  extras?: {[key: string]: unknown};
}

export interface AttributeInputNodeData extends NodeData {
  attribute: ShaderAttributeObject;
}

export interface VaryingInputNodeData extends NodeData {
  varying: ShaderVaryingObject;
}

export interface UniformInputNodeData extends NodeData {
  uniform: ShaderUniformObject;
}

export interface ShaderGlobalData {
  defineDirectives?: string[];
  precision?: ShaderPrecisionObject;
  constantValues?: ShaderConstantValueObject[];
}

export interface FragmentShaderGlobalData extends ShaderGlobalData {
  outputVariableName: string;
}

export interface SocketConnectionDatum {
  connectedSocketName: string;
  connectedNodeId: number;
}

// if the direction is input/output, the socket is InputSocket/OutputSocket
export interface SocketData {
  name: string;
  argumentId: number;
  type: SocketTypeEnum;
  direction: 'input' | 'output';
}

export interface InputSocketData extends SocketData {
  defaultValue: number[];
  socketConnectionDatum?: SocketConnectionDatum;
}
export interface OutputSocketData extends SocketData {
  socketConnectionData?: SocketConnectionDatum[];
}
