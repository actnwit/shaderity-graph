import {SocketTypeEnum} from '..';
import {INode} from '../node/INode';

export type SocketClassName =
  | 'ConnectableInputSocket'
  | 'ConnectableOutputSocket'
  | 'AttributeInputSocket'
  | 'VaryingInputSocket'
  | 'UniformInputSocket';

export interface ISocket {
  get className(): SocketClassName;
  get name(): string;
  get socketType(): SocketTypeEnum;
  get node(): INode;
  get argumentId(): number;
  isInputSocket(): boolean;
}
