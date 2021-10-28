import {INode} from '../../node/INode';
import {ShaderVaryingData} from '../../types/CommonType';
import AbstractVaryingSocket from '../abstract/AbstractVaryingSocket';
import {IVaryingOutputSocket} from '../interface/output/IVaryingOutputSocket';
import {IVaryingInputSocket} from '../interface/input/IVaryingInputSocket';

/**
 * The VaryingInputSocket is an input socket that receives an varying variable.
 * If the function corresponding to a node uses an varying variable,
 * the function must use this socket to receive the variable as an argument.
 * This socket can connects with VaryingOutputSockets.
 * This socket can be used only with fragment shader nodes.
 */
export default class VaryingInputSocket
  extends AbstractVaryingSocket
  implements IVaryingInputSocket
{
  _connectedSocket: IVaryingOutputSocket | undefined = undefined;

  constructor(node: INode, socketName: string, varying: ShaderVaryingData) {
    super(node, socketName, varying);
  }

  /**
   * Get the class name of this socket
   */
  get className(): 'VaryingInputSocket' {
    return 'VaryingInputSocket';
  }

  /**
   * Get the node that has the socket connected to this socket
   * @returns connected node or undefined
   */
  get connectedNode() {
    return this._connectedSocket?.node;
  }

  /**
   * Get the socket that is connected to this socket
   * @returns connected socket or undefined
   */
  get connectedSocket() {
    return this._connectedSocket;
  }

  _connectSocketWith(socket: IVaryingOutputSocket) {
    this._connectedSocket = socket;
  }
}
