import {
  ConnectableInputSocketData,
  ConnectableOutputSocketData,
  UniformInputNodeData,
} from '../types/CommonType';
import {NodeClassName} from './INode';
import Node from './Node';

export default class UniformInputNode extends Node {
  protected __nodeData: UniformInputNodeData;

  constructor(
    nodeData: UniformInputNodeData,
    socketData: (ConnectableInputSocketData | ConnectableOutputSocketData)[]
  ) {
    super(nodeData, socketData);
    this.__nodeData = nodeData;
  }

  get className(): NodeClassName {
    return 'UniformInputNode';
  }

  get variableName() {
    return this.__nodeData.uniform.variableName;
  }

  get type() {
    return this.__nodeData.uniform.type;
  }

  get precision() {
    return this.__nodeData.uniform.precision;
  }
}
