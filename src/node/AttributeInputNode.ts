import {AttributeInputNodeData} from '../types/CommonType';
import Node, {NodeClassNames} from './Node';

export default class AttributeInputNode extends Node {
  protected __nodeData: AttributeInputNodeData;

  constructor(nodeData: AttributeInputNodeData) {
    super(nodeData);
    this.__nodeData = nodeData;
  }

  get className(): NodeClassNames {
    return 'AttributeInputNode';
  }

  get variableName() {
    return this.__nodeData.attribute.variableName;
  }

  get type() {
    return this.__nodeData.attribute.type;
  }

  get precision() {
    return this.__nodeData.attribute.precision;
  }

  get location() {
    return this.__nodeData.attribute.location;
  }
}
