# Specification of Shaderity-Graph-JSON

## Objects

- [ShaderityGraphJson](#shaderitygraphjson)(root object)
  - [ShaderityGraphNode](#shaderitygraphnode)
    - [NodeData](#nodedata)
    - [AbstractSocketData](#abstractsocketdata)
      - [StandardInputSocketData](#standardinputsocketdata)
        - [SocketConnectionData](#socketconnectiondata)
      - [AttributeInputSocketData](#attributeinputsocketdata)
        - [ShaderAttributeData](#shaderattributedata)
      - [VaryingInputSocketData](#varyinginputsocketdata)
        - [ShaderVaryingInputData](#shadervaryinginputdata)
        - [SocketConnectionData](#socketconnectiondata)
      - [UniformInputSocketData](#uniforminputsocketdata)
        - [ShaderUniformData](#shaderuniformdata)
      - [StandardOutputSocketData](#standardoutputsocketdata)
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

Data of one node

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|nodeData|`Object`|Data of one node that is not associated with any other node|✅ Yes|
|socketDataArray|`Object[1-*]`|Data of connections between nodes|✅ Yes|
|extras|`Object`|Application-specific data|No|

<br>

### ShaderityGraphNode.nodeData ✅

Data of the node itself. It does not include information about connections to other nodes.

- Type: `Object` ([NodeData](#nodedata))

- Required: Yes

<br>

### ShaderityGraphNode.socketDataArray ✅

Data of the sockets attached to the node. A node is connected to other nodes via the socket. The order of the AbstractSocketData must match the order of the arguments of the node's shader function.

- Type: `Object`[1-*] (Array of [AbstractSocketData](#abstractsocketdata))

- Required: Yes

<br>

### ShaderityGraphNode.extras

Application-specific data.

- Type: `Object`

- Required: No

<br>

***

## NodeData

Data of one node that is not associated with any other node

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|shaderFunctionName|`string`|Name of the function of the shader corresponding to this node|✅ Yes|
|shaderStage|`string`|Specifies whether this node is used by the vertex shader or the fragment shader.|✅ Yes|
|extras|`Object`|Application-specific data|No|

<br>

### NodeData.shaderFunctionName ✅

Name of the function of the shader corresponding to this node.
You need to set the data of the shader function with this name
as key in the [ShaderFunctions](#shaderfunctions).

- Type: `string`

- Required: Yes

<br>

### NodeData.shaderStage ✅

Specifies whether this node is used by the vertex shader or the fragment shader.

- Type: `string`

- Required: Yes

- Allowed values
  - `vertex`: This node is used by the vertex shader.
  - `fragment`: This node is used by the fragment shader.
  - `noUse`: This node is not used by any shaders.

<br>

### NodeData.extras

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

Note:
1. Normally, type 2 and 3 are not shown in the GUI.
2. The attribute input socket only works with a vertex shader.
3. The varying input socket only works with a fragment shader.
4. The varying output socket only works with a vertex shader.
5. There is only one shader output socket for each shader.

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
|type|`string`|GLSL type of data to be input on this socket|✅ Yes|
|defaultValue|`number[1-16]`|Value to take as input when this socket is not connected to any socket|✅ Yes|
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

### StandardInputSocketData.type ✅

GLSL type of data to be input on this socket.

- Type: `string`

- Required: Yes

- Allowed values
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
  - `sampler2D`
  - `samplerCube`

<br>

 ### StandardInputSocketData.defaultValue ✅

Value to take as input when this socket is not connected to any socket.

- Type: `number[1-16]`

- Required: Yes

<br>

### StandardInputSocketData.socketConnectionData

Data of the connected output socket. If it is not connected to an output socket, the value is undefined.

- Type: `Object`

- Required: No

<br>

### StandardInputSocketData.extras

Application-specific data.

- Type: `Object`

- Required: No

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

Data for a socket that takes an varying variable as input
Only fragment shader nodes can have this socket.

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

- Type: `Object`

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
|type|`string`|GLSL type of data to be output on this socket|✅ Yes|
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

### StandardOutputSocketData.type ✅

GLSL type of data to be output on this socket.

- Type: `string`

- Required: Yes

- Allowed values
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
  - `sampler2D`
  - `samplerCube`

<br>

### StandardOutputSocketData.extras

Application-specific data.

- Type: `Object`

- Required: No

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
Output data to gl_Position, gl_FragColor (or variables for color output of fragment shader). The type is fixed at Vec4. The argument corresponding to this socket in shaderFunctionData.code must be of type `out vec4`.

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|socketName|`string`|Name of this socket|✅ Yes|
|direction|`string`|Whether the node receives or passes data through that socket|✅ Yes|
|extras|`Object`|Application-specific data|No|

<br>

### ShaderOutputSocketData.socketName ✅

Name of this socket. For sockets in the same node, the AbstractSocketData.name must be unique.

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

### ShaderConstantValueObject.values ✅

Constant value to assign to a constant variable

- Type: `number[1-16]`

- Required: Yes

<br>

***

## ShaderFunctions

The ShaderFunctions is an object that contains the data of the shader function of all the nodes. For the ShaderFunctions property, [shaderFunctionName](#nodedatashaderfunctionname-✅) is the key and the corresponding value is [shaderFunctionData](#shaderfunctiondata).

|Name|Type|Description|
|:--|:--|:--|
|(shaderFunctionName)[1*-]|`Object`|Data of the function corresponding to shaderFunctionName|

<br>

### ShaderFunctions.(shaderFunctionName)

Data of the function corresponding to shaderFunctionName

- Type: `Object` ([shaderFunctionData](#shaderfunctiondata))

<br>

***

## shaderFunctionData


|Name|Type|Description|Required|
|:--|:--|:--|:--|
|code|`string`|Data of the function corresponding to shaderFunctionName|true|
|extensions|`string[0-*]`|Extensions required by shaderFunctionData|true|
|extras|`Object`|Value to be assigned as Constant value|No|

<br>

### ShaderFunctionData.code ✅

Function code in the shader. You need to write a function with the name of the key [shaderFunctionName](#nodedatashaderfunctionname-✅) in ShaderFunctions. The function can be overloaded.

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
