import React from 'react';
import * as ru from './RouteUtil';
import { routeMapper } from './RouteUtil';
import { findMatchingRoute } from './RouteUtil';
import { mapParametersToArgs } from './RouteUtil';
import { getFallbackRoute } from './RouteUtil';

describe('RouteUtil', function() {
  describe('mapParametersToArgs(parameters, urlPath)', function() {
    it('should map URL parameters to component arguments', function() {
      const url = '/post/1234/likes';
      const parameters = [
        {
          index: 1,
          name: 'id'
        },
        {
          index: 2,
          name: 'subRoute'
        }
      ];
      expect(mapParametersToArgs(parameters, url)).toEqual({
        id: '1234',
        subRoute: 'likes'
      });
    });
    it('should handle undefined', function() {
      expect(mapParametersToArgs()).toEqual({});
    });
  });
  describe('generateRouteMatcher(path)', function() {
    it('should generate a RegExp for a given route path', function() {
      const routePath = '/author/:name/:details';
      const route = '/author/nsueper/posts';
      const routeMatcher = ru.generateRouteMatcher(routePath);
      expect(routeMatcher.exec(route)).toBeTruthy();
    });
  });
  describe('getPathParameters', function() {
    it('should handle undefined', function() {
      expect(ru.getPathParameters()).toEqual([]);
    });
    it('should parse arguments properly', function() {
      const routePath = '/post/:id/:arg';
      const parsed = ru.getPathParameters(routePath);
      expect(parsed).toEqual([
        {
          index: 1,
          name: 'id'
        },
        {
          index: 2,
          name: 'arg'
        }
      ]);
    });
  });
  describe('isRoot(path)', function() {
    it('should handle undefined as root', function() {
      expect(ru.isRoot()).toBe(true);
    });
    it('should return true when path is "rooty"', function() {
      const slash = ru.isRoot('/');
      const space = ru.isRoot(' ');
      expect(slash).toBe(true);
      expect(space).toBe(true);
    });
    it('should return false when path is "non-rooty"', function() {
      expect(ru.isRoot('/new')).toBe(false);
    });
  });
  describe('isRouteParam(segment)', function() {
    it('should handle undefined', function() {
      expect(ru.isRouteParam(undefined)).toBe(false);
    });
    it('should detect route params', function() {
      expect(ru.isRouteParam(':id')).toBe(true);
    });
    it('should only equal to true if the notation is correct', function() {
      expect(ru.isRouteParam('id:post')).toBe(false);
    });
  });
  describe('normalizePath(path)', function() {
    it('should remove any leading #', function() {
      expect(ru.normalizePath('#/new')).toEqual('/new');
    });
    it('should remove any trailing slashes', function() {
      expect(ru.normalizePath('/new/')).toEqual('/new');
    });
    it('should add a leading slash if missing', function() {
      expect(ru.normalizePath('new')).toEqual('/new');
    });
    it('should handle all together', function() {
      expect(ru.normalizePath('#/post/:id/')).toEqual('/post/:id');
    });
    it('should treat falsy values as root', function() {
      expect(ru.normalizePath()).toEqual('/');
    });
  });
  describe('routeMapper', function() {
    it('should map routes properly', function() {
      const rm = ru.routeMapper();
      const route = 'post/:id';
      const cmp = props => <div>component</div>;
      const fallbackCmp = props => <div>fallback</div>;

      const result = rm.add(route, cmp).fallback(fallbackCmp);
      const [mappedRoute, fallback] = result.routes;

      expect(mappedRoute.path).toEqual('/post/:id');
      expect(mappedRoute.component).toEqual(cmp);
      expect(mappedRoute.matcher.exec('/post/1234')).toBeTruthy();
      expect(mappedRoute.parameters).toEqual([{ index: 1, name: 'id' }]);
      expect(fallback.component).toEqual(fallbackCmp);
    });
  });
  describe('splitPath', function() {
    it('should handle undefined', function() {
      expect(ru.splitPath()).toEqual([]);
    });
    it('should split the path by slash', function() {
      expect(ru.splitPath('/post/1')).toEqual(['post', '1']);
    });
  });
  describe('findMatchingRoute(routes, urlPath)', function() {
    it('should find matching routes', function() {
      const { routes } = routeMapper()
        .add('/test/:id', () => 'test')
        .add('/blargh', () => 'blargh')
        .add('/tests/:id', () => 'test2');
      const matchingRouteWithArgs = findMatchingRoute(routes, '/test/1234');
      expect(matchingRouteWithArgs.component()).toEqual('test');
      expect(matchingRouteWithArgs.parameters).toEqual([
        { index: 1, name: 'id' }
      ]);
      expect(matchingRouteWithArgs.args).toEqual({ id: '1234' });

      const matchingRouteSimple = findMatchingRoute(routes, '/blargh');
      expect(matchingRouteSimple.component()).toEqual('blargh');
      expect(matchingRouteSimple.args).toEqual({});
      expect(matchingRouteSimple.parameters).toEqual([]);
    });
    it('should handle undefined', function() {
      expect(findMatchingRoute(undefined, undefined)).toEqual(undefined);
    });
  });
  describe('getFallbackRoute(routes)', function() {
    it('should return the fallback route', function() {
      const { routes } = routeMapper()
        .add('/test/:id', () => 'test')
        .fallback(() => 'Fallback');
      expect(getFallbackRoute(routes).component()).toEqual('Fallback');
    });
  });
});
