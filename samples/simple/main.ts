import _ShaderityGraph from '../../dist/esm/index';
import type {ShaderCodes} from '../../dist/esm/index';

declare const ShaderityGraph: typeof _ShaderityGraph;

(async () => {
  console.log(ShaderityGraph.System);

  const shadercodes: ShaderCodes = {
    vertexShaderCode: '',
    pixelShaderCode: '',
  };
  console.log(shadercodes);
})();
