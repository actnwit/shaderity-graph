import ShaderityGraphConverter from './main/ShaderityGraphConverter';
import {
  ShaderStage,
  ShaderStageEnum,
  SocketType,
  SocketTypeEnum,
  SocketDirection,
  SocketDirectionEnum,
} from './types/CommonEnum';
import {
  ShaderCodes,
  ShaderityGraphJson,
  ShaderityGraphNode,
  VertexShaderGlobalData,
  FragmentShaderGlobalData,
  ShaderFunctionCode,
  ShaderFunctionCodeObject,
  NodeData,
  StandardInputSocketData,
  AttributeInputSocketData,
  VaryingInputSocketData,
  UniformInputSocketData,
  StandardOutputSocketData,
  VaryingOutputSocketData,
  SocketConnectionData,
} from './types/CommonType';

export default {
  ShaderStage,
  SocketDirection,
  ShaderityGraphConverter,
  SocketType,
  Version: ShaderityGraphConverter.shaderityGraphVersion,
};

export type {
  ShaderStageEnum,
  ShaderCodes,
  ShaderityGraphJson,
  ShaderityGraphNode,
  SocketTypeEnum,
  SocketDirectionEnum,
  VertexShaderGlobalData,
  FragmentShaderGlobalData,
  ShaderFunctionCode,
  ShaderFunctionCodeObject,
  NodeData,
  StandardInputSocketData,
  AttributeInputSocketData,
  VaryingInputSocketData,
  UniformInputSocketData,
  StandardOutputSocketData,
  VaryingOutputSocketData,
  SocketConnectionData,
};
