/* @flow */
/* eslint-disable */
import 'babel-polyfill';

import gulp from 'gulp';

import buildWallet from './internal/wallet/build';

gulp.task('build:wallet', () => buildWallet());
