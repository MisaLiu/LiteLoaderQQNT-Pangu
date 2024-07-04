import { spacing as PanguSpacing } from 'pangu';
import {
  EQQNTMessageElementType,
  IQQNTMessageData,
  IQQNTMessageElement,
} from './types';

const AtCommandReg = /^\s\//;
const SkipCommandReg = /^!PanguSkip\s/;

export function doPanguTextProcessing(msgData: IQQNTMessageData): IQQNTMessageData {
  const newMsgElements: IQQNTMessageElement[] = [ ...msgData.msgElements ];

  if (newMsgElements[0].textElement) {
    // --- Skip bot commands ---
    // message="/command"
    if (newMsgElements[0].textElement.content.indexOf('/') === 0) {
      return msgData;
    }
    // message="@Bot /command"
    if (
      (newMsgElements[1] && newMsgElements[1].textElement) &&
      (
        newMsgElements[0].textElement.atType !== 0 &&
        AtCommandReg.test(newMsgElements[1].textElement.content)
      )
    ) {
      return msgData;
    }

    // --- Skip extra messages ---
    if (SkipCommandReg.test(newMsgElements[0].textElement.content)) {
      newMsgElements[0].textElement.content = newMsgElements[0].textElement.content.replace(SkipCommandReg, '');
      return {
        ...msgData,
        msgElements: newMsgElements,
      };
    }
  }

  for (const msgElement of newMsgElements) {
    if (msgElement.elementType !== EQQNTMessageElementType.TEXT) continue;
    if (!msgElement.textElement) continue;
    if (msgElement.textElement.atType !== 0) continue;

    const { content } = msgElement.textElement;
    msgElement.textElement.content = PanguSpacing(content);
  }

  return {
    msgId: msgData.msgId,
    peer: msgData.peer,
    msgElements: newMsgElements,
    msgAttributeInfos: msgData.msgAttributeInfos,
  };
}
