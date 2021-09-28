import {SocketTypeEnum} from '..';

export type SocketClassName = 'InputSocket' | 'OutputSocket';

export interface ISocket {
  get className(): SocketClassName;
  get socketType(): SocketTypeEnum;
  get nodeId(): number;

  _connectSocketWith(socket: ISocket): void;
}
