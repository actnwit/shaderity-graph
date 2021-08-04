export const ShaderStage = {
  Vertex: 'vertex',
  Fragment: 'pixel',
  Pixel: 'pixel',
} as const;
export type ShaderStageEnum = typeof ShaderStage[keyof typeof ShaderStage];

export const AvailableShaderStage = {
  Vertex: 'vertex',
  Fragment: 'pixel',
  Pixel: 'pixel',
  VertexAndPixel: 'vertex_and_pixel',
  VertexAndFragment: 'vertex_and_pixel',
} as const;
export type AvailableShaderStageEnum =
  typeof AvailableShaderStage[keyof typeof AvailableShaderStage];

export const ShaderPrecision = {
  High: 'high',
  Medium: 'medium',
  Low: 'low',
} as const;
export type ShaderPrecisionEnum =
  typeof ShaderPrecision[keyof typeof ShaderPrecision];
