import {INode} from '../../node/INode';
import {SamplerTypeEnum, SocketTypeEnum} from '../../types/CommonEnum';
import AbstractSocket from '../abstract/AbstractSocket';
import {ISamplerOutputSocket} from '../interface/output/ISamplerOutputSocket';
import {ISamplerInputSocket} from '../interface/input/ISamplerInputSocket';
import {IUniformInputSocket} from '../interface/input/IUniformInputSocket';

/**
 * The SamplerOutputSocket is an output socket that can connect to SamplerInputSockets.
 * This socket can connect to multiple SamplerInputSockets.
 */
export default class SamplerOutputSocket
  extends AbstractSocket
  implements ISamplerOutputSocket
{
  private __connectedSockets: ISamplerInputSocket[] = [];
  private __socketType: SocketTypeEnum;
  private __correspondingUniformInputSocket: IUniformInputSocket;

  constructor(
    node: INode,
    socketName: string,
    type: SamplerTypeEnum,
    correspondingUniformInputSocket: IUniformInputSocket
  ) {
    super(node, socketName);
    this.__socketType = type;
    this.__correspondingUniformInputSocket = correspondingUniformInputSocket;
  }

  /**
   * Get the class name of this socket
   */
  get className(): 'SamplerOutputSocket' {
    return 'SamplerOutputSocket';
  }

  /**
   * Get the glsl type of data to be passed between sockets
   */
  get socketType() {
    return this.__socketType;
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

  get correspondingUniformInputSocket() {
    return this.__correspondingUniformInputSocket;
  }

  /**
   * @private
   * Connect socket from this socket to a sampler input socket
   * Do not call this method except from the connectSocketWith method of the SamplerInputSocket class
   *
   * @param inputSocket The input socket to connect to
   */
  _connectSocketWith(inputSocket: ISamplerInputSocket) {
    this.__connectedSockets.push(inputSocket);
  }
}
