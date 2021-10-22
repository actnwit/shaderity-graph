import Node from '../node/Node';
import {SocketDirection, SocketType} from '../types/CommonEnum';
import {
  AttributeInputSocketData,
  StandardInputSocketData,
  StandardOutputSocketData,
  NodeData,
  UniformInputSocketData,
  VaryingInputSocketData,
} from '../types/CommonType';
import AttributeInputSocket from './input/AttributeInputSocket';
import StandardInputSocket from './input/StandardInputSocket';
import UniformInputSocket from './input/UniformInputSocket';
import VaryingInputSocket from './input/VaryingInputSocket';
import StandardOutputSocket from './output/StandardOutputSocket';
import AbstractStandardSocket from './abstract/AbstractStandardSocket';

// This is the integration test of socket with node.

// --- test for non-connecting sockets  ---------------------------------------------

const standardInputSocketData0: StandardInputSocketData = {
  name: 'inputSocket0',
  type: SocketType.Vec3,
  direction: SocketDirection.Input,
  defaultValue: [0, 0, 0],
};

const standardOutputSocketData: StandardOutputSocketData = {
  name: 'outputSocket',
  type: SocketType.Vec2,
  direction: SocketDirection.Output,
};

const attributeInputSocketData: AttributeInputSocketData = {
  name: 'attributeSocket',
  direction: SocketDirection.Input,
  attributeData: {
    variableName: 'position',
    type: 'vec4',
  },
};

const varyingInputSocketData: VaryingInputSocketData = {
  name: 'varyingSocket',
  direction: SocketDirection.Input,
  varyingData: {
    variableName: 'texcoord',
    type: 'vec2',
    precision: 'mediump',
  },
};

const uniformInputSocketData: UniformInputSocketData = {
  name: 'uniformSocket',
  direction: SocketDirection.Input,
  uniformData: {
    variableName: 'texcoord',
    type: 'float',
    precision: 'highp',
  },
};

const driverNodeData0: NodeData = {
  shaderFunctionName: 'funcA',
  shaderStage: 'vertex',
};

const sockets0 = [
  standardInputSocketData0,
  standardOutputSocketData,
  attributeInputSocketData,
  varyingInputSocketData,
  uniformInputSocketData,
];

const node0 = new Node(driverNodeData0, sockets0);
console.log('Please ignore the console.error above if the test passes.');

const socketsOfNode0 = node0._sockets;

test('node._sockets.length', () => {
  expect(socketsOfNode0.length).toStrictEqual(sockets0.length);
});

test('socket.className', () => {
  expect(socketsOfNode0[0].className).toBe('StandardInputSocket');
  expect(socketsOfNode0[1].className).toBe('StandardOutputSocket');
  expect(socketsOfNode0[2].className).toBe('AttributeInputSocket');
  expect(socketsOfNode0[3].className).toBe('VaryingInputSocket');
  expect(socketsOfNode0[4].className).toBe('UniformInputSocket');
});

test('socket.name', () => {
  expect(socketsOfNode0[0].name).toBe('inputSocket0');
  expect(socketsOfNode0[1].name).toBe('outputSocket');
  expect(socketsOfNode0[2].name).toBe('attributeSocket');
  expect(socketsOfNode0[3].name).toBe('varyingSocket');
  expect(socketsOfNode0[4].name).toBe('uniformSocket');
});

test('socket.socketType', () => {
  expect(socketsOfNode0[0].socketType).toBe('vec3');
  expect(socketsOfNode0[1].socketType).toBe('vec2');
  expect(socketsOfNode0[2].socketType).toBe('vec4');
  expect(socketsOfNode0[3].socketType).toBe('vec2');
  expect(socketsOfNode0[4].socketType).toBe('float');
});

test('socket.node', () => {
  expect(socketsOfNode0[0].node).toStrictEqual(node0);
  expect(socketsOfNode0[1].node).toStrictEqual(node0);
  expect(socketsOfNode0[2].node).toStrictEqual(node0);
  expect(socketsOfNode0[3].node).toStrictEqual(node0);
  expect(socketsOfNode0[4].node).toStrictEqual(node0);
});

test('socket.node', () => {
  expect(socketsOfNode0[0].isInputSocket()).toBe(true);
  expect(socketsOfNode0[1].isInputSocket()).toBe(false);
  expect(socketsOfNode0[2].isInputSocket()).toBe(true);
  expect(socketsOfNode0[3].isInputSocket()).toBe(true);
  expect(socketsOfNode0[4].isInputSocket()).toBe(true);
});

const standardInputSocket0 = socketsOfNode0[0] as StandardInputSocket;
test('StandardInputSocket.connectedSocket', () => {
  expect(standardInputSocket0.connectedSocket).toBe(undefined);
});

test('StandardInputSocket.connectedNode', () => {
  expect(standardInputSocket0.connectedNode).toBe(undefined);
});

test('StandardInputSocket.defaultValue', () => {
  expect(standardInputSocket0.defaultValue).toStrictEqual([0, 0, 0]);
});

const standardOutputSocket = socketsOfNode0[1] as StandardOutputSocket;
test('StandardOutputSocket.connectedNodes', () => {
  expect(standardOutputSocket.connectedNodes).toStrictEqual([]);
});

test('StandardOutputSocket.connectedSockets', () => {
  expect(standardOutputSocket.connectedSockets).toStrictEqual([]);
});

const attributeInputSocket = socketsOfNode0[2] as AttributeInputSocket;
test('attributeInputSocket.connectedSockets', () => {
  expect(attributeInputSocket.precision).toBe('highp');
});

test('attributeInputSocket.connectedSockets', () => {
  expect(attributeInputSocket.location).toBe(undefined);
});

const varyingInputSocket = socketsOfNode0[3] as VaryingInputSocket;
test('varyingInputSocket.connectedSockets', () => {
  expect(varyingInputSocket.precision).toBe('mediump');
});

test('varyingInputSocket.connectedSockets', () => {
  expect(varyingInputSocket.interpolationType).toBe(undefined);
});

const uniformInputSocket = socketsOfNode0[4] as UniformInputSocket;
test('uniformInputSocket.connectedSockets', () => {
  expect(uniformInputSocket.precision).toBe('highp');
});

// --- test for connecting sockets  -------------------------------------------------

const standardInputSocketData1: StandardInputSocketData = {
  name: 'inputSocket1',
  type: SocketType.Vec2,
  direction: SocketDirection.Input,
  defaultValue: [0, 0],
  socketConnectionData: {
    connectedSocketName: 'outputSocket',
    connectedNodeId: 0,
  },
};

const driverNodeData1: NodeData = {
  shaderFunctionName: 'funcA',
  shaderStage: 'vertex',
};

const sockets1 = [standardInputSocketData1];

const node1 = new Node(driverNodeData1, sockets1);
console.log('Please ignore the console.error above if the test passes.');

const socketsOfNode1 = node1._sockets;

const standardInputSocket1 = socketsOfNode1[0] as StandardInputSocket;
test('AbstractStandardSocket.connectSockets', () => {
  AbstractStandardSocket.connectSockets(
    standardInputSocket1,
    standardOutputSocket
  );

  expect(standardInputSocket1.connectedSocket).toStrictEqual(
    standardOutputSocket
  );
  expect(standardOutputSocket.connectedSockets).toStrictEqual([
    standardInputSocket1,
  ]);
  expect(standardInputSocket1.connectedNode).toStrictEqual(node0);
  expect(standardOutputSocket.connectedNodes).toStrictEqual([node1]);
});
