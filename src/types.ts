
export enum EQQNTApiCommand {
  SEND_MSG = 'nodeIKernelMsgService/sendMsg',
}

export enum EQQNTMessageElementType {
  TEXT = 1,
  PIC = 2,
  FILE = 3,
  PTT = 4,
  FACE = 6,
  REPLY = 7,
}

export interface IQQNTApiHead {
  eventName: string,
  callbackId?: string,
  type: 'request' | 'response',
}

export interface IQQNTApiPost<IPayload = unknown> extends Array<unknown> {
  0: {
    frameId: number,
    processId: number,
  },
  1: boolean,
  2: string,
  3: [
    IQQNTApiHead,
    [
      string,
      ...IPayload[],
    ]
  ]
}

export interface IQQNTMessageData {
  msgId: string,
  peer: IQQNTMessagePeer,
  msgElements: IQQNTMessageElement[],
  msgAttributeInfos: unknown,
}

export interface IQQNTMessagePeer {
  chatType: number,
  peerUid: string,
  guildId: string,
}

export interface IQQNTMessageElement {
  elementType: EQQNTMessageElementType,
  elementId: string,
}

export interface IQQNTMessageElementText extends IQQNTMessageElement {
  elementType: EQQNTMessageElementType.TEXT,
  textElement: {
    content: string,
    atType: number, // 0=纯文本消息
    atUid: string,
    atTinyId: string,
    atNtUid: string,
  }
}
