import {ShaderFunctionData} from '../types/CommonType';
import ShaderFunctionDataRepository from './ShaderFunctionDataRepository';

const shaderFunctionData0: ShaderFunctionData = {
  shaderFunctionCode:
    'void identityFunc(in vec2 inVec, out vec2 outVec) {\n  outVec = inVec;\n}\n\nvec3 identityFunc(in vec3 inVec, out vec3 outVec) {\n  outVec = inVec;\n}\n',
};
const shaderFunctionData1: ShaderFunctionData = {
  shaderFunctionCode:
    'void derivativePosX(in vec3 pos, out vec3 dx) {\n  dx = dFdx(pos);\n}\n',
  extensions: ['GL_OES_standard_derivatives'],
};

ShaderFunctionDataRepository.setShaderFunctionData(
  'identityFunc',
  shaderFunctionData0
);

ShaderFunctionDataRepository.setShaderFunctionData(
  'derivativePosX',
  shaderFunctionData1
);

test('ShaderFunctionDataRepository.existShaderFunctionData', () => {
  const result0 =
    ShaderFunctionDataRepository.existShaderFunctionData('derivativePosX');
  expect(result0).toBe(true);

  const result1 =
    ShaderFunctionDataRepository.existShaderFunctionData('derivativePosY');
  expect(result1).toBe(false);
});

test('ShaderFunctionDataRepository.getShaderFunctionData', () => {
  const result0 =
    ShaderFunctionDataRepository.getShaderFunctionData('identityFunc');
  expect(result0).toBe(shaderFunctionData0);

  const result1 =
    ShaderFunctionDataRepository.getShaderFunctionData('identity');
  expect(result1).toBe(undefined);
  console.log('Please ignore the console.error above if the test passes.');
});

test('ShaderFunctionDataRepository.resetShaderFunctionData', () => {
  ShaderFunctionDataRepository.resetShaderFunctionData();

  const result =
    ShaderFunctionDataRepository.getShaderFunctionData('identityFunc');
  expect(result).toBe(undefined);
  console.log('Please ignore the console.error above if the test passes.');
});
