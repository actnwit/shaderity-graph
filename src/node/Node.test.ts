import {NodeData} from '../types/CommonType';
import Node from './Node';

// This is the unit test for node.
// All the node has no socket.
// Shader codes corresponding to the node are not defined.

const vertexNodeData: NodeData = {
  shaderFunctionName: 'functionA',
  shaderFunctionDataKey: 'funcA',
  shaderStage: 'vertex',
};

const fragmentNodeData: NodeData = {
  shaderFunctionName: 'functionB',
  shaderFunctionDataKey: 'funcB',
  shaderStage: 'fragment',
};

const noUseNodeData: NodeData = {
  shaderFunctionName: 'functionC',
  shaderFunctionDataKey: 'funcC',
  shaderStage: 'noUse',
};

// The following nodes cannot connect each other.
// This is because all the nodes has no sockets.
const nodeForVertexShader = new Node(vertexNodeData, []);
console.log('Please ignore the console.warn above if the test passes.');

const nodeForFragmentShader = new Node(fragmentNodeData, []);
console.log('Please ignore the console.warn above if the test passes.');

const nodeNotUseInShader = new Node(noUseNodeData, []);
console.log('Please ignore the console.warn above if the test passes.');

test('Node.allNodes', () => {
  expect(Node.allNodes).toStrictEqual([
    nodeForVertexShader,
    nodeForFragmentShader,
    nodeNotUseInShader,
  ]);
});

test('Node.vertexNodes', () => {
  expect(Node.vertexNodes).toStrictEqual([nodeForVertexShader]);
});

test('Node.fragmentNodes', () => {
  expect(Node.fragmentNodes).toStrictEqual([nodeForFragmentShader]);
});

test('Node.getNodeById', () => {
  // first registered node
  expect(Node.getNodeById(0)).toBe(nodeForVertexShader);
});

//
test('node.functionName', () => {
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

test('node.functionName', () => {
  expect(nodeForVertexShader._shaderFunctionDataKey).toBe('funcA');
  expect(nodeForFragmentShader._shaderFunctionDataKey).toBe('funcB');
  expect(nodeNotUseInShader._shaderFunctionDataKey).toBe('funcC');
});

test('node.shaderCode', () => {
  expect(nodeForVertexShader.shaderCode).toBe(
    `// key ${vertexNodeData.shaderFunctionDataKey} is not found in ShaderFunctionDataRepository`
  );
  console.log('Please ignore the console.error above if the test passes.');
});

test('node.shaderStage', () => {
  expect(nodeForVertexShader.shaderStage).toBe('vertex');
  expect(nodeForFragmentShader.shaderStage).toBe('fragment');
  expect(nodeNotUseInShader.shaderStage).toBe('noUse');
});

test('node.id', () => {
  expect(nodeForVertexShader.id).toBe(0);
});

test('node.getInputNode', () => {
  expect(nodeForVertexShader.getInputNode('test')).toBe(undefined);
  console.log('Please ignore the console.error above if the test passes.');
});

test('node.getOutputNodes', () => {
  expect(nodeForVertexShader.getOutputNodes('test')).toStrictEqual([]);
  console.log('Please ignore the console.error above if the test passes.');
});
