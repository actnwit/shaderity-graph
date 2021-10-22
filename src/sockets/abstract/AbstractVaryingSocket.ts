import {INode} from '../../node/INode';
import {
  ShaderPrecisionType,
  ShaderVaryingInterpolationType,
  ShaderVaryingObject,
  ShaderVaryingVarType,
} from '../../types/CommonType';
import AbstractSocket from './AbstractSocket';
import {IVaryingInputSocket} from '../interface/input/IVaryingInputSocket';
import {IVaryingOutputSocket} from '../interface/output/IVaryingOutputSocket';

/**
 *
 */
export default abstract class AbstractVaryingSocket extends AbstractSocket {
  private __variableName: string;
  private __type: ShaderVaryingVarType;
  private __precision: ShaderPrecisionType;
  private __interpolationType: ShaderVaryingInterpolationType | undefined;

  constructor(node: INode, socketName: string, varying: ShaderVaryingObject) {
    super(node, socketName);

    this.__variableName = varying.variableName;
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
    } else {
      console.error(
        'AbstractVaryingSocket.connectSockets: socketType is different'
      );
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
