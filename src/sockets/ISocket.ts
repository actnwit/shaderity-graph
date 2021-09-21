import {SocketTypeEnum} from '..';

export type SocketClassName = 'InputSocket' | 'OutputSocket';

export interface ISocket {
  get className(): SocketClassName;
  get name(): string;
  get socketType(): SocketTypeEnum;
  get nodeId(): number;
  get argumentId(): number;

  _connectSocketWith(socket: ISocket): void;
}
