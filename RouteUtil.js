export function mapParametersToArgs(parameters = [], urlPath) {
  return parameters.reduce(
    (acc, { index, name }) => ({ ...acc, [name]: splitPath(urlPath)[index] }),
    {}
  );
}

export const findMatchingRoute = (routes = [], urlPath) =>
  routes
    .filter(
      route =>
        route.path && splitPath(route.path).length === splitPath(urlPath).length
    )
    .filter(route => route.matcher && route.matcher.exec(urlPath))
    .map(route => ({
      ...route,
      args: mapParametersToArgs(route.parameters, urlPath)
    }))
    .pop();

export const generateRouteMatcher = routePath => {
  const routeQuery =
    '\\/' +
    splitPath(routePath)
      .map(segment => (isRouteParam(segment) ? '(\\w+)' : segment))
      .join('/');
  return new RegExp(routeQuery);
};

export const getPathParameters = path =>
  splitPath(path)
    .map((segment, index) => ({ segment, index }))
    .filter(({ segment }) => segment[0] === ':')
    .map(param => ({
      index: param.index,
      name: param.segment.substring(1)
    }));

export const getFallbackRoute = routes => routes.filter(r => r.fallback).pop();

export const isRoot = path => {
  if (!path) return true;
  const p = path.trim();
  return p === '/' || p === '';
};

export const isRouteParam = segment => {
  if (!segment) return false;
  return segment[0] === ':';
};

export const normalizePath = path => {
  if (!path) return '/';
  if (path.startsWith('#')) {
    return normalizePath(path.substring(1));
  }
  if (!path.startsWith('/')) {
    return normalizePath('/' + path);
  }
  if (path.length > 1 && path.endsWith('/')) {
    return normalizePath(path.substring(0, path.length - 1));
  }
  return path;
};

export const routeMapper = () => ({
  routes: [],
  add: function(path, component) {
    this.routes.push({
      path: normalizePath(path),
      matcher: generateRouteMatcher(path),
      parameters: getPathParameters(path),
      component
    });
    return this;
  },
  fallback: function(component) {
    this.routes.push({
      component,
      fallback: true
    });
    return this;
  }
});

export const splitPath = (path = '/') => path.split('/').filter(Boolean);
