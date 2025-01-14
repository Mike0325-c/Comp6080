import React from 'react';
import basketball from './Basketball.png';

function Lobby () {
  return (
    <div>
        <h1>Please wait for all students to enter the game...</h1>
        <img
            src={basketball}
            alt="basketabll image"
            width={'60%'}
        />
        <p>Before you can enjoy some videos!</p>
        <li>
            <a href="https://www.youtube.com/watch?v=GLu5YwiAtC4">Basketball Video Original</a>
        </li>
        <li>
            <a href="https://www.youtube.com/watch?v=CzYG_mDM24w">Basketaball Video English</a>
        </li>
    </div>
  )
}

export default Lobby;
