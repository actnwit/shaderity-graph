import {ShaderityNodeData} from '../types/CommonType';
import ShaderityNode from './ShaderityNode';

// This is the unit test for node.
// All the node has no socket.
// Shader codes corresponding to the node are not defined.

const vertexShaderityNodeData: ShaderityNodeData = {
  shaderFunctionName: 'functionA',
  shaderFunctionDataKey: 'funcA',
  shaderStage: 'vertex',
};

const fragmentShaderityNodeData: ShaderityNodeData = {
  shaderFunctionName: 'functionB',
  shaderFunctionDataKey: 'funcB',
  shaderStage: 'fragment',
};

const noUseShaderityNodeData: ShaderityNodeData = {
  shaderFunctionName: 'functionC',
  shaderFunctionDataKey: 'funcC',
  shaderStage: 'noUse',
};

// The following nodes cannot connect each other.
// This is because all the nodes has no sockets.
const nodeForVertexShader = new ShaderityNode(vertexShaderityNodeData, []);
console.log('Please ignore the console.warn above if the test passes.');

const nodeForFragmentShader = new ShaderityNode(fragmentShaderityNodeData, []);
console.log('Please ignore the console.warn above if the test passes.');

const nodeNotUseInShader = new ShaderityNode(noUseShaderityNodeData, []);
console.log('Please ignore the console.warn above if the test passes.');

test('ShaderityNode.allShaderityNodes', () => {
  expect(ShaderityNode.allShaderityNodes).toStrictEqual([
    nodeForVertexShader,
    nodeForFragmentShader,
    nodeNotUseInShader,
  ]);
});

test('ShaderityNode.vertexShaderityNodes', () => {
  expect(ShaderityNode.vertexShaderityNodes).toStrictEqual([
    nodeForVertexShader,
  ]);
});

test('ShaderityNode.fragmentShaderityNodes', () => {
  expect(ShaderityNode.fragmentShaderityNodes).toStrictEqual([
    nodeForFragmentShader,
  ]);
});

test('ShaderityNode.getNodeById', () => {
  // first registered node
  expect(ShaderityNode.getNodeById(0)).toBe(nodeForVertexShader);
});

test('shaderityNode.className', () => {
  expect(nodeForVertexShader.className).toBe('ShaderityNode');
  expect(nodeForFragmentShader.className).toBe('ShaderityNode');
  expect(nodeNotUseInShader.className).toBe('ShaderityNode');
});

test('shaderityNode.functionName', () => {
  expect(nodeForVertexShader.functionName).toBe('functionA');
  expect(nodeForFragmentShader.functionName).toBe('functionB');
  expect(nodeNotUseInShader.functionName).toBe('functionC');

  nodeForVertexShader.functionName = 'functionD';
  nodeForFragmentShader.functionName = 'functionE';
  nodeNotUseInShader.functionName = 'functionF';

  expect(nodeForVertexShader.functionName).toBe('functionD');
  expect(nodeForFragmentShader.functionName).toBe('functionE');
  expect(nodeNotUseInShader.functionName).toBe('functionF');
});

test('shaderityNode.functionName', () => {
  expect(nodeForVertexShader._shaderFunctionDataKey).toBe('funcA');
  expect(nodeForFragmentShader._shaderFunctionDataKey).toBe('funcB');
  expect(nodeNotUseInShader._shaderFunctionDataKey).toBe('funcC');
});

test('shaderityNode.shaderCode', () => {
  expect(nodeForVertexShader.shaderCode).toBe(
    `// key ${vertexShaderityNodeData.shaderFunctionDataKey} is not found in ShaderFunctionDataRepository`
  );
  console.log('Please ignore the console.error above if the test passes.');
});

test('shaderityNode.shaderStage', () => {
  expect(nodeForVertexShader.shaderStage).toBe('vertex');
  expect(nodeForFragmentShader.shaderStage).toBe('fragment');
  expect(nodeNotUseInShader.shaderStage).toBe('noUse');
});

test('shaderityNode.id', () => {
  expect(nodeForVertexShader.id).toBe(0);
});

test('shaderityNode.getInputNode', () => {
  expect(nodeForVertexShader.getInputNode('test')).toBe(undefined);
  console.log('Please ignore the console.error above if the test passes.');
});

test('shaderityNode.getOutputNodes', () => {
  expect(nodeForVertexShader.getOutputNodes('test')).toStrictEqual([]);
  console.log('Please ignore the console.error above if the test passes.');
});
