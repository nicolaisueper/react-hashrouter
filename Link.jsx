import React from 'react';
import { normalizePath } from './RouteUtil';

export default ({ to, children }) => (
  <a href={'#' + normalizePath(to)}>{children}</a>
);
