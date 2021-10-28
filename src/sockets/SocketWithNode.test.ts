import Node from '../node/Node';
import {SocketDirection, SocketType} from '../types/CommonEnum';
import {
  AttributeInputSocketData,
  StandardInputSocketData,
  StandardOutputSocketData,
  NodeData,
  UniformInputSocketData,
  VaryingInputSocketData,
  VaryingOutputSocketData,
} from '../types/CommonType';
import AttributeInputSocket from './input/AttributeInputSocket';
import StandardInputSocket from './input/StandardInputSocket';
import UniformInputSocket from './input/UniformInputSocket';
import VaryingInputSocket from './input/VaryingInputSocket';
import StandardOutputSocket from './output/StandardOutputSocket';
import AbstractStandardSocket from './abstract/AbstractStandardSocket';
import VaryingOutputSocket from './output/VaryingOutputSocket';
import AbstractVaryingSocket from './abstract/AbstractVaryingSocket';

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
    variableName: 'a_position',
    type: 'vec4',
  },
};

const varyingInputSocketData0: VaryingInputSocketData = {
  name: 'varyingInputSocket0',
  direction: SocketDirection.Input,
  varyingData: {
    variableName: 'v_texcoord',
    type: 'vec2',
    precision: 'mediump',
  },
};

const uniformInputSocketData0: UniformInputSocketData = {
  name: 'uniformSocketA',
  direction: SocketDirection.Input,
  uniformData: {
    variableName: 'u_float',
    type: 'float',
    precision: 'highp',
  },
};

const uniformInputSocketData1: UniformInputSocketData = {
  name: 'uniformSocketB',
  direction: SocketDirection.Input,
  uniformData: {
    type: 'sampler2D',
    precision: 'highp',
  },
};

const varyingOutputSocketData: VaryingOutputSocketData = {
  name: 'varyingOutputSocket',
  direction: SocketDirection.Output,
  varyingData: {
    type: 'vec4',
    precision: 'lowp',
    interpolationType: 'flat',
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
  varyingInputSocketData0,
  uniformInputSocketData0,
  uniformInputSocketData1,
  varyingOutputSocketData,
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
  expect(socketsOfNode0[5].className).toBe('UniformInputSocket');
  expect(socketsOfNode0[6].className).toBe('VaryingOutputSocket');
});

test('socket.name', () => {
  expect(socketsOfNode0[0].name).toBe('inputSocket0');
  expect(socketsOfNode0[1].name).toBe('outputSocket');
  expect(socketsOfNode0[2].name).toBe('attributeSocket');
  expect(socketsOfNode0[3].name).toBe('varyingInputSocket0');
  expect(socketsOfNode0[4].name).toBe('uniformSocketA');
  expect(socketsOfNode0[5].name).toBe('uniformSocketB');
  expect(socketsOfNode0[6].name).toBe('varyingOutputSocket');
});

test('socket.socketType', () => {
  expect(socketsOfNode0[0].socketType).toBe('vec3');
  expect(socketsOfNode0[1].socketType).toBe('vec2');
  expect(socketsOfNode0[2].socketType).toBe('vec4');
  expect(socketsOfNode0[3].socketType).toBe('vec2');
  expect(socketsOfNode0[4].socketType).toBe('float');
  expect(socketsOfNode0[5].socketType).toBe('sampler2D');
  expect(socketsOfNode0[6].socketType).toBe('vec4');
});

test('socket.node', () => {
  expect(socketsOfNode0[0].node).toStrictEqual(node0);
  expect(socketsOfNode0[1].node).toStrictEqual(node0);
  expect(socketsOfNode0[2].node).toStrictEqual(node0);
  expect(socketsOfNode0[3].node).toStrictEqual(node0);
  expect(socketsOfNode0[4].node).toStrictEqual(node0);
  expect(socketsOfNode0[5].node).toStrictEqual(node0);
  expect(socketsOfNode0[6].node).toStrictEqual(node0);
});

test('socket.node', () => {
  expect(socketsOfNode0[0].isInputSocket()).toBe(true);
  expect(socketsOfNode0[1].isInputSocket()).toBe(false);
  expect(socketsOfNode0[2].isInputSocket()).toBe(true);
  expect(socketsOfNode0[3].isInputSocket()).toBe(true);
  expect(socketsOfNode0[4].isInputSocket()).toBe(true);
  expect(socketsOfNode0[5].isInputSocket()).toBe(true);
  expect(socketsOfNode0[6].isInputSocket()).toBe(false);
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
test('attributeInputSocket.variableName', () => {
  expect(attributeInputSocket.variableName).toBe('a_position');
});

test('attributeInputSocket.precision', () => {
  expect(attributeInputSocket.precision).toBe('highp');
});

test('attributeInputSocket.location', () => {
  expect(attributeInputSocket.location).toBe(undefined);
});

const varyingInputSocket = socketsOfNode0[3] as VaryingInputSocket;
test('varyingInputSocket.variableName', () => {
  expect(varyingInputSocket.variableName).toBe('v_texcoord');
});

test('varyingInputSocket.precision', () => {
  expect(varyingInputSocket.precision).toBe('mediump');
});

test('varyingInputSocket.interpolationType', () => {
  expect(varyingInputSocket.interpolationType).toBe(undefined);
});

const uniformInputSocket0 = socketsOfNode0[4] as UniformInputSocket;
test('uniformInputSocket.variableName', () => {
  expect(uniformInputSocket0.variableName).toBe('u_float');
});

test('uniformInputSocket.precision', () => {
  expect(uniformInputSocket0.precision).toBe('highp');
});

const uniformInputSocket1 = socketsOfNode0[5] as UniformInputSocket;
test('uniformInputSocket.variableName', () => {
  expect(uniformInputSocket1.variableName).toBe('u_0_uniformSocketB');
});

const varyingOutputSocket = socketsOfNode0[6] as VaryingOutputSocket;
test('varyingOutputSocket.variableName', () => {
  expect(varyingOutputSocket.variableName).toBe('v_0_varyingOutputSocket');
});

test('varyingOutputSocket.precision', () => {
  expect(varyingOutputSocket.precision).toBe('lowp');
});

test('varyingOutputSocket.interpolationType', () => {
  expect(varyingOutputSocket.interpolationType).toBe('flat');
});

// --- test for connecting sockets  -------------------------------------------------

const standardInputSocketData1: StandardInputSocketData = {
  name: 'inputSocket1',
  type: SocketType.Vec2,
  direction: SocketDirection.Input,
  defaultValue: [0, 0],
  // Here, we connect sockets manually
  // socketConnectionData: {
  //   connectedSocketName: 'outputSocket',
  //   connectedNodeId: 0,
  // },
};

const varyingInputSocketData1: VaryingInputSocketData = {
  name: 'varyingInputSocket1',
  direction: SocketDirection.Input,
  varyingData: {
    type: 'vec4',
    precision: 'lowp',
    interpolationType: 'flat',
  },
  // Here, we connect sockets manually
  // socketConnectionData: {
  //   connectedSocketName: 'varyingOutputSocket',
  //   connectedNodeId: 0,
  // },
};

const driverNodeData1: NodeData = {
  shaderFunctionName: 'funcB',
  shaderStage: 'vertex',
};

const driverNodeData2: NodeData = {
  shaderFunctionName: 'funcC',
  shaderStage: 'vertex',
};

const sockets1 = [standardInputSocketData1];

const sockets2 = [varyingInputSocketData1];

const node1 = new Node(driverNodeData1, sockets1);
console.log('Please ignore the console.error above if the test passes.');

const node2 = new Node(driverNodeData2, sockets2);
console.log('Please ignore the console.error above if the test passes.');

const socketsOfNode1 = node1._sockets;
const socketsOfNode2 = node2._sockets;

const standardInputSocket1 = socketsOfNode1[0] as StandardInputSocket;
const varyingInputSocket1 = socketsOfNode2[0] as VaryingInputSocket;

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

test('AbstractVaryingSocket.connectSockets', () => {
  AbstractVaryingSocket.connectSockets(
    varyingInputSocket1,
    varyingOutputSocket
  );

  expect(varyingInputSocket1.variableName).toStrictEqual(
    'v_0_varyingOutputSocket_to_2'
  );
  expect(varyingInputSocket1.connectedSocket).toStrictEqual(
    varyingOutputSocket
  );
  expect(varyingOutputSocket.connectedSockets).toStrictEqual([
    varyingInputSocket1,
  ]);
  expect(varyingInputSocket1.connectedNode).toStrictEqual(node0);
  expect(varyingOutputSocket.connectedNodes).toStrictEqual([node2]);
});
