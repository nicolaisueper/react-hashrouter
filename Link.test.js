import React from 'react';
import Link from './Link';
import { mount } from 'enzyme';

describe('<Link/>', function() {
  it('should map the given path to a hash url', function() {
    const wrapper = mount(<Link to="/test/" />);
    expect(wrapper.find('a').prop('href') === '/#/test');
  });
});
