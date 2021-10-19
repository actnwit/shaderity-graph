import {ShaderFunctionData} from '../types/CommonType';
import ShaderFunctionCodeRepository from './ShaderFunctionCodeRepository';

const shaderFunctionData0: ShaderFunctionData = {
  shaderFunctionCode:
    'void identityFunc(in vec2 inVec, out vec2 outVec) {\n  outVec = inVec;\n}\n\nvec3 identityFunc(in vec3 inVec, out vec3 outVec) {\n  outVec = inVec;\n}\n',
};
const shaderFunctionData1: ShaderFunctionData = {
  shaderFunctionCode:
    'void derivativePosX(in vec3 pos, out vec3 dx) {\n  dx = dFdx(pos);\n}\n',
  extensions: ['GL_OES_standard_derivatives'],
};

ShaderFunctionCodeRepository.setShaderFunctionData(
  'identityFunc',
  shaderFunctionData0
);

ShaderFunctionCodeRepository.setShaderFunctionData(
  'derivativePosX',
  shaderFunctionData1
);

test('ShaderFunctionCodeRepository.existShaderFunctionData', () => {
  const result0 =
    ShaderFunctionCodeRepository.existShaderFunctionData('derivativePosX');
  expect(result0).toBe(true);

  const result1 =
    ShaderFunctionCodeRepository.existShaderFunctionData('derivativePosY');
  expect(result1).toBe(false);
});

test('ShaderFunctionCodeRepository.getShaderFunctionData', () => {
  const result0 =
    ShaderFunctionCodeRepository.getShaderFunctionData('identityFunc');
  expect(result0).toBe(shaderFunctionData0);

  const result1 =
    ShaderFunctionCodeRepository.getShaderFunctionData('identity');
  expect(result1).toBe(undefined);
  console.log('Please ignore the console.error above if the test passes.');
});

test('ShaderFunctionCodeRepository.resetShaderFunctionData', () => {
  ShaderFunctionCodeRepository.resetShaderFunctionData();

  const result =
    ShaderFunctionCodeRepository.getShaderFunctionData('identityFunc');
  expect(result).toBe(undefined);
  console.log('Please ignore the console.error above if the test passes.');
});
