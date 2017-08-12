/* @flow */
import fs from 'fs';
import path from 'path';
// $FlowFixMe
import { promisify } from 'util';

const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

type Stats = {
  deleted: Array<string>,
  updated: Array<string>,
  created: Array<string>,
  unchanged: Array<string>,
};

export default class CodegenDirectory {
  changes: Stats;
  _initialized: boolean;
  _files: Set<string>;
  _dir: string;
  onlyValidate: boolean;

  constructor(
    dir: string,
    options: {
      onlyValidate?: boolean,
    } = {},
  ) {
    this.onlyValidate = !!options.onlyValidate;
    this._initialized = false;
    this._files = new Set();
    this.changes = {
      deleted: [],
      updated: [],
      created: [],
      unchanged: [],
    };
    this._dir = dir;
  }

  async _init(): Promise<void> {
    if (this._initialized) {
      return;
    }
    this._initialized = true;

    const existsDir = await exists(this._dir);
    if (existsDir) {
      const statDir = await stat(this._dir);
      if (!statDir.isDirectory()) {
        throw new Error(`Expected '${this._dir}' to be a directory.`);
      }
    } else if (!this.onlyValidate) {
      await mkdir(this._dir);
    }
  }

  async read(filename: string): Promise<?string> {
    await this._init();

    const filePath = path.join(this._dir, filename);
    const existsFilePath = await exists(filePath);
    if (existsFilePath) {
      return readFile(filePath, 'utf8');
    }
    return null;
  }

  markUnchanged(filename: string) {
    this._addGenerated(filename);
    this.changes.unchanged.push(filename);
  }

  /**
   * Marks a files as updated or out of date without actually writing the file.
   * This is probably only be useful when doing validation without intention to
   * actually write to disk.
   */
  markUpdated(filename: string) {
    this._addGenerated(filename);
    this.changes.updated.push(filename);
  }

  async writeFile(filename: string, content: string): Promise<void> {
    await this._init();

    this._addGenerated(filename);
    const filePath = path.join(this._dir, filename);
    const existsFilePath = await exists(filePath);
    if (existsFilePath) {
      const existingContent = await readFile(filePath, 'utf8');
      if (existingContent === content) {
        this.changes.unchanged.push(filename);
      } else {
        await this._writeFile(filePath, content);
        this.changes.updated.push(filename);
      }
    } else {
      await this._writeFile(filePath, content);
      this.changes.created.push(filename);
    }
  }

  async _writeFile(filePath: string, content: string): Promise<void> {
    await this._init();

    if (!this.onlyValidate) {
      await writeFile(filePath, content, 'utf8');
    }
  }

  /**
   * Deletes all non-generated files, except for invisible "dot" files (ie.
   * files with names starting with ".").
   */
  async deleteExtraFiles(): Promise<void> {
    await this._init();

    const files = await readdir(this._dir);
    await Promise.all(files.map(async (actualFile) => {
      if (!this._files.has(actualFile) && !/^\./.test(actualFile)) {
        if (!this.onlyValidate) {
          await unlink(path.join(this._dir, actualFile));
        }
        this.changes.deleted.push(actualFile);
      }
    }));
  }

  getPath(filename: string): string {
    return path.join(this._dir, filename);
  }

  _addGenerated(filename: string): void {
    if (this._files.has(filename)) {
      throw new Error(
        `CodegenDirectory: Tried to generate '${filename}' twice in ` +
        `'${this._dir}'.`
      );
    }
    this._files.add(filename);
  }
}
