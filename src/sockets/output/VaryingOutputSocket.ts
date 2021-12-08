import {INode} from '../../node/INode';
import {
  ShaderPrecisionType,
  ShaderVaryingOutputData,
  ShaderVaryingInterpolationType,
  ShaderVaryingVarType,
} from '../../types/CommonType';
import {IVaryingOutputSocket} from '../interface/output/IVaryingOutputSocket';
import {IVaryingInputSocket} from '../interface/input/IVaryingInputSocket';
import AbstractSocket from '../abstract/AbstractSocket';

/**
 * The VaryingOutputSocket is an output socket that sets a value to a varying variable.
 * This socket can connects with VaryingInputSockets.
 * This socket can be used only with vertex shader nodes.
 */
export default class VaryingOutputSocket
  extends AbstractSocket
  implements IVaryingOutputSocket
{
  private __variableName: string;
  private __type: ShaderVaryingVarType;
  private __precision?: ShaderPrecisionType;
  private __interpolationType: ShaderVaryingInterpolationType | undefined;
  private __connectedSockets: IVaryingInputSocket[] = [];

  constructor(
    node: INode,
    socketName: string,
    varying: ShaderVaryingOutputData
  ) {
    super(node, socketName);

    this.__variableName = `v_${node.id}_${socketName}`;
    this.__type = varying.type;
    this.__precision = varying.precision;
    this.__interpolationType = varying.interpolationType;
  }

  /**
   * Get the class name of this socket
   */
  get className(): 'VaryingOutputSocket' {
    return 'VaryingOutputSocket';
  }

  /**
   * Get the varying variable name
   */
  get variableName() {
    return this.__variableName;
  }

  /**
   * Get the glsl type of varying variable
   */
  get socketType() {
    return this.__type;
  }

  /**
   * Get the interpolationType of varying variable(for GLSL ES3.0)
   */
  get interpolationType() {
    return this.__interpolationType;
  }

  /**
   * Get the precision of varying variable
   */
  get precision() {
    return this.__precision;
  }

  /**
   * Get the nodes that have a socket connected to this socket.
   * @returns array of connected Nodes
   */
  get connectedNodes() {
    const nodes: INode[] = new Array(this.__connectedSockets.length);
    // the order of nodes is same to this._connectedSockets
    for (let i = 0; i < this.__connectedSockets.length; i++) {
      nodes[i] = this.__connectedSockets[i].node;
    }
    return nodes;
  }

  /**
   * Get the sockets that are connected to this socket.
   * @returns array of connected sockets
   */
  get connectedSockets() {
    return this.__connectedSockets;
  }

  /**
   * @private
   * Connect socket from this socket to a varying input socket
   * Do not call this method except from the connectSocketWith method of the VaryingInputSocket class
   *
   * @param inputSocket The input socket to connect to
   */
  _connectSocketWith(inputSocket: IVaryingInputSocket) {
    this.__connectedSockets.push(inputSocket);
  }
}
