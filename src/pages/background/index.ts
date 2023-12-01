import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';

import settingStorage from '@src/shared/storages/settingStorage';

reloadOnUpdate('pages/background');

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate('pages/content/style.scss');

console.log('background loaded');

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.message === 'toggle') {
        const data = await settingStorage.get()
        console.log(data)
        // 回应消息
        sendResponse({ message: "toggle success!" });
    }
});
