import {INode} from '../../node/INode';
import {
  ShaderVaryingInputData,
  ShaderVaryingVarType,
} from '../../types/CommonType';
import {IVaryingOutputSocket} from '../interface/output/IVaryingOutputSocket';
import {IVaryingInputSocket} from '../interface/input/IVaryingInputSocket';
import AbstractSocket from '../abstract/AbstractSocket';

/**
 * The VaryingInputSocket is an input socket that receives an varying variable.
 * If the function corresponding to a node uses an varying variable,
 * the function must use this socket to receive the variable as an argument.
 * This socket can connects with VaryingOutputSockets.
 * This socket can be used only with fragment shader nodes.
 */
export default class VaryingInputSocket
  extends AbstractSocket
  implements IVaryingInputSocket
{
  private __variableName: string;
  private __type: ShaderVaryingVarType;

  _connectedSocket: IVaryingOutputSocket | undefined = undefined;

  constructor(
    node: INode,
    socketName: string,
    varying: ShaderVaryingInputData
  ) {
    super(node, socketName);
    this.__variableName = `v_non_connected_${node.id}_${socketName}`;
    this.__type = varying.type;
  }

  /**
   * Get the class name of this socket
   */
  get className(): 'VaryingInputSocket' {
    return 'VaryingInputSocket';
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
    return this.connectedSocket?.interpolationType;
  }

  /**
   * Get the precision of varying variable
   */
  get precision() {
    return this._connectedSocket?.precision || 'highp';
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

  /**
   * Connect this socket and a varying output socket
   * @param outputSocket The output socket to connect to
   */
  connectSocketWith(outputSocket: IVaryingOutputSocket) {
    if (this.socketType === outputSocket.socketType) {
      this._connectedSocket = outputSocket;
      outputSocket._connectSocketWith(this);

      this._setVariableName(outputSocket.variableName);
    } else {
      console.error(
        'VaryingInputSocket.connectSocketWith: socketType is different'
      );
    }
  }

  /**
   * @private
   * change variable name of this socket
   */
  _setVariableName(newVariableName: string) {
    this.__variableName = newVariableName;
  }
}
