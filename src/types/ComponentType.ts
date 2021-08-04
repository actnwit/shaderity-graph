import {
  AbstractEnumClass,
  EnumIO,
  _from,
  _fromString,
} from './AbstractEnumClass';

export interface ComponentTypeEnum extends EnumIO {
  isFloatingPoint(): boolean;
  isInteger(): boolean;
}

class ComponentTypeClass
  extends AbstractEnumClass
  implements ComponentTypeEnum
{
  constructor({index, str}: {index: number; str: string}) {
    super({index, str});
  }

  isFloatingPoint() {
    if (
      this.index === 5126 || // Float
      this.index === 5127 || // Double
      this.index === 0x8d61 // HalfFloat
    ) {
      return true;
    }

    return false;
  }

  isInteger() {
    if (
      this.index === 5120 || // Byte
      this.index === 5121 || // UnsignedByte
      this.index === 5122 || // Short
      this.index === 5123 || // UnsignedShort
      this.index === 5124 || // Int
      this.index === 5125 // UnsignedInt
    ) {
      return true;
    }

    return false;
  }
}

const Unknown: ComponentTypeEnum = new ComponentTypeClass({
  index: 5119,
  str: 'UNKNOWN',
});
const Byte: ComponentTypeEnum = new ComponentTypeClass({
  index: 5120,
  str: 'BYTE',
});
const UnsignedByte: ComponentTypeEnum = new ComponentTypeClass({
  index: 5121,
  str: 'UNSIGNED_BYTE',
});
const Short: ComponentTypeEnum = new ComponentTypeClass({
  index: 5122,
  str: 'SHORT',
});
const UnsignedShort: ComponentTypeEnum = new ComponentTypeClass({
  index: 5123,
  str: 'UNSIGNED_SHORT',
});
const Int: ComponentTypeEnum = new ComponentTypeClass({
  index: 5124,
  str: 'INT',
});
const UnsignedInt: ComponentTypeEnum = new ComponentTypeClass({
  index: 5125,
  str: 'UNSIGNED_INT',
});
const Float: ComponentTypeEnum = new ComponentTypeClass({
  index: 5126,
  str: 'FLOAT',
});
const Double: ComponentTypeEnum = new ComponentTypeClass({
  index: 5127,
  str: 'DOUBLE',
});
const Bool: ComponentTypeEnum = new ComponentTypeClass({
  index: 35670,
  str: 'BOOL',
});
const HalfFloat: ComponentTypeEnum = new ComponentTypeClass({
  index: 0x8d61,
  str: 'HALF_FLOAT_OES',
});

const typeList = [
  Unknown,
  Byte,
  UnsignedByte,
  Short,
  UnsignedShort,
  Int,
  UnsignedInt,
  Float,
  Double,
  HalfFloat,
];

function from(index: number): ComponentTypeEnum {
  return _from({typeList, index}) as ComponentTypeEnum;
}

function fromString(str: string): ComponentTypeEnum {
  return _fromString({typeList, str}) as ComponentTypeEnum;
}

export const ComponentType = Object.freeze({
  Unknown,
  Byte,
  UnsignedByte,
  Short,
  UnsignedShort,
  Int,
  UnsignedInt: UnsignedInt,
  Float,
  Double,
  Bool,
  HalfFloat,
  from,
  fromString,
});
