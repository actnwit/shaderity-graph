import System from './system/System';
import {SocketType, SocketTypeEnum} from './types/CommonEnum';
import {
  SocketData,
  ShaderCodes,
  ShaderityGraphJson,
  ShaderityGraphNode,
} from './types/CommonType';

export default {
  System,
  SocketType,
  Version: System.shaderityGraphVersion,
};

export type {
  ShaderCodes,
  ShaderityGraphJson,
  ShaderityGraphNode,
  SocketData,
  SocketTypeEnum,
};
