import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { shallow } from 'enzyme';
import Dashboard from './root/Dashboard'

describe('RegisterForm', () => {
  it('displays a form for register', () => {
    const wrapper = shallow(<Router><Dashboard /></Router>);
    expect(wrapper.find(Dashboard)).toHaveLength(1);
  });
});
