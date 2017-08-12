/* @flow */
import watchman from 'fb-watchman';

export type WatchmanExpression = Array<string | WatchmanExpression>;
export type FileFilter = (filename: string) => boolean;
type WatchmanChange = {
  name: string,
  exists: boolean,
};
type WatchmanChanges = {
  files?: Array<WatchmanChange>,
};

export async function queryFiles(
  baseDir: string,
  expression: WatchmanExpression,
  filter: FileFilter,
): Promise<Set<string>> {
  const client = new PromiseClient();
  const watchResp = await client.watchProject(baseDir);
  const resp = await client.command(
    'query',
    watchResp.root,
    makeQuery(watchResp.relativePath, expression),
  );
  client.end();
  return updateFiles(new Set(), filter, resp.files).current;
}

async function watch(
  subscriptionName: string,
  baseDir: string,
  expression: WatchmanExpression,
  callback: (changes: WatchmanChanges) => any,
): Promise<void> {
  const client = new PromiseClient();
  const watchResp = await client.watchProject(baseDir);

  await makeSubscription(
    client,
    subscriptionName,
    watchResp.root,
    watchResp.relativePath,
    expression,
    callback,
  );
}

export async function watchFiles(
  subscriptionName: string,
  baseDir: string,
  expression: WatchmanExpression,
  filter: FileFilter,
  callback: (files: {
    current: Set<string>,
    changed: Array<string>,
    deleted: Array<string>,
  }) => any,
): Promise<void> {
  let current = new Set();
  await watch(subscriptionName, baseDir, expression, changes => {
    if (!changes.files) {
      // Watchmen fires a change without files when a watchman state changes,
      // for example during an hg update.
      return;
    }
    const { current: newCurrent, changed, deleted } =
      updateFiles(current, filter, changes.files);
    current = newCurrent;
    callback({ current, changed, deleted });
  });
}

export async function watchChanges(
  subscriptionName: string,
  baseDir: string,
  expression: WatchmanExpression,
  filter: FileFilter,
  onChange: (
    changedFiles: Array<string>,
    deletedFiles: Array<string>,
  ) => Promise<any>,
): Promise<void> {
  let compiling = false;
  let needsCompiling = false;
  let filesToCompile = [];

  watchFiles(
    subscriptionName,
    baseDir,
    expression,
    filter,
    async ({ changed, deleted }) => {
      filesToCompile.push({ changed, deleted });
      if (compiling) {
        return;
      }
      compiling = true;
      while (filesToCompile.length > 0) {
        const { changed, deleted } = filesToCompile.pop();
        await onChange(changed, deleted);
      }
      compiling = false;
    },
  );
}

async function makeSubscription(
  client: PromiseClient,
  subscriptionName: string,
  root: string,
  relativePath: string,
  expression: WatchmanExpression,
  callback: (changes: WatchmanChanges) => any,
): Promise<void> {
  client.on('subscription', resp => {
    if (resp.subscription === subscriptionName) {
      callback(resp);
    }
  });
  await client.command(
    'subscribe',
    root,
    subscriptionName,
    makeQuery(relativePath, expression),
  );
}

function makeQuery(relativePath: string, expression: WatchmanExpression) {
  return {
    expression,
    fields: ['name', 'exists'],
    relative_root: relativePath,
  };
}

function updateFiles(
  files: Set<string>,
  filter: FileFilter,
  fileChanges: Array<WatchmanChange>,
): { current: Set<string>, changed: Array<string>, deleted: Array<string> } {
  const current = new Set(files);
  const changed = [];
  const deleted = [];
  fileChanges.forEach(({name, exists}) => {
    if (filter(name)) {
      if (exists) {
        changed.push(name);
        current.add(name);
      } else {
        deleted.push(name);
        current.delete(name);
      }
    } else {
      current.delete(name);
    }
  });
  return { current, changed, deleted };
}

class PromiseClient {
  _client: any;

  constructor() {
    this._client = new watchman.Client();
  }

  command(...args: Array<mixed>): Promise<any> {
    return new Promise((resolve, reject) => {
      this._client.command(args, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }

  async watchProject(
    baseDir: string,
  ): Promise<{
    root: string,
    relativePath: string,
  }> {
    const resp = await this.command('watch-project', baseDir);
    if ('warning' in resp) {
      console.error('Warning:', resp.warning);
    }
    return {
      root: resp.watch,
      relativePath: resp.relative_path,
    };
  }

  on(event: string, callback: Function): void {
    this._client.on(event, callback);
  }

  end(): void {
    this._client.end();
  }
}
