import React from 'react';
import Lobby from './components/Lobby';
import basketabll from './components/Basketball.png';
import { shallow } from 'enzyme';
import { render } from '@testing-library/react';
describe('Lobby', () => {
  it('should have links to watch basketball video', () => {
    const { getByText } = render(<Lobby />);
    expect(getByText('Basketball Video Original').closest('a')).toHaveAttribute(
      'href',
      'https://www.youtube.com/watch?v=GLu5YwiAtC4'
    );
  });

  it('should have links to relaxing cat video', () => {
    const { getByText } = render(<Lobby />);
    expect(getByText('Basketaball Video English').closest('a')).toHaveAttribute(
      'href',
      'https://www.youtube.com/watch?v=CzYG_mDM24w'
    );
  });

  it('should have a smart image', () => {
    const wrapper = shallow(<Lobby />);
    expect(wrapper.find('img').prop('src')).toEqual(basketabll);
  });
});
