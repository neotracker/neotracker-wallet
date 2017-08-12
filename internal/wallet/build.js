/* @flow */
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HappyPack from 'happypack';

import appRootDir from 'app-root-dir';
import fs from 'fs-extra';
import path from 'path';
import rimraf from 'rimraf';
import webpack from 'webpack';

import compileJSS2CSS from '../jss2css/compile';
import pkg from '../../package.json';

export default async () => {
  const outputPath = path.resolve(
    appRootDir.get(),
    './build/wallet/',
  );
  rimraf.sync(outputPath);

  await compileJSS2CSS({
    outputDir: path.resolve(
      appRootDir.get(),
      './__generated__/css',
    ),
    jss2cssPaths: [
      './node_modules/material-ui',
      './src/shared',
      './src/lib',
      './src/wallet/shared',
    ],
  });
  const compiler = webpack({
    entry: {
      index: path.resolve(
        appRootDir.get(),
        './src/wallet/client/index.js',
      ),
    },
    output: {
      path: outputPath,
      filename: '[name].js',
      chunkFilename: '[name].js',
      libraryTarget: 'var',
      publicPath: '/',
    },
    target: 'web',
    devtool: 'source-map',
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
      mainFields: ['browser', 'jsnext:main', 'module', 'main'],
    },
    plugins: [
      new webpack.ProgressPlugin(),
      new webpack.DefinePlugin({
        'process.env.BUILD_FLAG_IS_CLIENT': JSON.stringify(true),
        'process.env.BUILD_FLAG_IS_SERVER': JSON.stringify(false),
        'process.env.BUILD_FLAG_IS_DEV': JSON.stringify(false),
        'process.env.BUILD_FLAG_IS_TEST': JSON.stringify(false),
        'process.env.BUILD_FLAG_IS_FAST_E2E': JSON.stringify(false),
        'process.env.BUILD_FLAG_USE_DEVDB': JSON.stringify(false),
        'process.env.BUILD_FLAG_IS_STAGING': JSON.stringify(false),
        'process.env.NODE_ENV': "'production'",
      }),
      new webpack.LoaderOptionsPlugin({ minimize: true }),
      new HappyPack({
        id: 'happypack-javascript',
        verbose: false,
        threads: 16,
        loaders: [{
          path: 'babel-loader',
          query: {
            babelrc: false,

            presets: [
              'react',
              'stage-3',
              ['env', {
                targets: {
                  browsers: pkg.browserslist,
                },
                modules: false,
                useBuiltIns: false,
                loose: true,
              }],
            ],

            plugins: [
              path.resolve(appRootDir.get(), './src/lib/transform/flow'),
              path.resolve(appRootDir.get(), './src/lib/transform/lodash'),
              path.resolve(appRootDir.get(), './src/lib/transform/root'),
              ['lodash', { id: 'lodash-es' }],
              'babel-plugin-idx',
              'relay',
              [path.resolve(appRootDir.get(), './src/lib/jss2css/transform/styleSheet'), {
                isClient: true,
              }],
              path.resolve(appRootDir.get(), './src/lib/jss2css/transform/removeStyleSheet'),
              ['react-remove-properties', {
                properties: ['data-test', 'data-test-state'],
              }],
              'transform-class-properties',
              'transform-es2015-classes',
              ['import-inspector', {
                serverSideRequirePath: true,
                webpackRequireWeakId: true,
              }],
              'syntax-dynamic-import',
            ].filter(Boolean),
          },
        }],
      }),
      new ExtractTextPlugin({
        filename: '[name].css',
        allChunks: true,
      }),
    ],
    module: {
      rules:[
        {
          test: /\.jsx?$/,
          loader: 'happypack/loader?id=happypack-javascript',
          include: [
            './src/client',
            './src/shared',
            './src/lib',
            './src/wallet',
            './node_modules',
          ].map(jsPath => path.resolve(appRootDir.get(), jsPath)),
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              { loader: 'css-loader', options: { importLoaders: 1 } },
              'postcss-loader',
            ],
          }),
        },
        {
          test: new RegExp(
            `\\.(${[
              'jpg',
              'jpeg',
              'png',
              'gif',
              'ico',
              'eot',
              'svg',
              'ttf',
              'woff',
              'woff2',
              'otf',
            ].join('|')})$`,
            'i',
          ),
          loader: 'file-loader',
          query: {
            publicPath: '/',
            emitFile: true,
          },
        },
      ],
    },
    node: {
      console: false,
      global: true,
      process: true,
      __filename: false,
      __dirname: true,
      Buffer: true,
      setImmediate: true,
      util: true,
    },
  });
  await new Promise((resolve, reject) => compiler.run((error, stats) => {
    if (error) {
      // eslint-disable-next-line
      console.log(stats.toString());
      reject(error);
    } else if (stats.compilation.errors.length > 0) {
      // eslint-disable-next-line
      console.log(stats.toString());
      reject(new Error('Compilation failed'));
    } else {
      resolve();
    }
  }));
  await fs.copy(
    path.resolve(
      appRootDir.get(),
      './src/wallet/client/index.html',
    ),
    path.resolve(
      outputPath,
      './index.html',
    ),
  );
  // eslint-disable-next-line
  console.log('Done building.');
};
