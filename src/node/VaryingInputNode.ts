import {
  AttributeInputSocketData,
  ConnectableInputSocketData,
  ConnectableOutputSocketData,
  UniformInputSocketData,
  VaryingInputNodeData,
  VaryingInputSocketData,
} from '../types/CommonType';
import {NodeClassName} from './INode';
import Node from './Node';

export default class VaryingInputNode extends Node {
  protected __nodeData: VaryingInputNodeData;

  constructor(
    nodeData: VaryingInputNodeData,
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
    return 'VaryingInputNode';
  }

  get variableName() {
    return this.__nodeData.varying.variableName;
  }

  get type() {
    return this.__nodeData.varying.type;
  }

  get precision() {
    return this.__nodeData.varying.precision;
  }

  get interpolationType() {
    return this.__nodeData.varying.interpolationType;
  }
}
