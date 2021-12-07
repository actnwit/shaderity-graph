import ShaderityNode from '../node/ShaderityNode';
import {SocketDirection, SocketType} from '../types/CommonEnum';
import {
  AttributeInputSocketData,
  StandardInputSocketData,
  StandardOutputSocketData,
  ShaderityNodeData,
  UniformInputSocketData,
  VaryingInputSocketData,
  VaryingOutputSocketData,
  ShaderOutputSocketData,
} from '../types/CommonType';
import AttributeInputSocket from './input/AttributeInputSocket';
import StandardInputSocket from './input/StandardInputSocket';
import UniformInputSocket from './input/UniformInputSocket';
import VaryingInputSocket from './input/VaryingInputSocket';
import StandardOutputSocket from './output/StandardOutputSocket';
import VaryingOutputSocket from './output/VaryingOutputSocket';

// This is the integration test of socket with node.

// --- test for non-connecting sockets  ---------------------------------------------

const standardInputSocketData0: StandardInputSocketData = {
  socketName: 'inputSocket0',
  direction: SocketDirection.Input,
  shaderData: {
    type: SocketType.Vec3,
    defaultValue: [0, 0, 0],
  },
};

const standardOutputSocketData: StandardOutputSocketData = {
  socketName: 'outputSocket',
  direction: SocketDirection.Output,
  shaderData: {
    type: SocketType.Vec2,
    precision: 'lowp',
  },
};

const attributeInputSocketData: AttributeInputSocketData = {
  socketName: 'attributeSocket',
  direction: SocketDirection.Input,
  attributeData: {
    variableName: 'a_position',
    type: 'vec4',
  },
};

const varyingInputSocketData0: VaryingInputSocketData = {
  socketName: 'varyingInputSocket0',
  direction: SocketDirection.Input,
  varyingData: {
    type: 'vec2',
  },
};

const uniformInputSocketData0: UniformInputSocketData = {
  socketName: 'uniformSocketA',
  direction: SocketDirection.Input,
  uniformData: {
    variableName: 'u_float',
    type: 'float',
    precision: 'highp',
  },
};

const uniformInputSocketData1: UniformInputSocketData = {
  socketName: 'uniformSocketB',
  direction: SocketDirection.Input,
  uniformData: {
    type: 'sampler2D',
    precision: 'highp',
  },
};

const varyingOutputSocketData: VaryingOutputSocketData = {
  socketName: 'varyingOutputSocket',
  direction: SocketDirection.Output,
  varyingData: {
    type: 'vec4',
    precision: 'lowp',
    interpolationType: 'flat',
  },
};

const shaderOutputSocketData: ShaderOutputSocketData = {
  socketName: 'mvpPosition',
  direction: SocketDirection.Output,
};

const driverNodeData0: ShaderityNodeData = {
  shaderFunctionName: 'functionA',
  shaderFunctionDataKey: 'funcA',
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
  shaderOutputSocketData,
];

const node0 = new ShaderityNode(driverNodeData0, sockets0);
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
  expect(socketsOfNode0[7].className).toBe('ShaderOutputSocket');
});

test('socket.socketName', () => {
  expect(socketsOfNode0[0].socketName).toBe('inputSocket0');
  expect(socketsOfNode0[1].socketName).toBe('outputSocket');
  expect(socketsOfNode0[2].socketName).toBe('attributeSocket');
  expect(socketsOfNode0[3].socketName).toBe('varyingInputSocket0');
  expect(socketsOfNode0[4].socketName).toBe('uniformSocketA');
  expect(socketsOfNode0[5].socketName).toBe('uniformSocketB');
  expect(socketsOfNode0[6].socketName).toBe('varyingOutputSocket');
  expect(socketsOfNode0[7].socketName).toBe('mvpPosition');
});

test('socket.socketType', () => {
  expect(socketsOfNode0[0].socketType).toBe('vec3');
  expect(socketsOfNode0[1].socketType).toBe('vec2');
  expect(socketsOfNode0[2].socketType).toBe('vec4');
  expect(socketsOfNode0[3].socketType).toBe('vec2');
  expect(socketsOfNode0[4].socketType).toBe('float');
  expect(socketsOfNode0[5].socketType).toBe('sampler2D');
  expect(socketsOfNode0[6].socketType).toBe('vec4');
  expect(socketsOfNode0[7].socketType).toBe('vec4');
});

test('socket.node', () => {
  expect(socketsOfNode0[0].node).toStrictEqual(node0);
  expect(socketsOfNode0[1].node).toStrictEqual(node0);
  expect(socketsOfNode0[2].node).toStrictEqual(node0);
  expect(socketsOfNode0[3].node).toStrictEqual(node0);
  expect(socketsOfNode0[4].node).toStrictEqual(node0);
  expect(socketsOfNode0[5].node).toStrictEqual(node0);
  expect(socketsOfNode0[6].node).toStrictEqual(node0);
  expect(socketsOfNode0[7].node).toStrictEqual(node0);
});

test('socket.node', () => {
  expect(socketsOfNode0[0].isInputSocket()).toBe(true);
  expect(socketsOfNode0[1].isInputSocket()).toBe(false);
  expect(socketsOfNode0[2].isInputSocket()).toBe(true);
  expect(socketsOfNode0[3].isInputSocket()).toBe(true);
  expect(socketsOfNode0[4].isInputSocket()).toBe(true);
  expect(socketsOfNode0[5].isInputSocket()).toBe(true);
  expect(socketsOfNode0[6].isInputSocket()).toBe(false);
  expect(socketsOfNode0[7].isInputSocket()).toBe(false);
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
test('StandardOutputSocket.precision', () => {
  expect(standardOutputSocket.precision).toBe('lowp');
});

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
  expect(attributeInputSocket.precision).toBe(undefined);
});

test('attributeInputSocket.location', () => {
  expect(attributeInputSocket.location).toBe(undefined);
});

const varyingInputSocket = socketsOfNode0[3] as VaryingInputSocket;
test('varyingInputSocket.variableName', () => {
  expect(varyingInputSocket.variableName).toBe(
    'v_non_connected_0_varyingInputSocket0'
  );
});

test('varyingInputSocket.precision', () => {
  expect(varyingInputSocket.precision).toBe('highp');
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
  socketName: 'inputSocket1',
  direction: SocketDirection.Input,
  shaderData: {
    type: SocketType.Vec2,
  },
  // Here, we connect sockets manually
  // socketConnectionData: {
  //   connectedSocketName: 'outputSocket',
  //   connectedNodeId: 0,
  // },
};

const varyingInputSocketData1: VaryingInputSocketData = {
  socketName: 'varyingInputSocket1',
  direction: SocketDirection.Input,
  varyingData: {
    type: 'vec4',
  },
  // Here, we connect sockets manually
  // socketConnectionData: {
  //   connectedSocketName: 'varyingOutputSocket',
  //   connectedNodeId: 0,
  // },
};

const driverNodeData1: ShaderityNodeData = {
  shaderFunctionName: 'functionB',
  shaderFunctionDataKey: 'funcB',
  shaderStage: 'vertex',
};

const driverNodeData2: ShaderityNodeData = {
  shaderFunctionName: 'functionC',
  shaderFunctionDataKey: 'funcC',
  shaderStage: 'vertex',
};

const sockets1 = [standardInputSocketData1];

const sockets2 = [varyingInputSocketData1];

const node1 = new ShaderityNode(driverNodeData1, sockets1);
console.log('Please ignore the console.error above if the test passes.');

const node2 = new ShaderityNode(driverNodeData2, sockets2);
console.log('Please ignore the console.error above if the test passes.');

const socketsOfNode1 = node1._sockets;
const socketsOfNode2 = node2._sockets;

const standardInputSocket1 = socketsOfNode1[0] as StandardInputSocket;
const varyingInputSocket1 = socketsOfNode2[0] as VaryingInputSocket;

test('StandardInputSocket.defaultValue (not specified case)', () => {
  expect(standardInputSocket1.defaultValue).toStrictEqual([0, 0]);
});

test('AbstractStandardSocket.connectSockets', () => {
  standardInputSocket1.connectSocketWith(standardOutputSocket);

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
  varyingInputSocket1.connectSocketWith(varyingOutputSocket);

  expect(varyingInputSocket1.variableName).toStrictEqual(
    'v_0_varyingOutputSocket'
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
