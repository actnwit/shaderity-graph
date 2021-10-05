import {
  InputSocketData,
  OutputSocketData,
  UniformInputNodeData,
} from '../types/CommonType';
import {NodeClassNames} from './INode';
import Node from './Node';

export default class UniformInputNode extends Node {
  protected __nodeData: UniformInputNodeData;

  constructor(
    nodeData: UniformInputNodeData,
    socketData: (InputSocketData | OutputSocketData)[]
  ) {
    super(nodeData, socketData);
    this.__nodeData = nodeData;
  }

  get className(): NodeClassNames {
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
