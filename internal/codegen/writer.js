/* @flow */
import crypto from 'crypto';

import type CodegenDirectory from './CodegenDirectory';

export const writeFile = async (
  codegenDir: CodegenDirectory,
  filename: string,
  text: string,
  hash: string,
  formatText: (text: string, hash: string) => string,
): Promise<void> => {
  const oldContent = await codegenDir.read(filename);
  if (hash === extractHash(oldContent)) {
    codegenDir.markUnchanged(filename);
    return;
  }

  if (codegenDir.onlyValidate) {
    codegenDir.markUpdated(filename);
    return;
  }

  await codegenDir.writeFile(
    filename,
    formatText(text, `@hash ${hash}`),
  );
}

export const formatJSText = (text: string, hash: string) => `/* @flow */
/* eslint-disable */
// ${hash}

'use strict';

${text}
`;

export const formatCSSText = (text: string, hash: string) => `/* ${hash} */
${text}
`;

const extractHash = (text: ?string): ?string => {
  if (text == null) {
    return null;
  }

  if (/<<<<<|>>>>>/.test(text)) {
    // looks like a merge conflict
    return null;
  }

  const match = text.match(/@hash (\w{32})\b/m);
  return match && match[1];
};

export const hash = (text: string): string => {
  return crypto.createHash('md5').update(text).digest('hex');
}
