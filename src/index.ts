import NodeConverter from './main/NodeConverter';
import {
  ShaderStage,
  ShaderStageEnum,
  SocketType,
  SocketTypeEnum,
  SocketDirection,
  SocketDirectionEnum,
} from './types/CommonEnum';
import {
  SocketData,
  ShaderCodes,
  ShaderityGraphJson,
  ShaderityGraphNode,
} from './types/CommonType';

export default {
  ShaderStage,
  SocketDirection,
  NodeConverter,
  SocketType,
  Version: NodeConverter.shaderityGraphVersion,
};

export type {
  ShaderStageEnum,
  ShaderCodes,
  ShaderityGraphJson,
  ShaderityGraphNode,
  SocketData,
  SocketTypeEnum,
  SocketDirectionEnum,
};
