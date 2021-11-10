import {INode} from '../../node/INode';
import {
  ShaderPrecisionType,
  ShaderVaryingOutputData,
  ShaderVaryingInterpolationType,
} from '../../types/CommonType';
import AbstractVaryingSocket from '../abstract/AbstractVaryingSocket';
import {IVaryingOutputSocket} from '../interface/output/IVaryingOutputSocket';
import {IVaryingInputSocket} from '../interface/input/IVaryingInputSocket';

/**
 * The VaryingOutputSocket is an output socket that sets a value to a varying variable.
 * This socket can connects with VaryingInputSockets.
 * This socket can be used only with vertex shader nodes.
 */
export default class VaryingOutputSocket
  extends AbstractVaryingSocket
  implements IVaryingOutputSocket
{
  _connectedSockets: IVaryingInputSocket[] = [];

  private __precision?: ShaderPrecisionType;
  private __interpolationType: ShaderVaryingInterpolationType | undefined;

  constructor(
    node: INode,
    socketName: string,
    varying: ShaderVaryingOutputData
  ) {
    super(node, socketName, varying, `v_${node.id}_${socketName}`);

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
    const nodes: INode[] = new Array(this._connectedSockets.length);
    // the order of nodes is same to this._connectedSockets
    for (let i = 0; i < this._connectedSockets.length; i++) {
      nodes[i] = this._connectedSockets[i].node;
    }
    return nodes;
  }

  /**
   * Get the sockets that are connected to this socket.
   * @returns array of connected sockets
   */
  get connectedSockets() {
    return this._connectedSockets;
  }

  /**
   * Connect this socket and a varying input socket
   * @param socket The socket to connect to
   */
  _connectSocketWith(socket: IVaryingInputSocket) {
    this._connectedSockets.push(socket);
  }
}
