import {
  AttributeInputSocketData,
  ConnectableInputSocketData,
  ConnectableOutputSocketData,
  UniformInputNodeData,
  UniformInputSocketData,
  VaryingInputSocketData,
} from '../types/CommonType';
import {NodeClassName} from './INode';
import Node from './Node';

export default class UniformInputNode extends Node {
  protected __nodeData: UniformInputNodeData;

  constructor(
    nodeData: UniformInputNodeData,
    socketDataArray: (
      | ConnectableInputSocketData
      | ConnectableOutputSocketData
      | AttributeInputSocketData
      | VaryingInputSocketData
      | UniformInputSocketData
    )[]
  ) {
    super(nodeData, socketDataArray);
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
