export const ShaderStage = {
  Vertex: 'vertex',
  Fragment: 'pixel',
  Pixel: 'pixel',
  NoUse: 'noUse',
} as const;
export type ShaderStageEnum = typeof ShaderStage[keyof typeof ShaderStage];

const _SocketType = {
  Int: 'int',
  Float: 'float',
  Vector2: 'vector2',
  Vector3: 'vector3',
  Vector4: 'vector4',
  Mat22: 'mat22',
  Mat33: 'mat33',
  Mat44: 'mat44',
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
};

export type SocketTypeEnum = typeof SocketType[keyof typeof _SocketType];

export const SocketDirection = {
  Input: 'input',
  Output: 'output',
} as const;
export type SocketDirectionEnum =
  typeof SocketDirection[keyof typeof SocketDirection];
