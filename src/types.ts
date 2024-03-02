
export enum EQQNTApiCommand {
  SEND_MSG = 'nodeIKernelMsgService/sendMsg',
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
