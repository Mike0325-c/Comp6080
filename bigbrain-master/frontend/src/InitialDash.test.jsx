import React from 'react';
import { shallow } from 'enzyme'
import InitialDash from './root/InitialDash';
import { Box } from '@mui/material';
import NavigationBtn from './components/NavigationBtn';

describe('inital page', () => {
  it('test the text on the initial page', () => {
    const wrapper = shallow(<InitialDash />);
    const initBox = (wrapper.find(Box));
    expect(initBox).toHaveLength(1);
    expect(initBox.text()).toBe('welcome!');
  });

  it('test the button on the top of initial page', () => {
    const wrapper = shallow(<InitialDash />);
    const navigationBtn = (wrapper.find(NavigationBtn));
    expect(navigationBtn).toHaveLength(1);
  });
})
