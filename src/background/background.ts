'use strict';

import { Request, sendMessageActiveTab } from '../utils/message';
import * as keystore from '../utils/keystore';

chrome.runtime.onMessage.addListener(
  async (
    request: Request,
    sender: chrome.runtime.MessageSender,
    sendResponse
  ): Promise<void> => {
    const cleanedData: string = request.data.trim();
    if (cleanedData === '') {
      return;
    }
    switch (request.request) {
      case 'debabbleText':
        const debabbledText: string = await keystore.debabbleWithAllEntries(
          cleanedData
        );
        if (debabbledText !== '') {
          sendMessageActiveTab(
            { request: 'displayText', data: debabbledText },
            (): void => {}
          );
        } else {
          sendMessageActiveTab(
            { request: 'hidePopup', data: debabbledText },
            (): void => {}
          );
        }
        break;
      default:
        break;
    }
  }
);
