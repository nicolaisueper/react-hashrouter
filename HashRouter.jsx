import React, { Component } from 'react';
import {
  findMatchingRoute,
  getFallbackRoute,
  normalizePath,
  routeMapper
} from './RouteUtil';

export class HashRouter extends Component {
  constructor(props) {
    super(props);
    this.handleHashChange = this.handleHashChange.bind(this);
    this.navigateTo = this.navigateTo.bind(this);

    const { routes } = props.children(routeMapper());
    this.routes = routes;

    this.state = {
      currentRoute: normalizePath(window.location.hash)
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', this.handleHashChange);
    window.location.hash = this.state.currentRoute;
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.handleHashChange);
  }

  handleHashChange({ newURL }) {
    const normalized = normalizePath(newURL.split('#').pop());
    this.setState({ currentRoute: normalized });
  }

  navigateTo(path) {
    this.setState({ currentRoute: normalizePath(path) });
  }

  render() {
    const matchingRoute =
      findMatchingRoute(this.routes, this.state.currentRoute) ||
      getFallbackRoute(this.routes);
    if (!matchingRoute) return <div>"{this.state.currentRoute}" not found</div>;
    const CurrentComponent = matchingRoute.component;
    return (
      <CurrentComponent
        {...matchingRoute.args || {}}
        navigateTo={this.navigateTo}
      />
    );
  }
}
