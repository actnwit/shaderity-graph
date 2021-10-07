import {
  InputSocketData,
  OutputSocketData,
  VaryingInputNodeData,
} from '../types/CommonType';
import {NodeClassNames} from './INode';
import Node from './Node';

export default class VaryingInputNode extends Node {
  protected __nodeData: VaryingInputNodeData;

  constructor(
    nodeData: VaryingInputNodeData,
    socketData: (InputSocketData | OutputSocketData)[]
  ) {
    super(nodeData, socketData);
    this.__nodeData = nodeData;
  }

  get className(): NodeClassNames {
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
