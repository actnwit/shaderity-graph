import UniformInputSocket from '../sockets/input/UniformInputSocket';
import SamplerOutputSocket from '../sockets/output/SamplerOutputSocket';
import {SocketDirection} from '../types/CommonEnum';
import {
  SamplerInputNodeData,
  SamplerOutputSocketData,
  SocketData,
  UniformInputSocketData,
} from '../types/CommonType';
import AbstractNode from './AbstractNode';
/**
 *
 */
export default class SamplerNode extends AbstractNode {
  /**
   * Create a new node
   * @param nodeData define shader stage
   * @param socketDataArray define sockets. The order of the socketData must match the order of
   *                        the arguments of the node's shader function.
   */
  constructor(nodeData: SamplerInputNodeData, socketDataArray: SocketData[]) {
    super(nodeData, socketDataArray);
  }

  /**
   * Get the name of the function that corresponds to entry point of this node in the shader
   */
  get className(): 'SamplerNode' {
    return 'SamplerNode';
  }

  /**
   * @protected
   * attach sockets to this node
   */
  protected __addSockets(socketDataArray: SocketData[]): void {
    if (!this.__isValidSocketDataArray(socketDataArray)) {
      console.error(
        'SamplerNode.__addSockets: SamplerNode has only one UniformInputSocket and only one SamplerOutputSocket.'
      );
      return;
    }

    const uSocketData =
      socketDataArray[0].direction === SocketDirection.Input
        ? (socketDataArray[0] as UniformInputSocketData)
        : (socketDataArray[1] as UniformInputSocketData);

    const uniformInputSocket = new UniformInputSocket(
      this,
      uSocketData.socketName,
      uSocketData.uniformData
    );

    for (let i = 0; i < socketDataArray.length; i++) {
      const socketData = socketDataArray[i];
      if (socketData.direction === SocketDirection.Input) {
        this.__addSocket(uniformInputSocket);
      } else {
        const sSocketData = socketData as SamplerOutputSocketData;
        const socket = new SamplerOutputSocket(
          this,
          sSocketData.socketName,
          sSocketData.samplerType,
          uniformInputSocket
        );
        this.__addSocket(socket);
      }
    }
  }

  /**
   * @private
   * Verify that socketDataArray matches the specifications of socket in this node
   */
  private __isValidSocketDataArray(socketDataArray: SocketData[]): boolean {
    if (
      socketDataArray.length !== 2 ||
      socketDataArray[0].direction === socketDataArray[1].direction
    ) {
      return false;
    }

    for (const socketData of socketDataArray) {
      if (socketData.direction === SocketDirection.Input) {
        const uSocketData = socketData as UniformInputSocketData;
        if (uSocketData.uniformData == null) {
          return false;
        }
      } else {
        const sSocketData = socketData as SamplerOutputSocketData;
        if (sSocketData.samplerType == null) {
          return false;
        }
      }
    }

    return true;
  }
}
