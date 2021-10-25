import Node from '../node/Node';
import {
  VertexShaderGlobalData,
  FragmentShaderGlobalData,
} from '../types/CommonType';
import {SocketType} from '../types/CommonEnum';
import Shaderity, {
  ShaderStageStr,
  ShaderityObjectCreator,
} from 'shaderity/dist/esm';
import StandardInputSocket from '../sockets/input/StandardInputSocket';
import AttributeInputSocket from '../sockets/input/AttributeInputSocket';
import UniformInputSocket from '../sockets/input/UniformInputSocket';
import VaryingInputSocket from '../sockets/input/VaryingInputSocket';
import StandardOutputSocket from '../sockets/output/StandardOutputSocket';
import NodeSorter from './NodeSorter';

/**
 * This class resolves the created node graph and creates vertex and fragment shaders.
 */
export default class ShaderGraphResolver {
  /**
   * Create vertex and fragment shaders from nodes
   * @param vertexShaderGlobalData Defining define directives and constant values and
   *                               specifying precision for use in vertex shader
   * @param fragmentShaderGlobalData Defining define directives and constant values and
   *                                 specifying precision for use in fragment shader
   * @returns shader codes of vertex and fragment shader
   */
  static createShaderCodes(
    vertexShaderGlobalData?: VertexShaderGlobalData,
    fragmentShaderGlobalData?: FragmentShaderGlobalData
  ) {
    const sortedVertexNode = NodeSorter.sortTopologically(Node.vertexNodes);
    const sortedFragmentNode = NodeSorter.sortTopologically(Node.fragmentNodes);

    const vertexShaderCode = ShaderGraphResolver.__createShaderCode(
      sortedVertexNode,
      'vertex',
      vertexShaderGlobalData
    );

    const fragmentShaderCode = ShaderGraphResolver.__createShaderCode(
      sortedFragmentNode,
      'fragment',
      fragmentShaderGlobalData
    );

    return {
      vertexShader: vertexShaderCode,
      fragmentShader: fragmentShaderCode,
    };
  }

  /**
   * @private
   * Create vertex or fragment shader from nodes
   * @param sortedNodes Topologically sorted nodes used in the shader to be created.
   * @param shaderStage Specify vertex of fragment shader
   * @param globalData Defining define directives and constant values and
   *                   specifying precision for use in the shader
   */
  private static __createShaderCode(
    sortedNodes: Node[],
    shaderStage: ShaderStageStr,
    globalData?: VertexShaderGlobalData
  ): string {
    const shaderityObjectCreator =
      Shaderity.createShaderityObjectCreator(shaderStage);

    if (globalData != null) {
      this.__addGlobalDataToShaderityObjectCreator(
        shaderityObjectCreator,
        globalData
      );
    }

    const functionNames: string[] = [];
    for (let i = 0; i < sortedNodes.length; i++) {
      const node = sortedNodes[i];
      this.__addNodeDataToShaderityObjectCreator(
        shaderityObjectCreator,
        node,
        functionNames
      );
    }

    const mainFunction = this.__createMainFunctionCode(sortedNodes);
    shaderityObjectCreator.updateMainFunction(mainFunction);

    const shaderityObject = shaderityObjectCreator.createShaderityObject();

    return shaderityObject.code;
  }

  /**
   * @private
   * Set globalData to shaderityObjectCreator
   * @param shaderityObjectCreator shaderityObjectCreator object of shaderity
   * @param globalData Defining define directives and constant values and
   *                   specifying precision for use in the shader
   */
  private static __addGlobalDataToShaderityObjectCreator(
    shaderityObjectCreator: ShaderityObjectCreator,
    globalData: VertexShaderGlobalData | FragmentShaderGlobalData
  ) {
    if (globalData.defineDirectives != null) {
      for (let i = 0; i < globalData.defineDirectives.length; i++) {
        const defineDirective = globalData.defineDirectives[i];
        shaderityObjectCreator.addDefineDirective(defineDirective);
      }
    }

    if (globalData.precision) {
      shaderityObjectCreator.updateGlobalPrecision(globalData.precision);
    }

    if (globalData.constantValues != null) {
      for (let i = 0; i < globalData.constantValues.length; i++) {
        const shaderConstantValueObject = globalData.constantValues[i];
        shaderityObjectCreator.addGlobalConstantValue(
          shaderConstantValueObject.variableName,
          shaderConstantValueObject.type,
          shaderConstantValueObject.values
        );
      }
    }

    const outputVariableName = (globalData as FragmentShaderGlobalData)
      .outputVariableName;
    if (outputVariableName != null) {
      shaderityObjectCreator.updateOutputColorVariableName(outputVariableName);
    }
  }

  /**
   * @private
   * Set data of a node to shaderityObjectCreator
   * @param shaderityObjectCreator shaderityObjectCreator object of shaderity
   * @param node target node
   * @param functionNames array to prevent duplicate function definitions in shader
   */
  private static __addNodeDataToShaderityObjectCreator(
    shaderityObjectCreator: ShaderityObjectCreator,
    node: Node,
    functionNames: string[]
  ) {
    for (const extension of node._extensions) {
      shaderityObjectCreator.addExtension(extension);
    }

    const sockets = node._sockets;
    for (let i = 0; i < sockets.length; i++) {
      const socket = sockets[i];

      if (socket.className === 'AttributeInputSocket') {
        const aInputSocket = socket as AttributeInputSocket;

        shaderityObjectCreator.addAttributeDeclaration(
          `${aInputSocket.variableName}_${node.id}`,
          aInputSocket.socketType,
          {
            precision: aInputSocket.precision,
            location: aInputSocket.location,
          }
        );
      } else if (socket.className === 'VaryingInputSocket') {
        const vInputSocket = socket as VaryingInputSocket;

        shaderityObjectCreator.addVaryingDeclaration(
          `${vInputSocket.variableName}_${node.id}`,
          vInputSocket.socketType,
          {
            precision: vInputSocket.precision,
            interpolationType: vInputSocket.interpolationType,
          }
        );
      } else if (socket.className === 'UniformInputSocket') {
        const uInputSocket = socket as UniformInputSocket;

        shaderityObjectCreator.addUniformDeclaration(
          `${uInputSocket.variableName}_${node.id}`,
          uInputSocket.socketType,
          {
            precision: uInputSocket.precision,
          }
        );
      }
    }

    const existSameNameNode = functionNames.includes(node.functionName);
    if (!existSameNameNode) {
      functionNames.push(node.functionName);
      shaderityObjectCreator.addFunctionDefinition(node.shaderCode);
    }
  }

  /**
   * @private
   * Create the main function by arranging the function calls in the order of index in the array
   * @param sortedNodes topologically sorted array of nodes
   * @returns shader code of main function
   */
  private static __createMainFunctionCode(sortedNodes: Node[]) {
    // usage: variableNames[node.id][index of socket] = variableName;
    const variableNames: Array<Array<string>> =
      this.__initializeVariableNames(sortedNodes);

    let variableDeclarations = '';
    let inputValueDefinitions = '';
    for (let i = 0; i < sortedNodes.length; i++) {
      const node = sortedNodes[i];

      // for non-connected input sockets
      inputValueDefinitions += this.__createInputVariableDefinitions(
        node,
        variableNames
      );

      // for connected sockets
      variableDeclarations += this.__createOutVariableDeclarations(
        node,
        variableNames
      );

      this.__addStorageQualifierVariableName(node, variableNames);
    }

    let functionCalls = '';
    for (let i = 0; i < sortedNodes.length; i++) {
      const node = sortedNodes[i];
      const argumentNames = variableNames[node.id];
      functionCalls += this.__createShaderGraphFunctionCalls(
        node,
        argumentNames
      );
    }

    const mainFunctionCode = `void main() {
${inputValueDefinitions}
${variableDeclarations}
${functionCalls}
}`;

    return mainFunctionCode;
  }

  /**
   * @private
   * Initialize an array to store the variable names to be used in each function call of the main function
   * @param nodes array of nodes
   * @returns array to store the variable names
   */
  private static __initializeVariableNames(nodes: Node[]) {
    const variableNames: Array<Array<string>> = new Array(Node.allNodes.length);
    variableNames.fill(new Array(0));

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const argumentCountOfNodeFunction = node._sockets.length;
      variableNames[node.id] = new Array(argumentCountOfNodeFunction);
    }

    return variableNames;
  }

  /**
   * @private
   * Create a string of variable definitions corresponding to the standard input socket
   * that is not connected to the output socket.
   * The created variable is initialized with the default value of the socket.
   *
   * The names of created variables are stored in the variableNames at the position of the corresponding
   * input socket.
   * @param node target node
   * @param variableNames array to store the variable names used in each function call of the main function
   * @returns string of variable definitions
   */
  private static __createInputVariableDefinitions(
    node: Node,
    variableNames: string[][]
  ): string {
    let returnStr = '';

    const sockets = node._sockets;
    for (let i = 0; i < sockets.length; i++) {
      const socket = sockets[i];
      if (socket.className !== 'StandardInputSocket') {
        continue;
      }
      const sInputSocket = socket as StandardInputSocket;

      const socketType = sInputSocket.socketType;
      const glslComponentNumber = SocketType.getGlslComponentNumber(socketType);

      if (glslComponentNumber === 0) {
        const message = `ShaderGraphResolver.__getInputVariableDefinitions: ${socketType} type cannot take default value`;
        console.error(message);

        return `  // ${message}\n`;
      } else if (sInputSocket.defaultValue.length !== glslComponentNumber) {
        console.warn(
          'ShaderGraphResolver.__getInputVariableDefinitions: defaultValue.length is invalid'
        );
      }

      const glslTypeStr = SocketType.getGlslTypeStr(socketType);

      let defaultValue = glslTypeStr + '(';
      for (let j = 0; j < glslComponentNumber; j++) {
        defaultValue += sInputSocket.defaultValue[j] + ', ';
      }
      defaultValue = defaultValue.replace(/,\s$/, ')');

      const variableName = `${sInputSocket.name}_${node.id}`;
      returnStr += `  ${glslTypeStr} ${variableName} = ${defaultValue};\n`;

      variableNames[node.id][i] = variableName;
    }

    return returnStr;
  }

  /**
   * @private
   * Create string of variable declarations for each output socket.
   *
   * The name of the created variable is stored in the variableNames at the position of the corresponding
   * output socket and the connected input sockets.
   * @param node target node
   * @param variableNames array to store the variable names used in each function call of the main function
   * @returns string of variable declarations
   */
  private static __createOutVariableDeclarations(
    node: Node,
    variableNames: string[][]
  ): string {
    let returnStr = '';

    const sockets = node._sockets;
    for (let i = 0; i < sockets.length; i++) {
      const socket = sockets[i];
      if (socket.isInputSocket()) {
        continue;
      }

      const outputSocket = socket as StandardOutputSocket;
      const outputNodes = outputSocket.connectedNodes;

      // for debugging
      // const inputSockets = outputSocket.connectedSockets;

      let variableName = `node${node.id}_${outputSocket.name}_to`;
      for (let j = 0; j < outputNodes.length; j++) {
        const connectedNode = outputNodes[j];
        variableName += `_node${connectedNode.id}`;

        // for debugging
        // const inputSocketName = inputSockets[j].name;
        // returnStr += `_node${connectedNode.id}_${inputSocketName}`;
      }

      const glslTypeStr = SocketType.getGlslTypeStr(outputSocket.socketType);
      returnStr += `  ${glslTypeStr} ${variableName};\n`;

      // set variable name corresponding to output socket
      variableNames[node.id][i] = variableName;

      // set variable name corresponding to input sockets
      const sInputSockets = outputSocket.connectedSockets;
      for (let j = 0; j < sInputSockets.length; j++) {
        const sInputSocket = sInputSockets[j];
        const outputNode = sInputSocket.node;
        const connectedNodeId = outputNode.id;
        const socketIndex = outputNode._sockets.indexOf(sInputSocket);

        variableNames[connectedNodeId][socketIndex] = variableName;
      }
    }

    return returnStr;
  }

  /**
   * @private
   * Set the attribute/varying/uniform variable name to variableNames to the corresponding position in the socket
   * @param node target node
   * @param variableNames array to store the variable names used in each function call of the main function
   */
  private static __addStorageQualifierVariableName(
    node: Node,
    variableNames: string[][]
  ): void {
    const nodeId = node.id;

    const sockets = node._sockets;
    for (let i = 0; i < sockets.length; i++) {
      const inputSocket = sockets[i];

      if (inputSocket.className === 'AttributeInputSocket') {
        const aInputSocket = inputSocket as AttributeInputSocket;
        const variableName = aInputSocket.variableName;

        variableNames[nodeId][i] = `${variableName}_${nodeId}`;
      } else if (inputSocket.className === 'VaryingInputSocket') {
        const vInputSocket = inputSocket as VaryingInputSocket;
        const variableName = vInputSocket.variableName;

        variableNames[nodeId][i] = `${variableName}_${nodeId}`;
      } else if (inputSocket.className === 'UniformInputSocket') {
        const uInputSocket = inputSocket as UniformInputSocket;
        const variableName = uInputSocket.variableName;

        variableNames[nodeId][i] = `${variableName}_${nodeId}`;
      }
    }
  }

  /**
   * @private
   * Create a function call string based on the variableNames and the functionName of target node
   * @param node target node
   * @param variableNames array to store the variable names used in each function call of the main function
   * @returns function call string
   */
  private static __createShaderGraphFunctionCalls(
    node: Node,
    argumentNames: string[]
  ): string {
    let returnStr = `  ${node.functionName}(`;

    for (let i = 0; i < argumentNames.length; i++) {
      const argumentName = argumentNames[i];
      returnStr += argumentName + ', ';
    }

    returnStr = returnStr.replace(/,\s$/, ');\n');
    // returnStr += ');\n';
    return returnStr;
  }
}
