export const ShaderStage = {
  Vertex: 'vertex',
  Fragment: 'pixel',
  Pixel: 'pixel',
  NoUse: 'noUse',
} as const;
export type ShaderStageEnum = typeof ShaderStage[keyof typeof ShaderStage];

const _SocketType = {
  Bool: 'bool',
  Int: 'int',
  Float: 'float',
  Vec2: 'vec2',
  Vec3: 'vec3',
  Vec4: 'vec4',
  IVec2: 'ivec2',
  IVec3: 'ivec3',
  IVec4: 'ivec4',
  Mat22: 'mat22',
  Mat33: 'mat33',
  Mat44: 'mat44',
  Texture2D: 'sampler2D',
  // Texture3D: 'sampler3D',
  TextureCube: 'samplerCube',
} as const;

export const SocketType = {
  ..._SocketType,
  fromString: (str: string) => {
    for (const type of Object.values(_SocketType)) {
      if (type.toLowerCase() === str.toLowerCase()) {
        return type as SocketTypeEnum;
      }
    }
    return void 0;
  },
} as const;

export type SocketTypeEnum = typeof SocketType[keyof typeof _SocketType];

export const SocketDirection = {
  Input: 'input',
  Output: 'output',
} as const;
export type SocketDirectionEnum =
  typeof SocketDirection[keyof typeof SocketDirection];
