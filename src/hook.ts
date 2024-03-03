import { BrowserWindow, WebContents } from 'electron';
import {
  EQQNTApiCommand,
  IQQNTApiPost,
} from './types';

interface WebContentsExtend extends WebContents {
  _events: {
    '-ipc-message': ((...args: unknown[]) => unknown | Array<(...args: unknown[]) => unknown>),
  }
}

const HookApiPreProcesses: {
  command: EQQNTApiCommand,
  hookFn: (payload: unknown[]) => unknown[],
}[] = [];

export function hookQQNTApiCall(window: BrowserWindow) {
  const webContents = window.webContents as WebContentsExtend;
  const ipcUpMsg = webContents._events['-ipc-message']?.[0] || webContents._events['-ipc-message'];

  const ipcUpMsgProxy = new Proxy(ipcUpMsg, {
    apply(target, thisArg, args: IQQNTApiPost) {
      if (!args[3][1] || !(args[3][1] instanceof Array) || typeof args[3][1][0] !== 'string') {
        return target.apply(thisArg, args);
      }

      const newArgs = args;
      try {
        const [ postHead, [ postCommand, ...postPayload ] ] = newArgs[3];

        if (!!postPayload && postPayload.length > 0) {
          for (const hook of HookApiPreProcesses) {
            if (hook.command !== postCommand) continue;
            const newPostPayload = hook.hookFn([ ...postPayload ]);
            newArgs[3] = [
              postHead,
              [
                postCommand,
                ...newPostPayload,
              ]
            ];
          }
        }
      } catch (__) { /* empty */ }

      return target.apply(thisArg, newArgs);
    },
  });

  if (webContents._events['-ipc-message']?.[0]) {
    webContents._events['-ipc-message'][0] = ipcUpMsgProxy;
  } else {
    webContents._events['-ipc-message'] = ipcUpMsgProxy;
  }
}

export function addApiPreProcess(postCommand: EQQNTApiCommand, hookFn: (payload: unknown[]) => unknown[]): number {
  return HookApiPreProcesses.push({
    command: postCommand,
    hookFn,
  });
}
