# Specification of Shaderity-Graph-JSON

## Objects

- [ShaderityGraphJson](#shaderitygraphjson)(root object)
  - [ShaderityGraphNode](#shaderitygraphnode)
    - [NodeData](#nodedata)
    - [AbstractSocketData](#abstractsocketdata)
      - [ConnectableInputSocketData](#connectableinputsocketdata)
        - [SocketConnectionData](#socketconnectiondata)
      - [ConnectableOutputSocketData](#connectableoutputsocketdata)
      - [AttributeInputSocketData](#attributeinputsocketdata)
        - [ShaderAttributeObject](#shaderattributeobject)
      - [VaryingInputSocketData](#varyinginputsocketdata)
        - [ShaderVaryingObject](#shadervaryingobject)
      - [UniformInputSocketData](#uniforminputsocketdata)
        - [UniformInputSocketData](#uniforminputsocketdata)
  - [VertexShaderGlobalData](#vertexshaderglobaldata)
  - [FragmentShaderGlobalData](#fragmentshaderglobaldata)
    - [ShaderPrecisionObject](#shaderprecisionobject)
    - [ShaderConstantValueObject](#shaderconstantvalueobject)
  - [ShaderFunctionCodeObject](#shaderfunctioncodeobject)
    - [ShaderFunctionCode](#shaderfunctioncode)

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
|shaderFunctionCodeObject|`Object`|Functions corresponding to each node|✅ Yes|
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

- Type: `Object` ([VertexShaderGlobalData](#vertexshaderglobaldata))

- Required: No

<br>

### ShaderityGraphJson.fragmentShaderGlobalData

Information to be set in the global space of the fragment shader.

- Type: `Object` ([FragmentShaderGlobalData](#fragmentshaderglobaldata))

- Required: No

<br>

### ShaderityGraphJson.shaderFunctionCodeObject ✅

Functions corresponding to each node.

- Type: `Object` ([ShaderFunctionCodeObject](#shaderfunctioncodeobject))

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
as key in the [ShaderFunctionCodeObject](#shaderfunctioncodeobject).

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

All nodes input and output data through sockets. There are two ways to input and output data.
1. input/output between nodes
2. receiving input of attribute/varying/uniform variables
3. passing output of varying variables (TODO)

AbstractSocketData is an abstract object for convenience to group several objects together. The concrete objects are
[ConnectableInputSocketData](#connectableinputsocketdata),
[ConnectableOutputSocketData](#connectableoutputsocketdata),
[AttributeInputSocketData](#attributeinputsocketdata),
[VaryingInputSocketData](#varyinginputsocketdata), and
[UniformInputSocketData](#uniforminputsocketdata).

The attribute input socket only works with a vertex shader. The varying input socket only works with a vertex shader. All concrete objects have the following properties in common:

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|name|`string`|Name of this socket|✅ Yes|
|direction|`string`|Whether the node receives or passes data through that socket|✅ Yes|
|extras|`Object`|Application-specific data|No|

<br>

### AbstractSocketData.name ✅

Name of this socket. Mainly used to connect to this socket from other sockets.

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

## ConnectableInputSocketData

Data for a socket that can be connected to a single ConnectableOutputSocket.

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|name|`string`|Name of this socket|✅ Yes|
|direction|`string`|Whether the node receives or passes data through that socket|✅ Yes|
|type|`string`|GLSL type of data to be input on this socket|✅ Yes|
|defaultValue|`number[1-16]`|Value to take as input when this socket is not connected to any socket|✅ Yes|
|socketConnectionData|`Object`|Data of the connected output socket|No|
|extras|`Object`|Application-specific data|No|

<br>

### ConnectableInputSocketData.name ✅

Name of this socket.

- Type: `string`

- Required: Yes

<br>

### ConnectableInputSocketData.direction ✅

This property must be set `input`. See [AbstractSocketData.direction](#abstractsocketdatadirection) for detail.

- Type: `string`

- Required: Yes

- Allowed values
  - `input`: This socket receives data.

<br>

### ConnectableInputSocketData.type ✅

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

 ### ConnectableInputSocketData.defaultValue ✅

Value to take as input when this socket is not connected to any socket.

- Type: `number[1-16]`

- Required: Yes

<br>

### ConnectableInputSocketData.socketConnectionData

Data of the connected output socket. If it is not connected to an output socket, the value is undefined.

- Type: `Object`

- Required: No

<br>

### ConnectableInputSocketData.extras

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

### ConnectableInputSocketData.extras

Application-specific data.

- Type: `Object`

- Required: No

<br>

## ConnectableOutputSocketData

Data for a socket that can be connected to a multiple ConnectableInputSocket.

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|name|`string`|Name of this socket|✅ Yes|
|direction|`string`|Whether the node receives or passes data through that socket|✅ Yes|
|type|`string`|GLSL type of data to be output on this socket|✅ Yes|
|extras|`Object`|Application-specific data|No|

<br>

### ConnectableOutputSocketData.name ✅

Name of this socket.

- Type: `string`

- Required: Yes

<br>

### ConnectableOutputSocketData.direction ✅

This property must be set `output`. See [AbstractSocketData.direction](#abstractsocketdatadirection) for detail.

- Type: `string`

- Required: Yes

- Allowed values
  - `output`: This socket receives data.

<br>

### ConnectableOutputSocketData.type ✅

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

### ConnectableOutputSocketData.extras

Application-specific data.

- Type: `Object`

- Required: No

<br>

## AttributeInputSocketData

Data for a socket that takes an attribute variable as input

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|name|`string`|Name of this socket|✅ Yes|
|direction|`string`|Whether the node receives or passes data through that socket|✅ Yes|
|attributeData|`Object`|Data of the attribute variable taken as input|✅ Yes|
|extras|`Object`|Application-specific data|No|

<br>

### AttributeInputSocketData.name ✅

Name of this socket.

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

- Type: `Object` ([ShaderAttributeObject](#shaderattributeobject))

- Required: Yes

<br>

### AttributeInputSocketData.extras

Application-specific data.

- Type: `Object`

- Required: No

<br>

## ShaderAttributeObject

Data for attribute variables as input

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|variableName|`string`|Name of the attribute variable|✅ Yes|
|type|`string`|GLSL type of the attribute variable|✅ Yes|
|precision|`string`|Precision of the attribute variable|No|
|location|`number`|Location of the attribute variable(for GLSL ES3.0)|No|

<br>

### ShaderAttributeObject.variableName ✅

Name of the attribute variable.

- Type: `string`

- Required: Yes

<br>

### ShaderAttributeObject.type ✅

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

### ShaderAttributeObject.precision

Precision of the attribute variable

- Type: `string`

- Required: No (default value is `highp`)

- Allowed values
  - `highp`
  - `mediump`
  - `lowp`

<br>

### ShaderAttributeObject.location

Location of the attribute variable(for GLSL ES3.0)

- Type: `number`

- Required: No

<br>

## VaryingInputSocketData

Data for a socket that takes an varying variable as input

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|name|`string`|Name of this socket|✅ Yes|
|direction|`string`|Whether the node receives or passes data through that socket|✅ Yes|
|varyingData|`Object`|Data of the varying variable taken as input|✅ Yes|
|extras|`Object`|Application-specific data|No|

<br>

### VaryingInputSocketData.name ✅

Name of this socket.

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

- Type: `Object` ([ShaderVaryingObject](#shadervaryingobject))

- Required: Yes

<br>

### VaryingInputSocketData.extras

Application-specific data.

- Type: `Object`

- Required: No

<br>


## ShaderVaryingObject

Data for varying variables as input

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|variableName|`string`|Name of the attribute variable|✅ Yes|
|type|`string`|GLSL type of the varying variable|✅ Yes|
|precision|`string`|Precision of the varying variable|No|
|interpolationType|`string`|Interpolation type of the varying variable(for GLSL ES3.0)|No|

<br>

### ShaderVaryingObject.variableName ✅

Name of the varying variable.

- Type: `string`

- Required: Yes

<br>

### ShaderVaryingObject.type ✅

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

### ShaderVaryingObject.precision

Precision of the varying variable

- Type: `string`

- Required: No (default value is `highp`)

- Allowed values
  - `highp`
  - `mediump`
  - `lowp`

<br>

### ShaderVaryingObject.interpolationType

Interpolation type of the varying variable(for GLSL ES3.0)

- Type: `string`

- Required: No

- Allowed values
  - `flat`
  - `smooth`

<br>


## UniformInputSocketData

Data for a socket that takes an uniform variable as input

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|name|`string`|Name of this socket|✅ Yes|
|direction|`string`|Whether the node receives or passes data through that socket|✅ Yes|
|uniformData|`Object`|Data of the uniform variable taken as input|✅ Yes|
|extras|`Object`|Application-specific data|No|

<br>

### UniformInputSocketData.name ✅

Name of this socket.

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

- Type: `Object` ([ShaderUniformObject](#shaderuniformobject))

- Required: Yes

<br>

### UniformInputSocketData.extras

Application-specific data.

- Type: `Object`

- Required: No

<br>

## ShaderUniformObject

Data for uniform variables as input

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|variableName|`string`|Name of the attribute variable|✅ Yes|
|type|`string`|GLSL type of the uniform variable|✅ Yes|
|precision|`string`|Precision of the uniform variable|No|

<br>

### ShaderUniformObject.variableName ✅

Name of the uniform variable.

- Type: `string`

- Required: Yes

<br>

### ShaderUniformObject.type ✅

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

### ShaderUniformObject.precision

Precision of the uniform variable

- Type: `string`

- Required: No (default value is `highp`)

- Allowed values
  - `highp`
  - `mediump`
  - `lowp`

<br>

***

## VertexShaderGlobalData

Data to be set in the vertex shader

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|defineDirectives|`string[0-*]`|Define directives used in the vertex shader|No|
|precision|`Object`|Precision of each type in the vertex shader|No|
|constantValues|`Object`|Constant values used in the vertex shader|No|
|extras|`Object`|Application-specific data|No|

<br>

### VertexShaderGlobalData.defineDirectives

Define directives used in the vertex shader.

- Type: `string[0-*]`

- Required: No

<br>

### VertexShaderGlobalData.precision

Default precision of each type in the vertex shader

- Type: `Object` ([ShaderPrecisionObject](#shaderprecisionobject))

- Required: No

<br>

### VertexShaderGlobalData.constantValues

Constant values used in the vertex shader

- Type: `Object[0-*]` ([ShaderConstantValueObject](#shaderconstantvalueobject))

- Required: No

<br>

### VertexShaderGlobalData.extras

Application-specific data.

- Type: `Object`

- Required: No

<br>

***

## fragmentShaderGlobalData

Data to be set in the fragment shader

|Name|Type|Description|Required|
|:--|:--|:--|:--|
|defineDirectives|`string[0-*]`|Define directives used in the fragment shader|No|
|precision|`Object`|Precision of each type in the fragment shader|No|
|constantValues|`Object`|Constant values used in the fragment shader|No|
|outputVariableName|`string`|Variable name for assigning the vec4 of the fragment shader output|No|
|extras|`Object`|Application-specific data|No|

<br>

### fragmentShaderGlobalData.defineDirectives

Define directives used in the fragment shader.

- Type: `string[0-*]`

- Required: No

<br>

### fragmentShaderGlobalData.precision

Default precision of each type in the fragment shader

- Type: `Object` ([ShaderPrecisionObject](#shaderprecisionobject))

- Required: No

<br>

### fragmentShaderGlobalData.constantValues

Constant values used in the fragment shader

- Type: `Object[0-*]` ([ShaderConstantValueObject](#shaderconstantvalueobject))

- Required: No

<br>

### fragmentShaderGlobalData.outputVariableName

Variable name for assigning the vec4 of the fragment shader output
TODO: Prepare a socket for the output of the fragment shader and remove this property

- Type: `string`

- Required: No

<br>

### fragmentShaderGlobalData.extras

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

## shaderFunctionCodeObject

The shaderFunctionCodeObject is an object that contains the data of the shader function of all the nodes. For the shaderFunctionCodeObject property, [shaderFunctionName](#nodedatashaderfunctionname-✅) is the key and the corresponding value is [shaderFunctionCode](#shaderfunctioncode).

|Name|Type|Description|
|:--|:--|:--|
|(shaderFunctionName)[1*-]|`Object`|Data of the function corresponding to shaderFunctionName|

<br>

### shaderFunctionCodeObject.(shaderFunctionName)

Data of the function corresponding to shaderFunctionName

- Type: `Object` ([shaderFunctionCode](#shaderfunctioncode))

<br>

***

## shaderFunctionCode


|Name|Type|Description|Required|
|:--|:--|:--|:--|
|shaderFunctionCode|`string`|Data of the function corresponding to shaderFunctionName|true|
|extensions|`string[0-*]`|Extensions required by shaderFunctionCode|true|
|extras|`Object`|Value to be assigned as Constant value|No|

<br>

### ShaderFunctionCode.shaderFunctionCode ✅

Function in the shader. You need to write a function with the name of the key [shaderFunctionName](#nodedatashaderfunctionname-✅) in shaderFunctionCodeObject. The function can be overloaded.

- Type: `string`

- Required: Yes

<br>

### ShaderFunctionCode.extensions ✅

Extensions required by [shaderFunctionCode](#shaderfunctioncodeshaderfunctioncode-✅).

- Type: `string[0-*]`

- Required: Yes

<br>

### ShaderFunctionCode.extras

Application-specific data.

- Type: `Object`

- Required: No

<br>
