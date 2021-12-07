import {ShaderStage, SocketDirection} from '../types/CommonEnum';
import {
  NodeData,
  StandardInputSocketData,
  StandardOutputSocketData,
  UniformInputSocketData,
  VaryingInputSocketData,
  AttributeInputSocketData,
  VaryingOutputSocketData,
  InputSocketData,
  OutputSocketData,
  SocketData,
} from '../types/CommonType';
import ShaderFunctionDataRepository from './ShaderFunctionDataRepository';
import AbstractNode from './AbstractNode';
import VaryingOutputSocket from '../sockets/output/VaryingOutputSocket';
import StandardOutputSocket from '../sockets/output/StandardOutputSocket';
import ShaderOutputSocket from '../sockets/output/ShaderOutputSocket';
import AttributeInputSocket from '../sockets/input/AttributeInputSocket';
import VaryingInputSocket from '../sockets/input/VaryingInputSocket';
import UniformInputSocket from '../sockets/input/UniformInputSocket';
import StandardInputSocket from '../sockets/input/StandardInputSocket';

/**
 * A node is an object that contains functions to be used in the shader.
 * Each node has its sockets for input and output.
 * The sockets corresponds to a function argument of a node.
 *
 * The node graph which is the collection of connected nodes is transformed into a shader by
 * calling the node functions sequentially. Nodes are connected to each other via standard
 * sockets, and data can be passed between them.
 *
 * Note: Data of attribute/varying/uniform variable must be passed to a node through a
 *       non-standard socket such as AttributeInputSocket/VaryingInputSocket/UniformInputSocket.
 *       Do not write these variables directly into the function of each node.
 *       They must be specified in the function arguments.
 */
export default class ShaderityNode extends AbstractNode {
  private __shaderFunctionName: string;
  private __shaderFunctionDataKey: string;

  /**
   * Create a new node
   * @param nodeData define shader function name and shader stage
   * @param socketDataArray define sockets. The order of the socketData must match the order of
   *                        the arguments of the node's shader function.
   */
  constructor(nodeData: NodeData, socketDataArray: SocketData[]) {
    super(nodeData, socketDataArray);
    this.__shaderFunctionName = nodeData.shaderFunctionName;
    this.__shaderFunctionDataKey = nodeData.shaderFunctionDataKey;

    const existShaderFunctionData =
      ShaderFunctionDataRepository.existShaderFunctionData(
        this.__shaderFunctionDataKey
      );
    if (!existShaderFunctionData) {
      console.warn(
        `Node: key ${this.__shaderFunctionDataKey} is not found in ShaderFunctionDataRepository`
      );
    }
  }

  // /**
  //  * Get all created nodes
  //  */
  static get allNodes(): ShaderityNode[] {
    // TODO: extract shaderity nodes
    return AbstractNode.allNodes as ShaderityNode[];
  }

  // /**
  //  * Get all created vertex nodes
  //  */
  static get vertexNodes(): ShaderityNode[] {
    // TODO: extract shaderity nodes
    return AbstractNode.vertexNodes as ShaderityNode[];
  }

  // /**
  //  * Get all created fragment nodes
  //  */
  static get fragmentNodes(): ShaderityNode[] {
    // TODO: extract shaderity nodes
    return AbstractNode.fragmentNodes as ShaderityNode[];
  }
  /**
   * Get the name of the function that corresponds to entry point of this node in the shader
   */
  get className(): 'ShaderityNode' {
    return 'ShaderityNode';
  }

  /**
   * Set the name of the function that corresponds to the entry point of this node in the shader
   */
  set functionName(name: string) {
    this.__shaderFunctionName = name;
  }

  /**
   * Get the name of the function that corresponds to entry point of this node in the shader
   */
  get functionName() {
    return this.__shaderFunctionName;
  }

  /**
   * Get the corresponding function of this node from ShaderFunctionDataRepository
   */
  get shaderCode() {
    const shaderCode =
      ShaderFunctionDataRepository.getShaderFunctionData(
        this.__shaderFunctionDataKey
      )?.code ??
      `// key ${this.__shaderFunctionDataKey} is not found in ShaderFunctionDataRepository`;

    return shaderCode;
  }

  /**
   * @private
   * Get shaderFunctionDataKey
   */
  get _shaderFunctionDataKey() {
    return this.__shaderFunctionDataKey;
  }

  /**
   * @private
   * Get the webgl extension used by the functions of this node
   */
  get _extensions() {
    const extensions =
      ShaderFunctionDataRepository.getShaderFunctionData(
        this.__shaderFunctionDataKey
      )?.extensions ?? [];

    return extensions;
  }

  protected __addSockets(socketDataArray: SocketData[]): void {
    for (let i = 0; i < socketDataArray.length; i++) {
      const socketData = socketDataArray[i];
      if (socketData.direction === SocketDirection.Input) {
        this.__addInputSocket(socketData);
      } else {
        this.__addOutputSocket(socketData);
      }
    }
  }

  /**
   * @private
   * Add input socket of this node to connect another node
   */
  private __addInputSocket(socketData: InputSocketData) {
    const socketName = socketData.socketName;

    const duplicateInputSocket =
      this.__checkDuplicationOfInputSocket(socketName);

    if (duplicateInputSocket) {
      console.error(
        `Node.__checkDuplicationOfInputSocket: duplicate socketName ${socketName}`
      );
      return;
    }

    let inputSocket;
    if ((socketData as AttributeInputSocketData).attributeData != null) {
      const aSocketData = socketData as AttributeInputSocketData;
      inputSocket = new AttributeInputSocket(
        this,
        socketName,
        aSocketData.attributeData
      );
    } else if ((socketData as VaryingInputSocketData).varyingData != null) {
      const vSocketData = socketData as VaryingInputSocketData;
      inputSocket = new VaryingInputSocket(
        this,
        socketName,
        vSocketData.varyingData
      );
    } else if ((socketData as UniformInputSocketData).uniformData != null) {
      const uSocketData = socketData as UniformInputSocketData;
      inputSocket = new UniformInputSocket(
        this,
        socketName,
        uSocketData.uniformData
      );
    } else if ((socketData as StandardInputSocketData).shaderData != null) {
      const sSocketData = socketData as StandardInputSocketData;
      inputSocket = new StandardInputSocket(
        this,
        socketName,
        sSocketData.shaderData
      );
    } else {
      console.error(
        `ShaderityNode.__addInputSocket: ${socketName} is invalid socket for the ShaderityNode`
      );
      return;
    }

    this.__addSocket(inputSocket);
  }

  /**
   * @private
   * Check for duplicate socket names in the input sockets.
   */
  private __checkDuplicationOfInputSocket(socketName: string) {
    return this._sockets.some(
      socket => socket.isInputSocket() && socket.socketName === socketName
    );
  }

  /**
   * @private
   * Add output socket of this node to connect another node
   */

  private __addOutputSocket(socketData: OutputSocketData) {
    const socketName = socketData.socketName;

    const duplicateOutputSocket =
      this.__checkDuplicationOfOutputSocket(socketName);

    if (duplicateOutputSocket) {
      console.error(
        `Node.__checkDuplicationOfOutputSocket: duplicate socketName ${socketName}`
      );
      return;
    }

    let outputSocket;
    if ((socketData as VaryingOutputSocketData).varyingData != null) {
      const vSocketData = socketData as VaryingOutputSocketData;
      outputSocket = new VaryingOutputSocket(
        this,
        socketName,
        vSocketData.varyingData
      );
    } else if ((socketData as StandardOutputSocketData).shaderData != null) {
      const sSocketData = socketData as StandardOutputSocketData;
      outputSocket = new StandardOutputSocket(
        this,
        socketName,
        sSocketData.shaderData
      );
    } else {
      this.__checkUniquenessOfShaderOutputSocket();
      outputSocket = new ShaderOutputSocket(this, socketName);
    }

    this.__addSocket(outputSocket);
  }

  /**
   * @private
   * Check for duplicate socket names in the output sockets.
   */
  private __checkDuplicationOfOutputSocket(socketName: string) {
    return this._sockets.some(
      socket => !socket.isInputSocket() && socket.socketName === socketName
    );
  }

  /**
   * @private
   * Display an error message if there are two or more ShaderOutputSockets in the same shader stage.
   */
  private __checkUniquenessOfShaderOutputSocket() {
    if (this.shaderStage === ShaderStage.Vertex) {
      if (AbstractNode.__existVertexShaderOutputSocket) {
        console.error(
          'Node.__addOutputSocket: ShaderOutputSocket must be one in the vertex shader'
        );
      }
      AbstractNode.__existVertexShaderOutputSocket = true;
    } else {
      if (AbstractNode.__existFragmentShaderOutputSocket) {
        console.error(
          'Node.__addOutputSocket: ShaderOutputSocket must be one in the fragment shader'
        );
      }
      AbstractNode.__existFragmentShaderOutputSocket = true;
    }
  }
}
