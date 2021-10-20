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
  SocketData,
  ShaderCodes,
  ShaderityGraphJson,
  ShaderityGraphNode,
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
  SocketData,
  SocketTypeEnum,
  SocketDirectionEnum,
};
