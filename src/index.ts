import System from './system/System';
import {SocketType, SocketTypeEnum} from './types/CommonEnum';
import {
  ConnectedNode,
  ShaderCodes,
  ShaderityGraphJson,
  ShaderityGraphNodeJson,
} from './types/CommonType';

export default {
  System,
  SocketType,
  Version: System.shaderityGraphVersion,
};

export type {
  ShaderCodes,
  ShaderityGraphJson,
  ShaderityGraphNodeJson,
  ConnectedNode,
  SocketTypeEnum,
};
