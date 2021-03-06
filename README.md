# Shaderity-Graph

The Shaderity-Graph is a tool to resolves a node graph.

## package hierarchy

- shaderity-graph: This. a runtime for node graph processing.
    - [shaderity](https://github.com/actnwit/shaderity/): for runtime features
        - [shaderity-loader](https://github.com/actnwit/shaderity-loader): for static features
            - [shaderity-node](https://github.com/actnwit/shaderity-node): The internal component for shaderity-loader.

## Features

Currently, we only support node graph resolving for GLSL shaders.

### Shader creation

By providing a node graph of the shader in the specified JSON format, you can create a shader for GLSL ES 3.0.

Note:

1. In combination with the Shaderity, the output shader can be transformed for GLSL ES 1.0.

2. Currently, dynamically changing node graphs are not supported. You cannot break the connection between nodes.

## Build

### Setup Project

```bash
$ yarn install
```

### Build project

```bash
$ yarn build
```
The built files will be created under the dist folder.

## How to use

You can convert the specified json format into vertex and fragment shader codes using the ShaderityGraphConverter.createShaderCodesFromJsonFile method or ShaderityGraphConverter.createShaderCodesFromJsonObject method.

```typescript

import _ShaderityGraph from '../../dist/esm/index';

declare const ShaderityGraph: typeof _ShaderityGraph;

(async () => {
  const shaderCodes = await ShaderityGraph.ShaderityGraphConverter.createShaderCodesFromJsonFile('./shaderNodeGraph.json');
  console.log(shaderCodes.vertexShader);
  console.log(shaderCodes.fragmentShader);
})();


```

## Documents

You can create a document under the doc folder with the following command:

``` bash
yarn doc
```

## Tests

You can run tests with the following command:

``` bash
yarn test
```
