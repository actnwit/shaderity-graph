import {INode} from '../../node/INode';
import {
  ShaderPrecisionType,
  ShaderVaryingInterpolationType,
  ShaderVaryingData,
  ShaderVaryingVarType,
} from '../../types/CommonType';
import AbstractSocket from './AbstractSocket';
import {IVaryingInputSocket} from '../interface/input/IVaryingInputSocket';
import {IVaryingOutputSocket} from '../interface/output/IVaryingOutputSocket';

/**
 * The roll of varying sockets are passing data from the vertex shader to the fragment shader.
 * The user can connect sockets by Node.connectNodes method.
 */
export default abstract class AbstractVaryingSocket extends AbstractSocket {
  protected __rawVariableName: string | undefined;
  protected __variableName: string;
  private __type: ShaderVaryingVarType;
  private __precision: ShaderPrecisionType;
  private __interpolationType: ShaderVaryingInterpolationType | undefined;

  constructor(node: INode, socketName: string, varying: ShaderVaryingData) {
    super(node, socketName);

    this.__rawVariableName = varying.variableName;
    this.__variableName =
      this.__rawVariableName ?? `v_${node.id}_${socketName}`;
    this.__type = varying.type;
    this.__precision = varying.precision ?? 'highp';
    this.__interpolationType = varying.interpolationType;
  }

  /**
   * Connecting input and output varying sockets
   * @param inputSocket varying input socket contained in the output node
   * @param outputSocket varying output socket contained in the input node
   */
  static connectSockets(
    inputSocket: IVaryingInputSocket,
    outputSocket: IVaryingOutputSocket
  ) {
    if (inputSocket.socketType === outputSocket.socketType) {
      inputSocket._connectSocketWith(outputSocket);
      outputSocket._connectSocketWith(inputSocket);

      this.__updateVariableName(outputSocket);
    } else {
      console.error(
        'AbstractVaryingSocket.connectSockets: socketType is different'
      );
    }
  }

  /**
   * @private
   * Update the variable name of the output socket of the argument and
   * all input sockets connected to it to the same unique value
   * @param outputSocket target output socket
   */
  private static __updateVariableName(outputSocket: IVaryingOutputSocket) {
    const newVariableName = outputSocket._createNewVariableName();

    outputSocket._setVariableName(newVariableName);
    const inputSockets = outputSocket.connectedSockets;
    for (const inputSocket of inputSockets) {
      inputSocket._setVariableName(newVariableName);
    }
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
   * Get the precision of varying variable
   */
  get precision() {
    return this.__precision;
  }

  /**
   * Get the interpolationType of varying variable(for GLSL ES3.0)
   */
  get interpolationType() {
    return this.__interpolationType;
  }

  /**
   * @private
   * change variable name of this socket
   */
  _setVariableName(newVariableName: string) {
    this.__variableName = newVariableName;
  }

  /**
   * Get the class name of this socket
   */
  abstract get className(): 'VaryingInputSocket' | 'VaryingOutputSocket';

  /**
   * Connect this socket and the argument socket
   * @param socket The socket to connect to
   */
  abstract _connectSocketWith(
    socket: IVaryingInputSocket | IVaryingOutputSocket
  ): void;
}
