import ShaderityNode from '../node/ShaderityNode';
import {ShaderGlobalData} from '../types/CommonType';
import {ShaderStage, SocketType} from '../types/CommonEnum';
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
import VaryingOutputSocket from '../sockets/output/VaryingOutputSocket';
import {ShaderityObject} from 'shaderity';
import SamplerInputSocket from '../sockets/input/SamplerInputSocket';
import AbstractNode from '../node/AbstractNode';

/**
 * This class resolves the created node graph and creates vertex and fragment shaders.
 */
export default class ShaderGraphResolver {
  /**
   * Create vertex and fragment shaderity objects from nodes
   * @param vertexShaderGlobalData Defining define directives and constant values and
   *                               specifying precision for use in vertex shader
   * @param fragmentShaderGlobalData Defining define directives and constant values and
   *                                 specifying precision for use in fragment shader
   * @returns shaderity objects of shaders
   */
  static createShaderityObjects(
    vertexShaderGlobalData?: ShaderGlobalData,
    fragmentShaderGlobalData?: ShaderGlobalData
  ) {
    const sortedVertexNode = NodeSorter.sortTopologically(
      ShaderityNode.vertexShaderityNodes
    );
    const sortedFragmentNode = NodeSorter.sortTopologically(
      ShaderityNode.fragmentShaderityNodes
    );

    const vertexShaderityObject = ShaderGraphResolver.__createShaderityObject(
      sortedVertexNode,
      'vertex',
      vertexShaderGlobalData
    );

    const fragmentShaderityObject = ShaderGraphResolver.__createShaderityObject(
      sortedFragmentNode,
      'fragment',
      fragmentShaderGlobalData
    );

    return {
      vertexShaderityObject,
      fragmentShaderityObject,
    };
  }

  /**
   * @private
   * Create vertex or fragment shaderity object from nodes
   * @param sortedNodes Topologically sorted nodes used in the shader to be created.
   * @param shaderStage Specify vertex of fragment shader
   * @param globalData Defining define directives and constant values and
   *                   specifying precision for use in the shader
   * @returns shaderity object
   */
  private static __createShaderityObject(
    sortedNodes: ShaderityNode[],
    shaderStage: ShaderStageStr,
    globalData?: ShaderGlobalData
  ): ShaderityObject {
    const shaderityObjectCreator =
      Shaderity.createShaderityObjectCreator(shaderStage);

    if (globalData != null) {
      this.__addGlobalDataToShaderityObjectCreator(
        shaderityObjectCreator,
        globalData
      );
    }

    const shaderFunctionDataKeys: string[] = [];
    for (let i = 0; i < sortedNodes.length; i++) {
      const node = sortedNodes[i];
      this.__addNodeDataToShaderityObjectCreator(
        shaderityObjectCreator,
        node,
        shaderFunctionDataKeys,
        shaderStage
      );
    }

    const mainFunction = this.__createMainFunctionCode(sortedNodes);
    shaderityObjectCreator.updateMainFunction(mainFunction);

    const shaderityObject = shaderityObjectCreator.createShaderityObject();

    return shaderityObject;
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
    globalData: ShaderGlobalData | ShaderGlobalData
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
  }

  /**
   * @private
   * Set data of a node to shaderityObjectCreator
   * This supports declaration of attribute, varying and uniform variables and
   * definition of extensions and functions in shader
   * @param shaderityObjectCreator shaderityObjectCreator object of shaderity
   * @param node target node
   * @param shaderFunctionDataKeys array to prevent duplicate function definitions in shader
   * @param shaderStage  Specify vertex of fragment shader
   */
  private static __addNodeDataToShaderityObjectCreator(
    shaderityObjectCreator: ShaderityObjectCreator,
    node: ShaderityNode,
    shaderFunctionDataKeys: string[],
    shaderStage: ShaderStageStr
  ) {
    for (const extension of node._extensions) {
      shaderityObjectCreator.addExtension(extension);
    }

    const varyingOutputSockets: VaryingOutputSocket[] = [];

    // to avoid duplication of attributes
    const attributeNames: string[] = [];

    const sockets = node._sockets;
    for (let i = 0; i < sockets.length; i++) {
      const socket = sockets[i];

      if (socket.className === 'AttributeInputSocket') {
        const aInputSocket = socket as AttributeInputSocket;
        const variableName = aInputSocket.variableName;

        if (attributeNames.some(name => name === variableName)) {
          continue;
        }

        shaderityObjectCreator.addAttributeDeclaration(
          `${variableName}`,
          aInputSocket.socketType,
          {
            precision: aInputSocket.precision,
            location: aInputSocket.location,
          }
        );
        attributeNames.push(variableName);
      } else if (
        socket.className === 'UniformInputSocket' ||
        socket.className === 'SamplerInputSocket'
      ) {
        const uInputSocket = socket as UniformInputSocket | SamplerInputSocket;

        shaderityObjectCreator.addUniformDeclaration(
          `${uInputSocket.variableName}`,
          uInputSocket.socketType,
          {
            precision: uInputSocket.precision,
          }
        );
      } else if (
        socket.className === 'VaryingInputSocket' &&
        shaderStage === 'fragment'
      ) {
        const vInputSocket = socket as VaryingInputSocket;
        const vOutputSocket = vInputSocket.connectedSocket as
          | VaryingOutputSocket
          | undefined;
        if (vOutputSocket == null) {
          console.error(
            `ShaderGraphResolver.__addNodeDataToShaderityObjectCreator: variableInputSocket ${vInputSocket.socketName} does not connected to variableOutputSocket`
          );
          continue;
        }

        const alreadyDeclared = varyingOutputSockets.some(
          elem => elem === vOutputSocket
        );

        if (alreadyDeclared) {
          continue;
        } else {
          varyingOutputSockets.push(vOutputSocket);
        }

        shaderityObjectCreator.addVaryingDeclaration(
          vOutputSocket.variableName,
          vOutputSocket.socketType,
          {
            precision: vOutputSocket.precision,
            interpolationType: vOutputSocket.interpolationType,
          }
        );
      } else if (
        socket.className === 'VaryingOutputSocket' &&
        shaderStage === 'vertex'
      ) {
        const vOutputSocket = socket as VaryingOutputSocket;

        shaderityObjectCreator.addVaryingDeclaration(
          vOutputSocket.variableName,
          vOutputSocket.socketType,
          {
            precision: vOutputSocket.precision,
            interpolationType: vOutputSocket.interpolationType,
          }
        );
      }
    }

    const existShaderFunction = shaderFunctionDataKeys.includes(
      node._shaderFunctionDataKey
    );
    if (!existShaderFunction) {
      shaderFunctionDataKeys.push(node._shaderFunctionDataKey);
      shaderityObjectCreator.addFunctionDefinition(node.shaderCode);
    }
  }

  /**
   * @private
   * Create the main function by arranging the function calls in the order of index in the array
   * @param sortedNodes topologically sorted array of nodes
   * @returns shader code of main function
   */
  private static __createMainFunctionCode(sortedNodes: ShaderityNode[]) {
    // stock variable names to be used as arguments in each node's function call
    // usage: argumentNameList[node.id][index of socket] = variableName;
    const argumentNameList: Array<Array<string>> =
      this.__initializeArgumentNameListOfFunctionsCalledInMainFunction();

    let variableDeclarations = '';
    let inputValueDefinitions = '';
    for (let i = 0; i < sortedNodes.length; i++) {
      const node = sortedNodes[i];

      // for non-connected standard input sockets
      inputValueDefinitions +=
        this.__createInputVariableDefinitionsAndStoreVariableName(
          node,
          argumentNameList
        );

      // for connected sockets
      variableDeclarations +=
        this.__createOutVariableDeclarationsAndStoreVariableName(
          node,
          argumentNameList
        );

      this.__addStorageQualifierVariableName(node, argumentNameList);
      this.__addShaderOutputVariableName(node, argumentNameList);
    }

    let functionCalls = '';
    for (let i = 0; i < sortedNodes.length; i++) {
      const node = sortedNodes[i];
      const argumentNames = argumentNameList[node.id];
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
  private static __initializeArgumentNameListOfFunctionsCalledInMainFunction() {
    const nodes = AbstractNode.allNodes;

    const argumentNameList: Array<Array<string>> = new Array(nodes.length);
    argumentNameList.fill(new Array(0));

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const argumentCountOfNodeFunction = node._sockets.length;
      argumentNameList[node.id] = new Array(argumentCountOfNodeFunction);
    }

    return argumentNameList;
  }

  /**
   * @private
   * Create a string of variable definitions corresponding to the standard input socket
   * that is not connected to the output socket.
   * The created variable is initialized with the default value of the socket.
   *
   * The names of created variables are stored in the argumentNameList at the position of the corresponding
   * input socket.
   * @param node target node
   * @param argumentNameList array to store the variable names used in each function call of the main function
   * @returns string of variable definitions
   */
  private static __createInputVariableDefinitionsAndStoreVariableName(
    node: ShaderityNode,
    argumentNameList: string[][]
  ): string {
    let returnStr = '';

    const sockets = node._sockets;
    for (let i = 0; i < sockets.length; i++) {
      const socket = sockets[i];
      if (socket.className !== 'StandardInputSocket') {
        continue;
      }

      const sInputSocket = socket as StandardInputSocket;
      if (sInputSocket.connectedSocket != null) {
        continue;
      }

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

      const variableName = `${sInputSocket.socketName}_${node.id}`;
      returnStr += `  ${glslTypeStr} ${variableName} = ${defaultValue};\n`;

      argumentNameList[node.id][i] = variableName;
    }

    return returnStr;
  }

  /**
   * @private
   * Create string of variable declarations for each output socket.
   *
   * The name of the created variable is stored in the argumentNameList at the position of the corresponding
   * output socket and the connected input sockets.
   * @param node target node
   * @param argumentNameList array to store the variable names used in each function call of the main function
   * @returns string of variable declarations
   */
  private static __createOutVariableDeclarationsAndStoreVariableName(
    node: ShaderityNode,
    argumentNameList: string[][]
  ): string {
    let returnStr = '';

    const sockets = node._sockets;
    for (let i = 0; i < sockets.length; i++) {
      const socket = sockets[i];
      if (socket.isInputSocket()) {
        continue;
      }

      if (socket.className === 'VaryingOutputSocket') {
        const vOutputSocket = socket as VaryingOutputSocket;
        argumentNameList[node.id][i] = vOutputSocket.variableName;
      } else if (socket.className === 'StandardOutputSocket') {
        const sOutputSocket = socket as StandardOutputSocket;
        const outputNodes = sOutputSocket.connectedNodes;

        let variableName = `node${node.id}_${sOutputSocket.socketName}_to`;
        for (let j = 0; j < outputNodes.length; j++) {
          const connectedNode = outputNodes[j];
          variableName += `_node${connectedNode.id}`;
        }

        argumentNameList[node.id][i] = variableName;

        const sInputSockets = sOutputSocket.connectedSockets;
        for (let j = 0; j < sInputSockets.length; j++) {
          const sInputSocket = sInputSockets[j];
          const outputNode = sInputSocket.node;
          const connectedNodeId = outputNode.id;
          const socketIndex = outputNode._sockets.indexOf(sInputSocket);

          argumentNameList[connectedNodeId][socketIndex] = variableName;
        }

        const precision =
          sOutputSocket.precision != null ? sOutputSocket.precision + ' ' : '';
        const glslTypeStr = SocketType.getGlslTypeStr(sOutputSocket.socketType);
        returnStr += `  ${precision}${glslTypeStr} ${variableName};\n`;
      } else {
        // ShaderOutputSocket
      }
    }

    // for fragment shader
    for (let i = 0; i < sockets.length; i++) {
      const socket = sockets[i];
      if (socket.className !== 'VaryingInputSocket') {
        continue;
      }

      if (argumentNameList[node.id][i] !== null) {
        continue;
      }

      const vInputSocket = socket as VaryingInputSocket;
      const vOutputSocket = vInputSocket.connectedSocket as VaryingOutputSocket;

      const vInputSockets = vOutputSocket.connectedSockets;
      for (let j = 0; j < vInputSockets.length; j++) {
        const vInputSocket = vInputSockets[j];
        const outputNode = vInputSocket.node;
        const connectedNodeId = outputNode.id;
        const socketIndex = outputNode._sockets.indexOf(vInputSocket);

        argumentNameList[connectedNodeId][socketIndex] =
          vOutputSocket.variableName;
      }
    }

    return returnStr;
  }

  /**
   * @private
   * Set the attribute/varying/uniform variable name to argumentNameList to the corresponding position in the socket
   * @param node target node
   * @param argumentNameList array to store the variable names used in each function call of the main function
   */
  private static __addStorageQualifierVariableName(
    node: ShaderityNode,
    argumentNameList: string[][]
  ): void {
    const nodeId = node.id;

    const sockets = node._sockets;
    for (let i = 0; i < sockets.length; i++) {
      const inputSocket = sockets[i];

      if (
        inputSocket.className === 'AttributeInputSocket' ||
        inputSocket.className === 'VaryingInputSocket' ||
        inputSocket.className === 'UniformInputSocket' ||
        inputSocket.className === 'SamplerInputSocket'
      ) {
        const storageQualifierInputSocket = inputSocket as
          | AttributeInputSocket
          | VaryingInputSocket
          | UniformInputSocket
          | SamplerInputSocket;
        argumentNameList[nodeId][i] = storageQualifierInputSocket.variableName;
      }
    }
  }

  private static __addShaderOutputVariableName(
    node: ShaderityNode,
    argumentNameList: string[][]
  ): void {
    const nodeId = node.id;

    const sockets = node._sockets;
    for (let i = 0; i < sockets.length; i++) {
      const inputSocket = sockets[i];
      if (inputSocket.className === 'ShaderOutputSocket') {
        if (node.shaderStage === ShaderStage.Vertex) {
          argumentNameList[nodeId][i] = 'gl_Position';
        } else {
          argumentNameList[nodeId][i] = 'renderTarget0';
        }
      }
    }
  }

  /**
   * @private
   * Create a function call string based on the argumentNameList and the functionName of target node
   * @param node target node
   * @param argumentNameList array to store the variable names used in each function call of the main function
   * @returns function call string
   */
  private static __createShaderGraphFunctionCalls(
    node: ShaderityNode,
    argumentNames: string[]
  ): string {
    let returnStr = `  ${node.functionName}(`;

    for (let i = 0; i < argumentNames.length; i++) {
      const argumentName = argumentNames[i].split('[')[0];
      returnStr += argumentName + ', ';
    }

    returnStr = returnStr.replace(/,\s$/, ');\n');
    // returnStr += ');\n';
    return returnStr;
  }
}
