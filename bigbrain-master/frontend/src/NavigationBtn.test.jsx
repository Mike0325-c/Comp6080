import React from 'react';
import { shallow } from 'enzyme'
import NaviBtnTest, { InitialTap } from './components/NaviBtnTest';

describe('inital page', () => {
  it('test the text on the initial page', () => {
    const wrapper = shallow(<NaviBtnTest />);
    const tab = (wrapper.find(InitialTap));
    expect(tab).toHaveLength(3);
  });

  it('should have a tab for dashboard', () => {
    const wrapper = shallow(<NaviBtnTest />);
    const home = wrapper.findWhere((n) => n.prop('id') === 'homepage');
    expect(home.props('href').href).toBe('/');
    const loginpage = wrapper.findWhere((n) => n.prop('id') === 'loginpage');
    expect(loginpage.props('href').href).toBe('/login');
    const registerpage = wrapper.findWhere((n) => n.prop('id') === 'registerpage');
    expect(registerpage.props('href').href).toBe('/register');
  });
})
