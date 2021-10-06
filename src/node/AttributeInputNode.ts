import {
  AttributeInputNodeData,
  ConnectableInputSocketData,
  ConnectableOutputSocketData,
} from '../types/CommonType';
import {NodeClassName} from './INode';
import Node from './Node';

/**
 * The attribute input node is a node that gets a single attribute value
 * as input without going through the socket.
 *
 */
export default class AttributeInputNode extends Node {
  protected __nodeData: AttributeInputNodeData;

  constructor(
    nodeData: AttributeInputNodeData,
    socketData: (ConnectableInputSocketData | ConnectableOutputSocketData)[]
  ) {
    super(nodeData, socketData);
    this.__nodeData = nodeData;
  }

  get className(): NodeClassName {
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
