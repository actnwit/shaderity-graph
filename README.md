# Shaderity-Graph

The Shaderity-Graph is a tool to resolves a node graph.

## Features

Currently, we only support node graph resolving for GLSL shaders.

### Shader creation

By providing a node graph of the shader in the specified JSON format, you can create a shader for GLSL ES 3.0.

Note:

1. In combination with the Shaderity, the output shader can be transformed for GLSL ES 1.0.

2. Currently, dynamically changing node graphs are not supported. You cannot break the connection between nodes.

## How to use

You can convert the specified json format into vertex and fragment shader codes using the NodeConverter.createShaderCodesFromJsonFile method or NodeConverter.createShaderCodesFromJsonObject method.

```typescript

import _ShaderityGraph from '../../dist/esm/index';

declare const ShaderityGraph: typeof _ShaderityGraph;

(async () => {
  const shaderCodes = await ShaderityGraph.NodeConverter.createShaderCodesFromJsonFile('./shaderNodeGraph.json');
  console.log(shaderCodes.vertexShader);
  console.log(shaderCodes.fragmentShader);
})();


```
