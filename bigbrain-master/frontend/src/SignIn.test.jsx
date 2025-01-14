import React from 'react';
import { shallow } from 'enzyme'
import { Box, Button, TextField } from '@mui/material';
import SignInTest from './components/SignInTest';

describe('inital page', () => {
  it('test the text on the initial page', () => {
    const wrapper = shallow(<SignInTest />);
    const signinFrom = wrapper.find(Box);
    expect(signinFrom.prop('component')).toBe('form');
    const testField = wrapper.find(TextField);
    expect(testField).toHaveLength(2);

    expect(testField.first().prop('aria-describedby')).toBe('Enter your email');
    expect(testField.find('[role="input password"]').prop('label')).toBe('Please enter your password');
  });

  it('test clicking the login button', () => {
    const onClick = jest.fn();
    const wrapper = shallow(<SignInTest login = {onClick}/>);
    const naviBtn = (wrapper.find(Button));
    expect(naviBtn).toHaveLength(1);

    naviBtn.simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);
  });
})
