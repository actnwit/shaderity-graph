import NodeConverter from './main/NodeConverter';
import {SocketType, SocketTypeEnum} from './types/CommonEnum';
import {
  SocketData,
  ShaderCodes,
  ShaderityGraphJson,
  ShaderityGraphNode,
} from './types/CommonType';

export default {
  NodeConverter,
  SocketType,
  Version: NodeConverter.shaderityGraphVersion,
};

export type {
  ShaderCodes,
  ShaderityGraphJson,
  ShaderityGraphNode,
  SocketData,
  SocketTypeEnum,
};
