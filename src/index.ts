import { BrowserWindow } from 'electron';
import { hookQQNTApiCall, addApiPreProcess } from './hook';
import { EQQNTApiCommand, IQQNTMessageData } from './types';
import { doPanguTextProcessing } from './pangu';

addApiPreProcess(EQQNTApiCommand.SEND_MSG, (payload) => {
  const newPayload = payload;
  newPayload[0] = doPanguTextProcessing(payload[0] as IQQNTMessageData);
  return newPayload;
});

export function onBrowserWindowCreated(window: BrowserWindow) {
  hookQQNTApiCall(window);
}