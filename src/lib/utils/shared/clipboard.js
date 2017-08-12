/* @flow */
import {
  COPY_UNSUPPORTED_BROWSER,
  SOMETHING_WENT_WRONG,
  ClientError,
} from '~/src/lib/errors/shared';
import ua, { type UserAgent } from '~/src/lib/ua/shared';

const isSupported = (userAgent: UserAgent) => {
  if (typeof document === 'undefined') {
    return (
      (
        userAgent.browser.name === 'Firefox' &&
        ua.checkVersion(userAgent.browser.version, '>=', '41')
      ) ||
      userAgent.browser.name === 'IE' ||
      userAgent.browser.name === 'Edge' || (
        userAgent.browser.name === 'Chrome' &&
        ua.checkVersion(userAgent.browser.version, '>=', '43')
      ) || (
        userAgent.browser.name === 'Safari' &&
        ua.checkVersion(userAgent.browser.version, '>=', '10')
      ) || (
        userAgent.browser.name === 'Opera' &&
        ua.checkVersion(userAgent.browser.version, '>=', '30')
      ) || (
        userAgent.browser.name === 'Android Browser' &&
        ua.checkVersion(userAgent.browser.version, '>=', '4.4')
      )
    );
  }

  return (
    document.queryCommandSupported instanceof Function &&
    document.queryCommandSupported('copy') &&
    // Firefox & iOS reports true for queryCommandSupported, but doesn't work
    // see http://caniuse.com/#feat=clipboard
    !(
      (
        userAgent.browser.name === 'Firefox' &&
        ua.checkVersion(userAgent.browser.version, '<', '41')
      ) || (
        userAgent.os.name === 'iOS'
      )
    )
  ) || (
    // Chrome reports false for queryCommandSupported, but actually works
    userAgent.browser.name === 'Chrome' &&
    ua.checkVersion(userAgent.browser.version, '>=', '43')
  );
};

const copy = (
  data: string,
  userAgent: UserAgent,
): Promise<void> => {
  if (typeof document === 'undefined' || !document.addEventListener) {
    return Promise.reject(new ClientError(SOMETHING_WENT_WRONG));
  }
  if (!isSupported(userAgent)) {
    return Promise.reject(new ClientError(COPY_UNSUPPORTED_BROWSER));
  }

  const _data = { 'text/plain': data };
  let _bogusSelection = false;

  const listener = (e) => {
    for (const [key, value] of Object.entries(_data)) {
      // $FlowFixMe
      e.clipboardData.setData(key, value);
    }
    e.preventDefault();
  };
  const cleanup = () => {
    document.removeEventListener('copy', listener);
    if (_bogusSelection) {
      window.getSelection().removeAllRanges();
    }
    _bogusSelection = false;
  };

  const bogusSelect = () => {
    const sel = document.getSelection();
    // If "nothing" is selected...
    if (
      // $FlowFixMe
      !document.queryCommandEnabled('copy') &&
      sel != null &&
      sel.isCollapsed
    ) {
      // ... temporarily select the entire body.
      //
      // We select the entire body because:
      // - it's guaranteed to exist,
      // - it works (unlike, say, document.head, or phantom element that is
      //   not inserted into the DOM),
      // - it doesn't seem to flicker (due to the synchronous copy event), and
      // - it avoids modifying the DOM (can trigger mutation observers).
      //
      // Because we can't do proper feature detection (we already checked
      // document.queryCommandEnabled("copy") , which actually gives a false
      // negative for Blink when nothing is selected) and UA sniffing is not
      // reliable (a lot of UA strings contain "Safari"), this will also
      // happen for some browsers other than Safari. :-()
      const range = document.createRange();
      range.selectNodeContents((document.body: any));
      sel.removeAllRanges();
      sel.addRange(range);
      _bogusSelection = true;
    }
  };

  document.addEventListener('copy', listener);

  return new Promise((resolve, reject) => {
    const triggerCopy = (tryBogusSelect: boolean) => {
      try {
        if (document.execCommand('copy')) {
          // document.execCommand is synchronous: http://www.w3.org/TR/2015/WD-clipboard-apis-20150421/#integration-with-rich-text-editing-apis
          // So we can call resolve() back here.
          cleanup();
          resolve();
        } else if (!tryBogusSelect) {
          bogusSelect();
          triggerCopy(true);
        } else {
          cleanup();
          throw new ClientError(SOMETHING_WENT_WRONG);
        }
      } catch (e) {
        cleanup();
        reject(e);
      }
    };
    triggerCopy(false);
  });
};

export default { isSupported, copy };
