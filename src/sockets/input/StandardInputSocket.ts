import {SocketType} from '../../types/CommonEnum';
import {IStandardInputSocket} from '../interface/input/IStandardInputSocket';
import {IStandardOutputSocket} from '../interface/output/IStandardOutputSocket';
import {INode} from '../../node/INode';
import AbstractStandardSocket from '../abstract/AbstractStandardSocket';
import {ShaderStandardInputData} from '../../types/CommonType';

/**
 * The StandardInputSocket is an input socket that can connect to a StandardOutputSocket.
 * This socket can connect to at most one StandardOutputSocket.
 */
export default class StandardInputSocket
  extends AbstractStandardSocket
  implements IStandardInputSocket
{
  _connectedSocket: IStandardOutputSocket | undefined = undefined;

  /**
   * @private
   * If this socket does not connect with output socket,
   * the __defaultValue is used as input value.
   */
  private __defaultValue: number[];

  constructor(
    node: INode,
    socketName: string,
    shaderData: ShaderStandardInputData
  ) {
    super(shaderData.type, node, socketName);
    this.__defaultValue = this.__getDefaultValue(shaderData);
  }

  /**
   * get the defaultValue of this socket
   */
  get defaultValue() {
    return this.__defaultValue;
  }

  /**
   * Get the class name of this socket
   */
  get className(): 'StandardInputSocket' {
    return 'StandardInputSocket';
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
   * Connect this socket and a standard output socket
   * @param outputSocket The output socket to connect to
   */
  connectSocketWith(outputSocket: IStandardOutputSocket) {
    if (this.socketType === outputSocket.socketType) {
      this._connectedSocket = outputSocket;
      outputSocket._connectSocketWith(this);
    } else {
      console.error(
        'StandardInputSocket.connectSocketWith: socketType is different'
      );
    }
  }

  private __getDefaultValue(shaderData: ShaderStandardInputData) {
    const type = shaderData.type;
    const componentNumber = SocketType.getGlslComponentNumber(type);

    let defaultValue = shaderData.defaultValue;
    if (defaultValue == null) {
      defaultValue = new Array(componentNumber);
      defaultValue.fill(0);
    } else {
      if (defaultValue.length !== componentNumber) {
        console.warn(
          `StandardInputSocket.__getDefaultValue: defaultValue.length is not match to type ${type}`
        );
      }
    }

    return defaultValue;
  }
}
