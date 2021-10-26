import {ShaderFunctionData} from '../types/CommonType';
import ShaderFunctionDataRepository from './ShaderFunctionDataRepository';

const shaderFunctionCode0: ShaderFunctionData = {
  code: 'void identityFunc(in vec2 inVec, out vec2 outVec) {\n  outVec = inVec;\n}\n\nvec3 identityFunc(in vec3 inVec, out vec3 outVec) {\n  outVec = inVec;\n}\n',
};
const shaderFunctionCode1: ShaderFunctionData = {
  code: 'void derivativePosX(in vec3 pos, out vec3 dx) {\n  dx = dFdx(pos);\n}\n',
  extensions: ['GL_OES_standard_derivatives'],
};

ShaderFunctionDataRepository.setShaderFunctionCode(
  'identityFunc',
  shaderFunctionCode0
);

ShaderFunctionDataRepository.setShaderFunctionCode(
  'derivativePosX',
  shaderFunctionCode1
);

test('ShaderFunctionCodeRepository.existShaderFunctionCode', () => {
  const result0 =
    ShaderFunctionDataRepository.existShaderFunctionCode('derivativePosX');
  expect(result0).toBe(true);

  const result1 =
    ShaderFunctionDataRepository.existShaderFunctionCode('derivativePosY');
  expect(result1).toBe(false);
});

test('ShaderFunctionCodeRepository.getShaderFunctionCode', () => {
  const result0 =
    ShaderFunctionDataRepository.getShaderFunctionCode('identityFunc');
  expect(result0).toBe(shaderFunctionCode0);

  const result1 =
    ShaderFunctionDataRepository.getShaderFunctionCode('identity');
  expect(result1).toBe(undefined);
  console.log('Please ignore the console.error above if the test passes.');
});

test('ShaderFunctionCodeRepository.resetShaderFunctionCode', () => {
  ShaderFunctionDataRepository.resetShaderFunctionCode();

  const result =
    ShaderFunctionDataRepository.getShaderFunctionCode('identityFunc');
  expect(result).toBe(undefined);
  console.log('Please ignore the console.error above if the test passes.');
});
