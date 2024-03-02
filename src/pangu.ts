import { spacing as PanguSpacing } from 'pangu';
import {
  EQQNTMessageElementType,
  IQQNTMessageData,
  IQQNTMessageElement,
  IQQNTMessageElementText,
} from './types';

export function doPanguTextProcessing(msgData: IQQNTMessageData): IQQNTMessageData {
  const newMsgElements: IQQNTMessageElement[] = [ ...msgData.msgElements ];

  for (const msgElement of newMsgElements) {
    if (msgElement.elementType !== EQQNTMessageElementType.TEXT) continue;
    if ((msgElement as IQQNTMessageElementText).textElement.atType !== 0) continue;

    const { content } = (msgElement as IQQNTMessageElementText).textElement;
    (msgElement as IQQNTMessageElementText).textElement.content = PanguSpacing(content);
  }

  return {
    msgId: msgData.msgId,
    peer: msgData.peer,
    msgElements: newMsgElements,
    msgAttributeInfos: msgData.msgAttributeInfos,
  };
}
