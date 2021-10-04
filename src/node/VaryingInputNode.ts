import {VaryingInputNodeData} from '../types/CommonType';
import Node, {NodeClassNames} from './Node';

export default class VaryingInputNode extends Node {
  protected __nodeData: VaryingInputNodeData;

  constructor(nodeData: VaryingInputNodeData) {
    super(nodeData);
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
