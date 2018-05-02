[![Build Status](https://travis-ci.org/nicolaisueper/react-hashrouter.svg?branch=master)](https://travis-ci.org/nicolaisueper/react-hashrouter)
[![Coverage](https://codecov.io/gh/nicolaisueper/react-hashrouter/branch/master/graph/badge.svg)](https://codecov.io/gh/nicolaisueper/react-hashrouter)
![Zero Dependencies](https://img.shields.io/badge/0-Zero%20Dependencies-green.svg)


# react-hashrouter
> A simple hashrouter for React with a fluent API

## Install
```
$ npm install --save react-hashrouter
```

## Usage example
```javascript
import React from 'react';
import Router, {Link} from 'react-hashrouter';

export const Index = ({navigateTo}) => (
  <div>
    <h1>Index page</h1>
    <Link to="/test/1">Go to test #1</Link>
    {/* Or alternatively */}
    <Button type="button" onClick={() => navigateTo('/test/2')}>Go to test #2</Button>
  </div>
);

export const Test = ({testId}) => <h1>Test #{testId}</h1>;

export const App = props => (
  <Router>{routes =>
     routes
         .add('/', Index)
         .add('/test/:testId', Test)
         .fallback(<h1>Not found!</h1>)
  }</Router>
);
```

## Future goals

- Expose a 'router' object to the routed component
    - `addRoute(path, component)` or `setRoute(path, component)` for lazy loaded routes
    - `navigateTo(path)` as implemented
- Allow lazy loading of components
    - Accept a Promise inside the routeMapper

## License
MIT © Nicolai Süper (nico@k40s.net)