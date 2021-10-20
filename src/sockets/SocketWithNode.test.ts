import Node from '../node/Node';
import {SocketDirection, SocketType} from '../types/CommonEnum';
import {
  AttributeInputSocketData,
  ConnectableInputSocketData,
  ConnectableOutputSocketData,
  NodeData,
  UniformInputSocketData,
  VaryingInputSocketData,
} from '../types/CommonType';
import AttributeInputSocket from './input/AttributeInputSocket';
import ConnectableInputSocket from './input/ConnectableInputSocket';
import UniformInputSocket from './input/UniformInputSocket';
import VaryingInputSocket from './input/VaryingInputSocket';
import ConnectableOutputSocket from './output/ConnectableOutputSocket';
import AbstractConnectableSocket from './AbstractConnectableSocket';

// This is the integration test of socket with node.

// --- test for non-connecting sockets  ---------------------------------------------

const connectableInputSocketData0: ConnectableInputSocketData = {
  name: 'inputSocket0',
  type: SocketType.Vec3,
  direction: SocketDirection.Input,
  defaultValue: [0, 0, 0],
};

const connectableOutputSocketData: ConnectableOutputSocketData = {
  name: 'outputSocket',
  type: SocketType.Vec2,
  direction: SocketDirection.Output,
  socketConnectionData: [
    {
      connectedSocketName: 'inputSocket1',
      connectedNodeId: 1,
    },
  ],
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
  connectableInputSocketData0,
  connectableOutputSocketData,
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
  expect(socketsOfNode0[0].className).toBe('ConnectableInputSocket');
  expect(socketsOfNode0[1].className).toBe('ConnectableOutputSocket');
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

const connectableInputSocket0 = socketsOfNode0[0] as ConnectableInputSocket;
test('ConnectableInputSocket.connectedSocket', () => {
  expect(connectableInputSocket0.connectedSocket).toBe(undefined);
});

test('ConnectableInputSocket.connectedNode', () => {
  expect(connectableInputSocket0.connectedNode).toBe(undefined);
});

test('ConnectableInputSocket.defaultValue', () => {
  expect(connectableInputSocket0.defaultValue).toStrictEqual([0, 0, 0]);
});

const connectableOutputSocket = socketsOfNode0[1] as ConnectableOutputSocket;
test('connectableOutputSocket.connectedNodes', () => {
  expect(connectableOutputSocket.connectedNodes).toStrictEqual([]);
});

test('connectableOutputSocket.connectedSockets', () => {
  expect(connectableOutputSocket.connectedSockets).toStrictEqual([]);
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

const connectableInputSocketData1: ConnectableInputSocketData = {
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

const sockets1 = [connectableInputSocketData1];

const node1 = new Node(driverNodeData1, sockets1);
console.log('Please ignore the console.error above if the test passes.');

const socketsOfNode1 = node1._sockets;

const connectableInputSocket1 = socketsOfNode1[0] as ConnectableInputSocket;
test('AbstractConnectableSocket.connectSockets', () => {
  AbstractConnectableSocket.connectSockets(
    connectableInputSocket1,
    connectableOutputSocket
  );

  expect(connectableInputSocket1.connectedSocket).toStrictEqual(
    connectableOutputSocket
  );
  expect(connectableOutputSocket.connectedSockets).toStrictEqual([
    connectableInputSocket1,
  ]);
  expect(connectableInputSocket1.connectedNode).toStrictEqual(node0);
  expect(connectableOutputSocket.connectedNodes).toStrictEqual([node1]);
});
