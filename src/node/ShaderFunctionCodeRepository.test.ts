import {ShaderFunctionCode} from '../types/CommonType';
import ShaderFunctionCodeRepository from './ShaderFunctionCodeRepository';

const shaderFunctionCode0: ShaderFunctionCode = {
  shaderFunctionCode:
    'void identityFunc(in vec2 inVec, out vec2 outVec) {\n  outVec = inVec;\n}\n\nvec3 identityFunc(in vec3 inVec, out vec3 outVec) {\n  outVec = inVec;\n}\n',
};
const shaderFunctionCode1: ShaderFunctionCode = {
  shaderFunctionCode:
    'void derivativePosX(in vec3 pos, out vec3 dx) {\n  dx = dFdx(pos);\n}\n',
  extensions: ['GL_OES_standard_derivatives'],
};

ShaderFunctionCodeRepository.setShaderFunctionCode(
  'identityFunc',
  shaderFunctionCode0
);

ShaderFunctionCodeRepository.setShaderFunctionCode(
  'derivativePosX',
  shaderFunctionCode1
);

test('ShaderFunctionCodeRepository.existShaderFunctionCode', () => {
  const result0 =
    ShaderFunctionCodeRepository.existShaderFunctionCode('derivativePosX');
  expect(result0).toBe(true);

  const result1 =
    ShaderFunctionCodeRepository.existShaderFunctionCode('derivativePosY');
  expect(result1).toBe(false);
});

test('ShaderFunctionCodeRepository.getShaderFunctionCode', () => {
  const result0 =
    ShaderFunctionCodeRepository.getShaderFunctionCode('identityFunc');
  expect(result0).toBe(shaderFunctionCode0);

  const result1 =
    ShaderFunctionCodeRepository.getShaderFunctionCode('identity');
  expect(result1).toBe(undefined);
  console.log('Please ignore the console.error above if the test passes.');
});

test('ShaderFunctionCodeRepository.resetShaderFunctionCode', () => {
  ShaderFunctionCodeRepository.resetShaderFunctionCode();

  const result =
    ShaderFunctionCodeRepository.getShaderFunctionCode('identityFunc');
  expect(result).toBe(undefined);
  console.log('Please ignore the console.error above if the test passes.');
});
