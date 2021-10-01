import Node from '../node/Node';
import {FragmentShaderGlobalData, ShaderGlobalData} from '../types/CommonType';
import {SocketType} from '../types/CommonEnum';
import Shaderity, {
  ShaderStageStr,
  ShaderityObjectCreator,
} from 'shaderity/dist/esm';
import AttributeInputNode from '../node/AttributeInputNode';
import VaryingInputNode from '../node/VaryingInputNode';
import UniformInputNode from '../node/UniformInputNode';

export default class ShaderGraphResolver {
  static createShaderCode(
    sortedNodes: Node[],
    shaderStage: ShaderStageStr,
    globalData?: ShaderGlobalData
  ): string {
    const shaderityObjectCreator =
      Shaderity.createShaderityObjectCreator(shaderStage);

    if (globalData != null) {
      this.__addGlobalDataToShaderityObjectCreator(
        shaderityObjectCreator,
        globalData
      );
    }

    const definedShaderFunctionDataId: number[] = [];
    for (let i = 0; i < sortedNodes.length; i++) {
      const node = sortedNodes[i];
      this.__addNodeDataToShaderityObjectCreator(
        shaderityObjectCreator,
        node,
        definedShaderFunctionDataId
      );
    }

    const mainFunction = this.__createMainFunctionCode(sortedNodes);
    shaderityObjectCreator.updateMainFunction(mainFunction);

    const shaderityObject = shaderityObjectCreator.createShaderityObject();

    return shaderityObject.code;
  }

  private static __addGlobalDataToShaderityObjectCreator(
    shaderityObjectCreator: ShaderityObjectCreator,
    globalData: ShaderGlobalData
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

    if ((globalData as FragmentShaderGlobalData).outputVariableName != null) {
      shaderityObjectCreator.updateOutputColorVariableName(
        (globalData as FragmentShaderGlobalData).outputVariableName
      );
    }
  }

  private static __addNodeDataToShaderityObjectCreator(
    shaderityObjectCreator: ShaderityObjectCreator,
    node: Node,
    definedShaderFunctionDataId: number[]
  ) {
    for (const extension of node.extensions) {
      shaderityObjectCreator.addExtension(extension);
    }

    if (node.className === 'AttributeInputNode') {
      const attributeInputNode = node as AttributeInputNode;
      shaderityObjectCreator.addAttributeDeclaration(
        `${attributeInputNode.variableName}_${attributeInputNode.id}`,
        attributeInputNode.type,
        {
          precision: attributeInputNode.precision,
          location: attributeInputNode.location,
        }
      );
    }

    if (node.className === 'VaryingInputNode') {
      const varyingInputNode = node as VaryingInputNode;
      shaderityObjectCreator.addVaryingDeclaration(
        `${varyingInputNode.variableName}_${varyingInputNode.id}`,
        varyingInputNode.type,
        {
          precision: varyingInputNode.precision,
          interpolationType: varyingInputNode.interpolationType,
        }
      );
    }

    if (node.className === 'UniformInputNode') {
      const uniformInputNode = node as UniformInputNode;
      shaderityObjectCreator.addUniformDeclaration(
        `${uniformInputNode.variableName}_${uniformInputNode.id}`,
        uniformInputNode.type,
        {
          precision: uniformInputNode.precision,
        }
      );
    }

    const existFunctionDefinition = definedShaderFunctionDataId.includes(
      node._shaderFunctionDataId
    );
    if (!existFunctionDefinition) {
      definedShaderFunctionDataId.push(node._shaderFunctionDataId);
      shaderityObjectCreator.addFunctionDefinition(node.shaderCode);
    }
  }

  private static __createMainFunctionCode(sortedNodes: Node[]) {
    // usage: variableNames[node.id][socket.argumentId] = variableName;
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

  private static __initializeVariableNames(nodes: Node[]) {
    const variableNames: Array<Array<string>> = new Array(nodes.length);
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      const storageQualifierInputCount = node.className === 'Node' ? 0 : 1;
      const argumentCount =
        node._inputSockets.length +
        node._outputSockets.length +
        storageQualifierInputCount;

      variableNames[node.id] = new Array(argumentCount);
    }

    return variableNames;
  }

  private static __createInputVariableDefinitions(
    node: Node,
    variableNames: string[][]
  ): string {
    let returnStr = '';
    for (const inputSocket of node._inputSockets) {
      if (inputSocket.connectedSocket != null) {
        continue;
      }

      const socketType = inputSocket.socketType;
      const glslComponentNumber = SocketType.getGlslComponentNumber(socketType);

      if (glslComponentNumber === 0) {
        const message = `ShaderGraphResolver.__getInputVariableDefinitions: ${socketType} type cannot take default value`;
        console.error(message);

        return `  // ${message}\n`;
      } else if (inputSocket.defaultValue.length !== glslComponentNumber) {
        console.warn(
          'ShaderGraphResolver.__getInputVariableDefinitions: defaultValue.length is invalid'
        );
      }

      const glslTypeStr = SocketType.getGlslTypeStr(socketType);

      let defaultValue = glslTypeStr + '(';
      for (let i = 0; i < glslComponentNumber; i++) {
        defaultValue += inputSocket.defaultValue[i] + ', ';
      }
      defaultValue = defaultValue.replace(/,\s$/, ')');

      const variableName = `${inputSocket.name}_${node.id}`;
      returnStr += `  ${glslTypeStr} ${variableName} = ${defaultValue};\n`;

      variableNames[node.id][inputSocket.argumentId] = variableName;
    }

    return returnStr;
  }

  private static __createOutVariableDeclarations(
    node: Node,
    variableNames: string[][]
  ): string {
    let returnStr = '';
    for (const outputSocket of node._outputSockets) {
      const connectedNodes = outputSocket.connectedNodes;
      const connectedSockets = outputSocket.connectedSockets;

      let variableName = `node${node.id}_${outputSocket.name}_to`;
      for (let i = 0; i < connectedNodes.length; i++) {
        const connectedNode = connectedNodes[i];
        variableName += `_node${connectedNode.id}`;

        // for debugging
        // const connectedSocketName = connectedSockets[i].name;
        // returnStr += `_node${connectedNode.id}_${connectedSocketName}`;
      }

      const glslTypeStr = SocketType.getGlslTypeStr(outputSocket.socketType);
      returnStr += `  ${glslTypeStr} ${variableName};\n`;

      variableNames[node.id][outputSocket.argumentId] = variableName;
      for (let i = 0; i < connectedNodes.length; i++) {
        const connectedNodeId = connectedNodes[i].id;
        const connectedSocket = connectedSockets[i];

        variableNames[connectedNodeId][connectedSocket.argumentId] =
          variableName;
      }
    }

    return returnStr;
  }

  private static __addStorageQualifierVariableName(
    node: Node,
    variableNames: string[][]
  ): void {
    const nodeId = node.id;

    if (node.className === 'AttributeInputNode') {
      const attributeInputNode = node as AttributeInputNode;
      variableNames[nodeId][0] = `${attributeInputNode.variableName}_${nodeId}`;
    } else if (node.className === 'VaryingInputNode') {
      const varyingInputNode = node as VaryingInputNode;
      variableNames[nodeId][0] = `${varyingInputNode.variableName}_${nodeId}`;
    } else if (node.className === 'UniformInputNode') {
      const uniformInputNode = node as UniformInputNode;
      variableNames[nodeId][0] = `${uniformInputNode.variableName}_${nodeId}`;
    }
  }

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
