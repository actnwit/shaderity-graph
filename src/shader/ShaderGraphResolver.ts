import Node from '../node/Node';
import OutputSocket from '../sockets/OutputSocket';
import {FragmentShaderGlobalData, ShaderGlobalData} from '../types/CommonType';
import glslPrecisionShaderityObject from './shaderityShaders/glslPrecision.glsl';
import prerequisitesShaderityObject from './shaderityShaders/prerequisites.glsl';
import mainPrerequisitesShaderityObject from './shaderityShaders/mainPrerequisites.glsl';
import {SocketType} from '../types/CommonEnum';
import {INode} from '../node/INode';
import Shaderity, {
  ShaderStageStr,
  ShaderityObjectCreator,
} from 'shaderity/dist/esm';
import AttributeInputNode from '../node/AttributeInputNode';
import VaryingInputNode from '../node/VaryingInputNode';
import UniformInputNode from '../node/UniformInputNode';

export default class ShaderGraphResolver {
  static createVertexShaderCode(sortedVertexNodes: Node[]): string {
    // need to get the attributeTypeNumber from shaderity?
    const attributeTypeNumber = 11;

    const shaderPrerequisites = `
#version 300 es
${glslPrecisionShaderityObject.code}
${prerequisitesShaderityObject.code}

in float a_instanceID;\n

uniform bool u_vertexAttributesExistenceArray[${attributeTypeNumber}];
shaderity: @{matricesGetters}
shaderity: @{getters}
    `;

    let shaderBody =
      ShaderGraphResolver.__constructFunctionDefinition(sortedVertexNodes);

    shaderBody +=
      ShaderGraphResolver.__constructMainFunction(sortedVertexNodes);

    const shader = shaderPrerequisites + shaderBody;
    return shader;
  }

  static createPixelShaderCode(sortedPixelNodes: Node[]): string {
    const pixelShaderPrerequisites = `
#version 300 es
${glslPrecisionShaderityObject.code}
${prerequisitesShaderityObject.code}
shaderity: @{getters}
`;

    let shaderBody =
      ShaderGraphResolver.__constructFunctionDefinition(sortedPixelNodes);

    shaderBody += ShaderGraphResolver.__constructMainFunction(sortedPixelNodes);

    const shader = pixelShaderPrerequisites + shaderBody;
    return shader;
  }

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

    const nodeNames: string[] = [];
    for (let i = 0; i < sortedNodes.length; i++) {
      const node = sortedNodes[i];
      this.__addNodeDataToShaderityObjectCreator(
        shaderityObjectCreator,
        node,
        nodeNames
      );
    }

    const mainFunction = this.__createMainFunctionCode(sortedNodes);
    shaderityObjectCreator.updateMainFunction(mainFunction);

    const shaderityObject = shaderityObjectCreator.createShaderityObject();
    console.log(sortedNodes);
    console.log(shaderityObject.code);
    return shaderityObject.code;
  }

  private static __constructFunctionDefinition(shaderNodes: Node[]) {
    let shaderText = '';
    const existVertexFunctions: string[] = [];
    for (let i = 0; i < shaderNodes.length; i++) {
      const node = shaderNodes[i];
      if (existVertexFunctions.indexOf(node.functionName) !== -1) {
        continue;
      }
      shaderText += node.shaderCode;
      existVertexFunctions.push(node.functionName);
    }

    return shaderText;
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
    nodeNames: string[]
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

    const existSameNameNode = nodeNames.includes(node.functionName);
    if (!existSameNameNode) {
      nodeNames.push(node.functionName);
      shaderityObjectCreator.addFunctionDefinition(node.shaderCode);
    }
  }

  private static __createMainFunctionCode(sortedNodes: Node[]) {
    // usage: variableNames[node.id][socket.argumentId] = variableName;
    const variableNames: Array<Array<string>> =
      this.__initializeVariableNames(sortedNodes);

    let variableDeclarations = '';
    for (let i = 0; i < sortedNodes.length; i++) {
      const node = sortedNodes[i];
      variableDeclarations += this.__createOutVariableDeclarations(
        node,
        variableNames
      );
    }

    const mainFunctionCode = `void main() {
${variableDeclarations}
}`;

    console.log(mainFunctionCode);
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

  private static __constructMainFunction(nodes: Node[]) {
    let shaderBody = `
void main() {
`;
    shaderBody += mainPrerequisitesShaderityObject.code + '\n';

    // TODO: refactor of the following codes
    const inputVarNames: Array<Array<string>> = [];
    const outputVarNames: Array<Array<string>> = [];
    const existingInputs: number[] = [];
    const existingOutputsVarName: Map<number, string> = new Map();
    const existingOutputs: number[] = [];

    // TODO: support uniform value as input
    for (let i = 1; i < nodes.length; i++) {
      addDeclareVariableToShaderBody(i);
    }

    shaderBody += '\n';

    for (let i = 0; i < nodes.length; i++) {
      addFunctionCallingToShaderBody(i);
    }

    shaderBody += `
}
      `;

    return shaderBody;

    function addDeclareVariableToShaderBody(index: number) {
      const targetNode = nodes[index];
      inputVarNames[index] = inputVarNames[index] ?? [];
      outputVarNames[index - 1] = outputVarNames[index - 1] ?? [];

      const inputSockets = targetNode._inputSockets;

      // write variable
      for (const inputSocket of inputSockets.values()) {
        const prevNode = inputSocket.connectedNode as INode;
        const outputSocketOfPrevNode =
          inputSocket.connectedSocket as OutputSocket;
        const outputSocketNameOfPrevNode = outputSocketOfPrevNode.name;

        // TODO: substitute uniform value
        let varName = `${outputSocketNameOfPrevNode}_${prevNode.id}_to_${targetNode.id}`;

        if (existingInputs.indexOf(prevNode.id) === -1) {
          const socketType = inputSocket.socketType;
          const glslTypeStr = SocketType.getGlslTypeStr(socketType);
          const rowStr = `  ${glslTypeStr} ${varName};\n`;
          shaderBody += rowStr;
        }

        const existVarName = existingOutputsVarName.get(prevNode.id);
        if (existVarName) {
          varName = existVarName;
        }
        inputVarNames[index].push(varName);
        existingInputs.push(prevNode.id);
      }

      // avoid duplication of variable
      const prevNode = nodes[index - 1];
      const outputSocketsOfPrevNode = prevNode._outputSockets;

      for (const outputSocketOfPrevNode of outputSocketsOfPrevNode) {
        const backNodeIds = outputSocketOfPrevNode.connectedNodes;
        const outputSocketName = outputSocketOfPrevNode.name;

        for (const backNodeId of backNodeIds) {
          const varName = `${outputSocketName}_${prevNode.id}_to_${backNodeId}`;

          outputVarNames[index - 1].push(varName);
          existingOutputsVarName.set(prevNode.id, varName);
          existingOutputs.push(prevNode.id);
        }
      }
    }

    function addFunctionCallingToShaderBody(index: number) {
      const node = nodes[index];
      const functionName = node.functionName;

      inputVarNames[index] = inputVarNames[index] ?? [];
      outputVarNames[index] = outputVarNames[index] ?? [];

      // do we need this check?
      if (
        node._inputSockets.length !== inputVarNames[index].length ||
        node._outputSockets.length !== outputVarNames[index].length
      ) {
        return;
      }

      let rowStr = '';

      const varNames = inputVarNames[index].concat(outputVarNames[index]);

      // Call node functions
      rowStr += `  ${functionName}(`;
      for (let j = 0; j < varNames.length; j++) {
        const varName = varNames[j];
        if (varName == null) {
          continue;
        }
        if (j !== 0) {
          rowStr += ', ';
        }
        rowStr += varNames[j];

        rowStr += ');\n';
      }

      shaderBody += rowStr;
    }
  }
}
