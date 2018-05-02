import React from 'react';
import { mount, render } from 'enzyme';
import { HashRouter } from './HashRouter';
import { normalizePath } from './RouteUtil';

const Index = () => <h1>Index</h1>;
const Test = () => <h1>Test</h1>;
const Parametrized = ({ param }) => <h1>It's {param}</h1>;
const Fallback = () => <h1>Fallback</h1>;

const routeConfig = routes =>
  routes
    .add('/', Index)
    .add('/test', Test)
    .add('/paramRoute/:param', Parametrized)
    .fallback(Fallback);

const dispatchHashChangeEvent = newUrl => {
  const event = new Event('hashchange');
  event.newURL = '#' + normalizePath(newUrl);
  window.dispatchEvent(event);
};

const mockEventListeners = () => {
  const origAdd = window.addEventListener;
  const origDel = window.removeEventListener;
  window.addEventListener = jest.fn();
  window.removeEventListener = jest.fn();
  return () => {
    window.addEventListener = origAdd;
    window.removeEventListener = origDel;
  };
};

describe('<HashRouter />', function() {
  it('should (de)register event listeners', function() {
    const unmock = mockEventListeners();
    const wrapper = mount(<HashRouter>{routeConfig}</HashRouter>);
    const handleHashChange = wrapper.instance().handleHashChange;
    expect(window.addEventListener).toHaveBeenCalledWith(
      'hashchange',
      handleHashChange
    );
    wrapper.unmount();
    expect(window.removeEventListener).toHaveBeenCalledWith(
      'hashchange',
      handleHashChange
    );
    unmock();
  });
  it('should render without crashing', function() {
    const wrapper = mount(<HashRouter>{routeConfig}</HashRouter>);
    expect(wrapper.find('h1').text()).toEqual('Index');
  });
  it('should react to the `hashchange` event', function() {
    const wrapper = mount(<HashRouter>{routeConfig}</HashRouter>);
    dispatchHashChangeEvent('/test');
    expect(wrapper.state('currentRoute')).toEqual('/test');
  });
  it('should navigate using "navigateTo()"', function() {
    const wrapper = mount(<HashRouter>{routeConfig}</HashRouter>);
    wrapper.instance().navigateTo('test');
    wrapper.update();
    expect(wrapper.state('currentRoute')).toEqual('/test');
  });
  it('should pass route parameters to the component', function() {
    const wrapper = mount(<HashRouter>{routeConfig}</HashRouter>);
    dispatchHashChangeEvent('/paramRoute/parametrized');
    wrapper.update();
    expect(wrapper.state('currentRoute')).toEqual('/paramRoute/parametrized');
    expect(wrapper.find('h1').text()).toEqual("It's parametrized");
  });
  it('should render the fallback route if no matching route exists', function() {
    const wrapper = mount(<HashRouter>{routeConfig}</HashRouter>);
    dispatchHashChangeEvent('/route/does/not/exist');
    wrapper.update();
    expect(wrapper.find('h1').text()).toEqual('Fallback');
  });
  it('should render own fallback route if no fallback route was given', function() {
    const wrapper = mount(
      <HashRouter>{routes => routes.add('/', Index)}</HashRouter>
    );
    dispatchHashChangeEvent('/route/does/not/exist');
    wrapper.update();
    expect(wrapper.find('div').text()).toEqual(
      '"/route/does/not/exist" not found'
    );
  });
});
