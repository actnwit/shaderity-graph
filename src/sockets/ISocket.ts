import {SocketTypeEnum} from '..';
import {INode} from '../node/INode';

export type SocketClassName = 'InputSocket' | 'OutputSocket';

export interface ISocket {
  get className(): SocketClassName;
  get name(): string;
  get socketType(): SocketTypeEnum;
  get node(): INode;
  get argumentId(): number;

  _connectSocketWith(socket: ISocket): void;
}
