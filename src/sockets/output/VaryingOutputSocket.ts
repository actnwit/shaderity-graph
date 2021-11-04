import {INode} from '../../node/INode';
import {ShaderVaryingData} from '../../types/CommonType';
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

  constructor(node: INode, socketName: string, varying: ShaderVaryingData) {
    super(node, socketName, varying);
  }

  /**
   * Get the class name of this socket
   */
  get className(): 'VaryingOutputSocket' {
    return 'VaryingOutputSocket';
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

  _createNewVariableName() {
    const outputNodes = this.connectedNodes;

    if (this.__rawVariableName != null) {
      return this.__rawVariableName;
    }

    let variableName = `v_${this.node.id}_${this.socketName}_to`;
    for (let i = 0; i < outputNodes.length; i++) {
      const connectedNode = outputNodes[i];
      variableName += `_${connectedNode.id}`;
    }

    return variableName;
  }
}
