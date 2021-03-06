# Specification of Shaderity-Graph-JSON

## Objects

- [ShaderityGraphJson](#shaderitygraphjson)(root object)
  - [ShaderityGraphNode](#shaderitygraphnode)
    - [AbstractNodeData](#abstractnodedata)
      - [ShaderityNodeData](#shaderitynodedata)
      - [SamplerNodeData](#samplernodedata)
    - [AbstractSocketData](#abstractsocketdata)
      - [StandardInputSocketData](#standardinputsocketdata)
        - [ShaderStandardInputData](#shaderstandardinputdata)
        - [SocketConnectionData](#socketconnectiondata)
      - [AttributeInputSocketData](#attributeinputsocketdata)
        - [ShaderAttributeData](#shaderattributedata)
      - [VaryingInputSocketData](#varyinginputsocketdata)
        - [ShaderVaryingInputData](#shadervaryinginputdata)
        - [SocketConnectionData](#socketconnectiondata)
      - [UniformInputSocketData](#uniforminputsocketdata)
        - [ShaderUniformData](#shaderuniformdata)
      - [StandardOutputSocketData](#standardoutputsocketdata)
        - [ShaderStandardOutputData](#shaderstandardoutputdata)
      - [VaryingOutputSocketData](#varyingoutputsocketdata)
        - [ShaderVaryingOutputData](#shadervaryingoutputdata)
      - [ShaderOutputSocketData](#shaderoutputsocketdata)
  - [ShaderGlobalData](#shaderglobaldata)
    - [ShaderPrecisionObject](#shaderprecisionobject)
    - [ShaderConstantValueObject](#shaderconstantvalueobject)
  - [ShaderFunctions](#shaderfunctions)
    - [ShaderFunctionData](#shaderfunctiondata)

The `extras` property is an object that can be freely set by the user.

***

## ShaderityGraphJson

The root object of the JSON

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|version|`string`|The Shaderity-Graph version that this json targets|✅ Yes|
|shaderityGraphNodes|`Object[1-*]`|Data of each node itself and connection information|✅ Yes|
|vertexShaderGlobalData|`Object`|Data to be set in the vertex shader|No|
|fragmentShaderGlobalData|`Object`|Data to be set in the fragment shader|No|
|shaderFunctions|`Object`|Function data corresponding to each node|✅ Yes|
|extras|`Object`|Application-specific data|No|

<br>

### ShaderityGraphJson.version ✅

The Shaderity-Graph version that this json targets.

- Type: `string`

- Required: Yes

<br>

### ShaderityGraphJson.shaderityGraphNodes ✅

Data that each node has. The index of the array is the id of the node. e.g. The node id of ShaderityGraphJson.shaderityGraphNodes[0] is 0.

- Type: `Object[1-*]` (Array of the [ShaderityGraphNode](#ShaderityGraphNode))

- Required: Yes

<br>

### ShaderityGraphJson.vertexShaderGlobalData

Information to be set in the global space of the vertex shader.

- Type: `Object` ([ShaderGlobalData](#shaderglobaldata))

- Required: No

<br>

### ShaderityGraphJson.fragmentShaderGlobalData

Information to be set in the global space of the fragment shader.

- Type: `Object` ([ShaderGlobalData](#shaderglobaldata))

- Required: No

<br>

### ShaderityGraphJson.shaderFunctions ✅

Functions corresponding to each node.

- Type: `Object` ([ShaderFunctions](#shaderfunctions))

- Required: Yes

<br>

### ShaderityGraphJson.extras

Application-specific data.

- Type: `Object` 

- Required: No

<br>

***

## ShaderityGraphNode

Data of one node. A node has sockets.
<figure>
  <img src='./node_and_socket.png' width=600 alt="node and socket"></img>
  <figcaption>node and socket</figcaption>
</figure>

All nodes exchange data through sockets except for the followings
1. Get global constant data
2. Assign values to built-in variables other than gl_Position and gl_FragColor(See. [ShaderOutputSocketData](#shaderoutputsocketdata))

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|nodeData|`Object`|Data of one node that is not associated with any other node|✅ Yes|
|socketDataArray|`Object[1-*]`|Data of connections between nodes|✅ Yes|
|extras|`Object`|Application-specific data|No|

<br>

### ShaderityGraphNode.nodeData ✅

Data of the node itself. It does not include information about connections to other nodes.

- Type: `Object` ([NodeData](#abstractnodedata))

- Required: Yes

<br>

### ShaderityGraphNode.socketDataArray ✅

Data of the sockets attached to the node. A node is connected to other nodes via the socket. The order of the AbstractSocketData must match the order of the arguments of the node's shader function.

- Type: `Object`[1-*] (Array of [SocketData](#abstractsocketdata))

- Required: Yes

<br>

### ShaderityGraphNode.extras

Application-specific data.

- Type: `Object`

- Required: No

<br>

***

## AbstractNodeData

Data of each node.

There are two concrete node data.
- [shaderityNodeData](#shaderitynodedata)
- [samplerInputNodeData](#samplerinputnodedata)

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|nodeType|`string`|Specify the node type.|No|
|shaderStage|`string`|Specifies whether this node is used by the vertex shader or the fragment shader.|✅ Yes|
|extras|`Object`|Application-specific data|No|

<br>

### AbstractNodeData.nodeType

Specify the type of this node.

There are two types of nodes in this library.

One is the 'samplerInputNode' type. This node is a special node with a fixed socket for input and output.
Only this node can output the value of sampler type. The only input is the uniform value of sampler type.

The other one is the 'shaderityNode'. All nodes except samplerInputNode are this node.

- Type: `string`

- Required: No (default value is 'shaderityNode')

- Allowed values
  - `shaderityNode`: General node
  - `samplerInputNode`: Node to input a uniform value of type Sampler and output it

<br>

### AbstractNodeData.shaderStage ✅

Specifies whether this node is used by the vertex shader or the fragment shader.

- Type: `string`

- Required: Yes

- Allowed values
  - `vertex`: This node is used by the vertex shader.
  - `fragment`: This node is used by the fragment shader.
  - `noUse`: This node is not used by any shaders.

<br>

### AbstractNodeData.extras

Application-specific data.

- Type: `Object`

- Required: No

<br>

## ShaderityNodeData

General node data.

Note: If you choose ShaderityNodeData as ShaderityGraphNode.nodeData, you cannot attach the SamplerOutputSocket to ShaderityGraphNode.socketDataArray. If you want to the SamplerOutputSocket, use SamplerInputNodeData.

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|nodeType|`string`|Specify the node type.|No|
|shaderStage|`string`|Specifies whether this node is used by the vertex shader or the fragment shader.|✅ Yes|
|shaderFunctionName|`string`|Name of the function which is used by this node|✅ Yes|
|shaderFunctionDataKey|`string`|Key of the shader function data|✅ Yes|
|extras|`Object`|Application-specific data|No|

<br>

### ShaderityNodeData.nodeType

Specify the type of this node.

- Type: `string`

- Required: No

- Allowed values
  - `shaderityNode`: General node

<br>

### ShaderityNodeData.shaderStage ✅

Specifies whether this node is used by the vertex shader or the fragment shader.

- Type: `string`

- Required: Yes

- Allowed values
  - `vertex`: This node is used by the vertex shader.
  - `fragment`: This node is used by the fragment shader.
  - `noUse`: This node is not used by any shaders.

<br>

### ShaderityNodeData.shaderFunctionName ✅

Function name in the shader corresponding to this node.
The function is called within the main function.
The function definition is written in the shaderFunctionData corresponding to the [shaderFunctionDataKey](#shaderfunctiondatakey).

- Type: `string`

- Required: Yes

<br>

### ShaderityNodeData.shaderFunctionDataKey ✅

Key of the shader function data.
When this node is used, the shader function data corresponding to this key will be used in the shader.
You need to set the shader function data with this key in the [ShaderFunctions](#shaderfunctions).

- Type: `string`

- Required: Yes

<br>

### ShaderityNodeData.extras

Application-specific data.

- Type: `Object`

- Required: No

<br>

## SamplerInputNodeData

Node data for output of the sampler type value obtained as uniform value.

Note: If you choose SamplerInputNodeData as ShaderityGraphNode.nodeData, ShaderityGraphNode.socketDataArray needs to contain only two: UniformInputSocketData and SamplerOutputSocketData.

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|nodeType|`string`|Specify the node type.|✅Yes|
|shaderStage|`string`|Specifies whether this node is used by the vertex shader or the fragment shader.|✅ Yes|
|extras|`Object`|Application-specific data|No|

<br>

### SamplerInputNodeData.nodeType ✅

Specify the type of this node.

- Type: `string`

- Required: Yes

- Allowed values
  - `samplerInputNode`

<br>

### SamplerInputNodeData.shaderStage ✅

Specifies whether this node is used by the vertex shader or the fragment shader.

- Type: `string`

- Required: Yes

- Allowed values
  - `vertex`: This node is used by the vertex shader.
  - `fragment`: This node is used by the fragment shader.
  - `noUse`: This node is not used by any shaders.

<br>

### SamplerInputNodeData.extras

Application-specific data.

- Type: `Object`

- Required: No

<br>


***

## AbstractSocketData

Data input and output for all nodes can be divided into the following three types:
1. input/output between nodes (Use the varying variable when communicating with different shaders)
2. input of attribute/uniform variables
3. Shader output with gl_Position and gl_FragColor (or variables for color output of fragment shader)

In shaderity graph, all nodes input and output data through sockets. The following types of sockets are available. The numbers on the right show the correspondence with the types above.

- [StandardInputSocketData](#standardinputsocketdata) (1)
- [StandardOutputSocketData](#standardoutputsocketdata) (1)
- [VaryingInputSocketData](#varyinginputsocketdata) (1)
- [VaryingOutputSocketData](#varyingoutputsocketdata) (1)
- [AttributeInputSocketData](#attributeinputsocketdata) (2)
- [UniformInputSocketData](#uniforminputsocketdata) (2)
- [ShaderOutputSocketData](#shaderoutputsocketdata) (3)
- [SamplerInputSocketData](#samplerinputsocketdata) (1)
- [SamplerOutputSocketData](#sampleroutputsocketdata) (1)

Note:
1. Normally, type 2 and 3 are not shown in the GUI (See the following figure 'hidden socket' )
2. The attribute input socket only works with a vertex shader.
3. The varying output socket only works with a vertex shader.
4. There is only one shader output socket for each shader.
5. When connecting sockets of nodes of the same shader, use standard input socket and standard output socket.
6. Suppose that the output socket of a vertex shader node is connected to one or more input sockets. If any of the connected input sockets are sockets of fragment shader nodes, all the connected sockets must be varying input sockets or varying output sockets.

<figure>
  <img src='./hidden_socket.png' width=600 alt="hidden socket"></img>
  <figcaption>hidden socket</figcaption>
</figure>

AbstractSocketData is an abstract object for convenience to group these objects together.
All concrete objects have the following properties:

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|socketName|`string`|Name of this socket|✅ Yes|
|direction|`string`|Whether the node receives or passes data through that socket|✅ Yes|
|extras|`Object`|Application-specific data|No|

<br>

### AbstractSocketData.socketName ✅

Name of this socket. Mainly used to connect to this socket from other sockets. For sockets in the same node, the AbstractSocketData.socketName must be unique.

- Type: `string`

- Required: No

<br>

### AbstractSocketData.direction ✅

Specifies whether this socket is an input socket to receive data or an output socket to pass data to other nodes. All concrete objects have a specific value to be specified.

- Type: `string`

- Required: No

- Allowed values
  - `input`: This socket receives data.
  - `output`: This socket passes data.

<br>

### AbstractSocketData.extras

Application-specific data.

- Type: `Object`

- Required: No

<br>

## StandardInputSocketData

Data for a socket that can be connected to a single StandardOutputSocket.

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|socketName|`string`|Name of this socket|✅ Yes|
|direction|`string`|Whether the node receives or passes data through that socket|✅ Yes|
|shaderData|`Object`|Data of the shader variable taken as input|✅ Yes|
|socketConnectionData|`Object`|Data of the connected output socket|No|
|extras|`Object`|Application-specific data|No|

<br>

### StandardInputSocketData.socketName ✅

Name of this socket. For sockets in the same node, the AbstractSocketData.socketName must be unique.

- Type: `string`

- Required: Yes

<br>

### StandardInputSocketData.direction ✅

This property must be set `input`. See [AbstractSocketData.direction](#abstractsocketdatadirection) for detail.

- Type: `string`

- Required: Yes

- Allowed values
  - `input`: This socket receives data.

<br>

### StandardInputSocketData.shaderData ✅

Data of the input variable.

- Type:  `Object` ([ShaderStandardInputData](#shaderstandardinputdata))

- Required: No

<br>

### StandardInputSocketData.socketConnectionData

Data of the connected output socket. If it is not connected to an output socket, the value is undefined.

- Type:  `Object` ([SocketConnectionData](#socketconnectiondata))

- Required: No

<br>

### StandardInputSocketData.extras

Application-specific data.

- Type: `Object`

- Required: No

<br>

## ShaderStandardInputData

Data of the shader variable taken as input

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|type|`string`|GLSL type of data to be input on this socket|✅ Yes|
|defaultValue|`number[0-16]`|Value to take as input when this socket is not connected to any socket|No|

### ShaderStandardInputData.type ✅

GLSL type of data to be input on this socket.

- Type: `string`

- Required: Yes

- Allowed values  (Do not use sampler type value)
  - `bool`
  - `int`
  - `float`
  - `vec2`
  - `vec3`
  - `vec4`
  - `ivec2`
  - `ivec3`
  - `ivec4`
  - `mat2`
  - `mat3`
  - `mat4`

<br>

 ### ShaderStandardInputData.defaultValue

Value to take as input when this socket is not connected to any socket.
If this property is omitted, the default value is 0 for all elements.

- Type: `number[0-16]`

- Required: Yes

<br>

## SocketConnectionData

Data to identify the socket connected to this socket.

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|connectedSocketName|`string`|Name of connected socket|✅ Yes|
|connectedNodeId|`number`|Whether the node receives or passes data through that socket|✅ Yes|
|extras|`Object`|Application-specific data|No|

<br>

### SocketConnectionData.connectedSocketName ✅

Name of connected socket.

- Type: `string`

- Required: Yes

<br>

### SocketConnectionData.connectedNodeId ✅

Node id of the node that has the connected socket. See [ShaderityGraphJson.shaderityGraphNodes](#shaderitygraphjsonshaderitygraphnodes-✅) for the node id.

- Type: `number`

- Required: Yes

<br>

### StandardInputSocketData.extras

Application-specific data.

- Type: `Object`

- Required: No

<br>


## AttributeInputSocketData

Data for a socket that takes an attribute variable as input
Only vertex shader nodes can have this socket.

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|socketName|`string`|Name of this socket|✅ Yes|
|direction|`string`|Whether the node receives or passes data through that socket|✅ Yes|
|attributeData|`Object`|Data of the attribute variable taken as input|✅ Yes|
|extras|`Object`|Application-specific data|No|

<br>

### AttributeInputSocketData.socketName ✅

Name of this socket. For sockets in the same node, the AbstractSocketData.socketName must be unique.

- Type: `string`

- Required: Yes

<br>

### AttributeInputSocketData.direction ✅

This property must be set `input`. See [AbstractSocketData.direction](#abstractsocketdatadirection) for detail.

- Type: `string`

- Required: Yes

- Allowed values
  - `input`: This socket receives data.

<br>

### AttributeInputSocketData.attributeData ✅

Data of the attribute variable taken as input

- Type: `Object` ([ShaderAttributeData](#shaderattributedata))

- Required: Yes

<br>

### AttributeInputSocketData.extras

Application-specific data.

- Type: `Object`

- Required: No

<br>

## ShaderAttributeData

Data for attribute variables as input

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|variableName|`string`|Name of the attribute variable|✅ Yes|
|type|`string`|GLSL type of the attribute variable|✅ Yes|
|precision|`string`|Precision of the attribute variable|No|
|location|`number`|Location of the attribute variable(for GLSL ES3.0)|No|

<br>

### ShaderAttributeData.variableName ✅

Name of the attribute variable.
In the generated shaders, this value is used with the 'a_' prefix added.
If there is an attributeInputSocket with the same ShaderAttributeData.variableName, it will refer to the same attribute variable in the shader.
The variable name to be written in the shader can be found in the node.getVariableNameOfInputSocket method.


- Type: `string`

- Required: Yes

<br>

### ShaderAttributeData.type ✅

GLSL type of the attribute variable

- Type: `string`

- Required: Yes

- Allowed values
  - `float`
  - `vec2`
  - `vec3`
  - `vec4`
  - `int`
  - `ivec2`
  - `ivec3`
  - `ivec4`
  - `mat2`
  - `mat3`
  - `mat4`

<br>

### ShaderAttributeData.precision

Precision of the attribute variable

- Type: `string`

- Required: No (default value is `highp`)

- Allowed values
  - `highp`
  - `mediump`
  - `lowp`

<br>

### ShaderAttributeData.location

Location of the attribute variable(for GLSL ES3.0)

- Type: `number`

- Required: No

<br>

## VaryingInputSocketData

Data for a socket that takes an varying variable as input.
|Name|Type|Description|Required|
|:--|:--|:--|:--|
|socketName|`string`|Name of this socket|✅ Yes|
|direction|`string`|Whether the node receives or passes data through that socket|✅ Yes|
|varyingData|`Object`|Data of the varying variable taken as input|✅ Yes|
|socketConnectionData|`Object`|Data of the connected output socket|✅ Yes|
|extras|`Object`|Application-specific data|No|

<br>

### VaryingInputSocketData.socketName ✅

Name of this socket. For sockets in the same node, the AbstractSocketData.socketName must be unique.

- Type: `string`

- Required: Yes

<br>

### VaryingInputSocketData.direction ✅

This property must be set `input`. See [AbstractSocketData.direction](#abstractsocketdatadirection) for detail.

- Type: `string`

- Required: Yes

- Allowed values
  - `input`: This socket receives data.

<br>

### VaryingInputSocketData.varyingData ✅

Data of varying variables taken as input

- Type: `Object` ([ShaderVaryingInputData](#shadervaryinginputdata))

- Required: Yes

<br>

### VaryingInputSocketData.socketConnectionData ✅

Data of the connected output socket.

- Type:  `Object` ([SocketConnectionData](#socketconnectiondata))

- Required: No

<br>

### VaryingInputSocketData.extras

Application-specific data.

- Type: `Object`

- Required: No

<br>

## ShaderVaryingInputData

Data for varying variables as input.
The variable name, precision, and interpolation type are the values of the output varying socket to which it is connected.

In the created shader, the variable name of this socket is v_(connectedNode.id)_(connectedSocketName), if this socket connects to a varying output socket. If this socket does not connect to a varying output socket, the variable name is `v_non_connected_(node.id)_(socketName).

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|type|`string`|GLSL type of the varying variable|✅ Yes|

<br>

### ShaderVaryingInputData.type ✅

GLSL type of the varying variable.
The main purpose is to verify that the output socket and type match.

- Type: `string`

- Required: Yes

- Allowed values
  - `float`
  - `vec2`
  - `vec3`
  - `vec4`
  - `int`
  - `ivec2`
  - `ivec3`
  - `ivec4`
  - `mat2`
  - `mat3`
  - `mat4`

<br>

## UniformInputSocketData

Data for a socket that takes an uniform variable as input

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|socketName|`string`|Name of this socket|✅ Yes|
|direction|`string`|Whether the node receives or passes data through that socket|✅ Yes|
|uniformData|`Object`|Data of the uniform variable taken as input|✅ Yes|
|extras|`Object`|Application-specific data|No|

<br>

### UniformInputSocketData.socketName ✅

Name of this socket. For sockets in the same node, the AbstractSocketData.socketName must be unique.

- Type: `string`

- Required: Yes

<br>

### UniformInputSocketData.direction ✅

This property must be set `input`. See [AbstractSocketData.direction](#abstractsocketdatadirection) for detail.

- Type: `string`

- Required: Yes

- Allowed values
  - `input`: This socket receives data.

<br>

### UniformInputSocketData.uniformData ✅

Data of uniform variables taken as input

- Type: `Object` ([ShaderUniformData](#shaderuniformdata))

- Required: Yes

<br>

### UniformInputSocketData.extras

Application-specific data.

- Type: `Object`

- Required: No

<br>

## ShaderUniformData

Data for uniform variables as input

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|variableName|`string`|Name of the attribute variable|No|
|type|`string`|GLSL type of the uniform variable|✅ Yes|
|precision|`string`|Precision of the uniform variable|No|

<br>

### ShaderUniformData.variableName

Name of the uniform variable.
In the generated shaders, this value is used in addition to the 'u_' prefix, the node id, and the socket name.
If there are uniformInputSockets with the same ShaderUniformData.variableName, they will refer to different uniform variables in the shader.
The variable name to be written in the shader can be found in the node.getVariableNameOfInputSocket method.

- Type: `string`

- Required: Yes

<br>

### ShaderUniformData.type ✅

GLSL type of the uniform variable

- Type: `string`

- Required: Yes

- Allowed values
  - `float`
  - `vec2`
  - `vec3`
  - `vec4`
  - `int`
  - `ivec2`
  - `ivec3`
  - `ivec4`
  - `bool`
  - `bvec2`
  - `bvec3`
  - `bvec4`
  - `uint`
  - `uvec2`
  - `uvec3`
  - `uvec4`
  - `mat2`
  - `mat3`
  - `mat4`
  - `mat2x2`
  - `mat2x3`
  - `mat2x4`
  - `mat3x2`
  - `mat3x3`
  - `mat3x4`
  - `mat4x2`
  - `mat4x3`
  - `mat4x4`
  - `sampler2D`
  - `samplerCube`
  - `sampler3D`
  - `sampler2DArray`
  - `isampler2D`
  - `isamplerCube`
  - `isampler3D`
  - `isampler2DArray`
  - `usampler2D`
  - `usamplerCube`
  - `usampler3D`
  - `usampler2DArray`
  - `sampler2DShadow`
  - `samplerCubeShadow`
  - `sampler2DArrayShadow`

<br>

### ShaderUniformData.precision

Precision of the uniform variable

- Type: `string`

- Required: No (default value is `highp`)

- Allowed values
  - `highp`
  - `mediump`
  - `lowp`

<br>

## StandardOutputSocketData

Data for a socket that can be connected to a multiple StandardInputSocket.

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|socketName|`string`|Name of this socket|✅ Yes|
|direction|`string`|Whether the node receives or passes data through that socket|✅ Yes|
|shaderData|`Object`|Data of the shader variable taken as output|✅ Yes|
|extras|`Object`|Application-specific data|No|

<br>

### StandardOutputSocketData.socketName ✅

Name of this socket. For sockets in the same node, the AbstractSocketData.socketName must be unique.

- Type: `string`

- Required: Yes

<br>

### StandardOutputSocketData.direction ✅

This property must be set `output`. See [AbstractSocketData.direction](#abstractsocketdatadirection) for detail.

- Type: `string`

- Required: Yes

- Allowed values
  - `output`: This socket receives data.

<br>

### StandardOutputSocketData.shaderData ✅

Data of the output variable.

- Type:  `Object` ([ShaderStandardOutputData](#shaderstandardoutputdata))

- Required: No

<br>

### StandardOutputSocketData.extras

Application-specific data.

- Type: `Object`

- Required: No

<br>


## ShaderStandardOutputData

Data of the shader variable taken as output

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|type|`string`|GLSL type of data to be output on this socket|✅ Yes|

<br>

### ShaderStandardOutputData.type ✅

GLSL type of data to be output on this socket.

- Type: `string`

- Required: Yes

- Allowed values (Do not use sampler type value)
  - `bool`
  - `int`
  - `float`
  - `vec2`
  - `vec3`
  - `vec4`
  - `ivec2`
  - `ivec3`
  - `ivec4`
  - `mat2`
  - `mat3`
  - `mat4`
<br>

## VaryingOutputSocketData

Data for a socket that takes an varying variable as output.
Only vertex shader nodes can have this socket.

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|socketName|`string`|Name of this socket|✅ Yes|
|direction|`string`|Whether the node receives or passes data through that socket|✅ Yes|
|varyingData|`Object`|Data of the varying variable taken as output|✅ Yes|
|extras|`Object`|Application-specific data|No|

<br>

### VaryingOutputSocketData.socketName ✅

Name of this socket. For sockets in the same node, the AbstractSocketData.socketName must be unique.

- Type: `string`

- Required: Yes

<br>

### VaryingOutputSocketData.direction ✅

This property must be set `output`. See [AbstractSocketData.direction](#abstractsocketdatadirection) for detail.

- Type: `string`

- Required: Yes

- Allowed values
  - `output`: This socket passes data.

<br>

### VaryingOutputSocketData.varyingData ✅

Data of varying variables taken as output

- Type: `Object` ([ShaderVaryingOutputData](#shadervaryingoutputdata))

- Required: Yes

<br>

### VaryingOutputSocketData.extras

Application-specific data.

- Type: `Object`

- Required: No

<br>

## ShaderVaryingOutputData

Data for varying variables as output.

In the created shader, the variable name of this socket is v_(node.id)_(socketName).

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|type|`string`|GLSL type of the varying variable|✅ Yes|
|precision|`string`|Precision of the varying variable|No|
|interpolationType|`string`|Interpolation type of the varying variable(for GLSL ES3.0)|No|

<br>

### ShaderVaryingOutputData.type ✅

GLSL type of the varying variable

- Type: `string`

- Required: Yes

- Allowed values
  - `float`
  - `vec2`
  - `vec3`
  - `vec4`
  - `int`
  - `ivec2`
  - `ivec3`
  - `ivec4`
  - `mat2`
  - `mat3`
  - `mat4`

<br>

### ShaderVaryingOutputData.precision

Precision of the varying variable

- Type: `string`

- Required: No (default value is `highp`)

- Allowed values
  - `highp`
  - `mediump`
  - `lowp`

<br>

### ShaderVaryingOutputData.interpolationType

Interpolation type of the varying variable(for GLSL ES3.0)

- Type: `string`

- Required: No

- Allowed values
  - `flat`
  - `smooth`

<br>


## ShaderOutputSocketData
Output data to gl_Position, gl_FragColor (or variables for color output of fragment shader). Assigning values to other built-in variables, such as gl_PointSize, should be done within the node's function.

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|socketName|`string`|Name of this socket|✅ Yes|
|direction|`string`|Whether the node receives or passes data through that socket|✅ Yes|
|extras|`Object`|Application-specific data|No|

<br>

### ShaderOutputSocketData.socketName ✅

Name of this socket. For sockets in the same node, the AbstractSocketData.socketName must be unique.

- Type: `string`

- Required: Yes

<br>

### ShaderOutputSocketData.direction ✅

This property must be set `output`. See [AbstractSocketData.direction](#abstractsocketdatadirection) for detail.

- Type: `string`

- Required: Yes

- Allowed values
  - `output`: This socket passes data.

<br>

### ShaderOutputSocketData.extras

Application-specific data.

- Type: `Object`

- Required: No

<br>

## SamplerInputSocketData

Input sampler type value.

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|direction|`string`|Whether the node receives or passes data through that socket|✅ Yes|
|samplerType|`string`|GLSL type of the input sampler value|✅ Yes|
|socketConnectionData|`string`|Data of the connected output socket|✅ Yes|

<br>

### SamplerInputSocketData.direction ✅

This property must be set `input`. See [AbstractSocketData.direction](#abstractsocketdatadirection) for detail.

- Type: `string`

- Required: Yes

- Allowed values
  - `input`: This socket receives data.

<br>

### SamplerInputSocketData.samplerType ✅

GLSL type of the input sampler value.

- Type: `string`

- Required: Yes

- Allowed values
  - `sampler2D`
  - `samplerCube`

<br>

### SamplerInputSocketData.socketConnectionData ✅

Data of the connected output socket.

- Type:  `Object` ([SocketConnectionData](#socketconnectiondata))

- Required: No

<br>

## SamplerOutputSocketData

Output sampler type value. This socket can be contained by the 'SamplerInputNode' type node only.

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|direction|`string`|Whether the node receives or passes data through that socket|✅ Yes|
|samplerType|`string`|GLSL type of the input sampler value|✅ Yes|

<br>

### SamplerOutputSocketData.direction ✅

This property must be set `output`. See [AbstractSocketData.direction](#abstractsocketdatadirection) for detail.

- Type: `string`

- Required: Yes

- Allowed values
  - `output`: This socket passes data.

<br>

### SamplerOutputSocketData.samplerType ✅

GLSL type of the input sampler value.

- Type: `string`

- Required: Yes

- Allowed values
  - `sampler2D`
  - `samplerCube`

<br>

***

## ShaderGlobalData

Data to be set in the each shader

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|defineDirectives|`string[0-*]`|Define directives used in a shader|No|
|precision|`Object`|Precision of each type in a shader|No|
|constantValues|`Object`|Constant values used in a shader|No|
|extras|`Object`|Application-specific data|No|

<br>

### ShaderGlobalData.defineDirectives

Define directives used in a shader.

- Type: `string[0-*]`

- Required: No

<br>

### ShaderGlobalData.precision

Default precision of each type in a shader

- Type: `Object` ([ShaderPrecisionObject](#shaderprecisionobject))

- Required: No

<br>

### ShaderGlobalData.constantValues

Constant values used in a shader

- Type: `Object[0-*]` ([ShaderConstantValueObject](#shaderconstantvalueobject))

- Required: No

<br>

### ShaderGlobalData.extras

Application-specific data.

- Type: `Object`

- Required: No

<br>

***

## ShaderPrecisionObject

Specifies the default value of the precision for a particular type of shader

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|int|`string`|Default precision of int type|No|
|float|`string`|Default precision of float type|No|
|sampler2D|`string`|Default precision of sampler2D type|No|
|samplerCube|`string`|Default precision of samplerCube type|No|
|sampler3D|`string`|Default precision of sampler3D type|No|
|sampler2DArray|`string`|Default precision of sampler2DArray type|No|
|isampler2D|`string`|Default precision of isampler2D type|No|
|isamplerCube|`string`|Default precision of isamplerCube type|No|
|isampler3D|`string`|Default precision of isampler3D type|No|
|isampler2DArray|`string`|Default precision of isampler2DArray type|No|
|usampler2D|`string`|Default precision of usampler2D type|No|
|usamplerCube|`string`|Default precision of usamplerCube type|No|
|usampler3D|`string`|Default precision of usampler3D type|No|
|usampler2DArray|`string`|Default precision of usampler2DArray type|No|
|sampler2DShadow|`string`|Default precision of sampler2DShadow type|No|
|samplerCubeShadow|`string`|Default precision of samplerCubeShadow type|No|
|sampler2DArrayShadow|`string`|Default precision of sampler2DArrayShadow type|No|

- Type: `string`

- Required: No (default value is `highp` for all types)

- Allowed values
  - `highp`
  - `mediump`
  - `lowp`

***

## ShaderConstantValueObject

Data for constant values used in the shader

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|variableName|`string`||true|
|type|`string`||true|
|values|`number[1-16]`|Value to be assigned as Constant value|true|

<br>

### ShaderConstantValueObject.variableName ✅

Name of a constant variable

- Type: `string`

- Required: Yes

<br>

### ShaderConstantValueObject.type ✅

GLSL type of the constant value

- Type: `string`

- Required: Yes

- Allowed values
  - `float`
  - `vec2`
  - `vec3`
  - `vec4`
  - `int`
  - `ivec2`
  - `ivec3`
  - `ivec4`
  - `bool`
  - `bvec2`
  - `bvec3`
  - `bvec4`
  - `uint`
  - `uvec2`
  - `uvec3`
  - `uvec4`
  - `mat2`
  - `mat3`
  - `mat4`
  - `mat2x2`
  - `mat2x3`
  - `mat2x4`
  - `mat3x2`
  - `mat3x3`
  - `mat3x4`
  - `mat4x2`
  - `mat4x3`
  - `mat4x4`

<br>

### ShaderConstantValueObject.values ✅

Constant value to assign to a constant variable

- Type: `number[1-16]`

- Required: Yes

<br>

***

## ShaderFunctions

The ShaderFunctions is an object that contains the data of the shader function of all the nodes. For the ShaderFunctions property, [shaderFunctionDataKey](#shaderitynodedatashaderfunctiondatakey-✅) is the key and the corresponding value is [shaderFunctionData](#shaderfunctiondata).

|Name|Type|Description|
|:--|:--|:--|
|(shaderFunctionDataKey)[1*-]|`Object`|Data of the function corresponding to shaderFunctionDataKey|

<br>

### ShaderFunctions.(shaderFunctionDataKey)

Data of the function corresponding to shaderFunctionDataKey

- Type: `Object` ([shaderFunctionData](#shaderfunctiondata))

<br>

***

## shaderFunctionData


|Name|Type|Description|Required|
|:--|:--|:--|:--|
|code|`string`|Shader code|true|
|extensions|`string[0-*]`|Extensions required by shaderFunctionData|true|
|extras|`Object`|Value to be assigned as Constant value|No|

<br>

### ShaderFunctionData.code ✅

Function codes used in the shader.
You need to write a function with the name of [shaderFunctionName](#shaderitynodedatashaderfunctionname-✅) of the node corresponding to this ShaderFunctionData to this property.
The function with the name of [shaderFunctionName](#shaderitynodedatashaderfunctionname-✅) is the entry point of ShaderFunctionData.code. 

Note
1. In the function whose name is shaderFunctionName, all inputs and outputs should be written as arguments. The return value of the function itself should be of type void. The return value is not used in shaders.
2. It is possible to write multiple functions in ShaderFunctionData.code. In this case, be careful not to duplicate the name of the function in the other ShaderFunctionData.code.
3. By changing the shaderFunctionName of a node, you can switch the function to be executed by that node. The function corresponding to the changed shaderFunctionName must be written in the ShaderFunctionData.code.


The function can be overloaded.

- Type: `string`

- Required: Yes

<br>

### ShaderFunctionData.extensions ✅

Extensions required by [code](#shaderfunctiondatacode-✅).

- Type: `string[0-*]`

- Required: Yes

<br>

### ShaderFunctionData.extras

Application-specific data.

- Type: `Object`

- Required: No

<br>
