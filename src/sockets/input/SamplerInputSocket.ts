import {SamplerTypeEnum} from '../../types/CommonEnum';
import {INode} from '../../node/INode';
import AbstractSocket from '../abstract/AbstractSocket';
import {ISamplerInputSocket} from '../interface/input/ISamplerInputSocket';
import {ISamplerOutputSocket} from '../interface/output/ISamplerOutputSocket';

/**
 * The SamplerInputSocket is an input socket that can connect to a SamplerOutputSocket.
 * This socket can connect to at most one SamplerOutputSocket.
 */
export default class SamplerInputSocket
  extends AbstractSocket
  implements ISamplerInputSocket
{
  private __connectedSocket: ISamplerOutputSocket | undefined = undefined;

  private __socketType: SamplerTypeEnum;

  constructor(node: INode, socketName: string, type: SamplerTypeEnum) {
    super(node, socketName);
    this.__socketType = type;
  }

  /**
   * Get the class name of this socket
   */
  get className(): 'SamplerInputSocket' {
    return 'SamplerInputSocket';
  }

  /**
   * Get the glsl type of data to be passed between sockets
   */
  get socketType() {
    return this.__socketType;
  }

  /**
   * Get the node that has the socket connected to this socket
   * @returns connected node or undefined
   */
  get connectedNode() {
    return this.__connectedSocket?.node;
  }

  /**
   * Get the socket that is connected to this socket
   * @returns connected socket or undefined
   */
  get connectedSocket() {
    return this.__connectedSocket;
  }

  /**
   * Get the uniform variable name of the connected sampler node
   */
  get variableName() {
    if (this.__connectedSocket == null) {
      return 'u_default' + this.__socketType;
    }

    const uniformInputSocket =
      this.__connectedSocket.correspondingUniformInputSocket;

    return uniformInputSocket.variableName;
  }

  /**
   * Get the precision of uniform variable of the connected sampler node
   */
  get precision() {
    if (this.__connectedSocket == null) {
      return undefined;
    }

    const uniformInputSocket =
      this.__connectedSocket.correspondingUniformInputSocket;

    return uniformInputSocket.precision;
  }

  /**
   * Connect this socket and a Sampler output socket
   * @param outputSocket The output socket to connect to
   */
  connectSocketWith(outputSocket: ISamplerOutputSocket) {
    if (this.socketType === outputSocket.socketType) {
      this.__connectedSocket = outputSocket;
      outputSocket._connectSocketWith(this);
    } else {
      console.error(
        'SamplerInputSocket.connectSocketWith: socketType is different'
      );
    }
  }
}
