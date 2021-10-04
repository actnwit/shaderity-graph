import {GlslTypeStr} from './CommonType';

export const ShaderStage = {
  Vertex: 'vertex',
  Fragment: 'pixel',
  Pixel: 'pixel',
  NoUse: 'noUse',
} as const;
export type ShaderStageEnum = typeof ShaderStage[keyof typeof ShaderStage];

const _SocketType = {
  // (socket type name): (glsl type name)
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
  getGlslTypeStr,
} as const;

function getGlslTypeStr(socketType: SocketTypeEnum): GlslTypeStr {
  switch (socketType) {
    case SocketType.Bool:
      return 'bool';
    case SocketType.Int:
      return 'int';
    case SocketType.Float:
      return 'float';
    case SocketType.Vec2:
      return 'vec2';
    case SocketType.Vec3:
      return 'vec3';
    case SocketType.Vec4:
      return 'vec4';
    case SocketType.IVec2:
      return 'ivec2';
    case SocketType.IVec3:
      return 'ivec3';
    case SocketType.IVec4:
      return 'ivec4';
    case SocketType.Mat22:
      return 'mat2';
    case SocketType.Mat33:
      return 'mat3';
    case SocketType.Mat44:
      return 'mat4';
    case SocketType.Texture2D:
      return 'sampler2D';
    case SocketType.TextureCube:
      return 'samplerCube';
    default:
      return 'unknown';
  }
}

export type SocketTypeEnum = typeof SocketType[keyof typeof _SocketType];
