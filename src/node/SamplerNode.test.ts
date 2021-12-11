import {SamplerInputNodeData} from '../types/CommonType';
import SamplerNode from './SamplerNode';

// This is the unit test for node.
// All the node has no socket.
// Shader codes corresponding to the node are not defined.

const vertexSamplerNodeData: SamplerInputNodeData = {
  shaderStage: 'vertex',
  nodeType: 'samplerInputNode',
};

const fragmentSamplerNodeData: SamplerInputNodeData = {
  shaderStage: 'fragment',
  nodeType: 'samplerInputNode',
};

const noUseSamplerNodeData: SamplerInputNodeData = {
  shaderStage: 'noUse',
  nodeType: 'samplerInputNode',
};

// The following nodes cannot connect each other.
// This is because all the nodes has no sockets.
const nodeForVertexShader = new SamplerNode(vertexSamplerNodeData, []);
console.log('Please ignore the console.warn above if the test passes.');

const nodeForFragmentShader = new SamplerNode(fragmentSamplerNodeData, []);
console.log('Please ignore the console.warn above if the test passes.');

const nodeNotUseInShader = new SamplerNode(noUseSamplerNodeData, []);
console.log('Please ignore the console.warn above if the test passes.');

test('samplerNode.className', () => {
  expect(nodeForVertexShader.className).toBe('SamplerNode');
  expect(nodeForFragmentShader.className).toBe('SamplerNode');
  expect(nodeNotUseInShader.className).toBe('SamplerNode');
});

test('samplerNode.shaderStage', () => {
  expect(nodeForVertexShader.shaderStage).toBe('vertex');
  expect(nodeForFragmentShader.shaderStage).toBe('fragment');
  expect(nodeNotUseInShader.shaderStage).toBe('noUse');
});

test('samplerNode.id', () => {
  expect(nodeForVertexShader.id).toBe(0);
  expect(nodeForFragmentShader.id).toBe(1);
  expect(nodeNotUseInShader.id).toBe(2);
});

test('samplerNode.getInputNode', () => {
  expect(nodeForVertexShader.getInputNode('test')).toBe(undefined);
  console.log('Please ignore the console.error above if the test passes.');
});

test('samplerNode.getOutputNodes', () => {
  expect(nodeForVertexShader.getOutputNodes('test')).toStrictEqual([]);
  console.log('Please ignore the console.error above if the test passes.');
});
