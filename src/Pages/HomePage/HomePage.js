import React from 'react';
import HomePageComponent from './component/HomePageComponent';
import './assets/scss/style.scss';

const HomePage = () => {
  return (
    <div className='container-homepage'>
      <div>
        <p>Welcome to React Rematch Reach Router Boilerplate</p>
        <HomePageComponent />
        <p className='container-homepage-description'>
          Find More From{' '}
          <a
            href='https://github.com/sazzadsazib/react-rematch-reachrouter-boilerplate'
            rel='noopener noreferrer'
            target='_blank'
          >
            GITHUB.
          </a>
          <br />
          Pull Requests Are Welcome
        </p>
      </div>
    </div>
  );
};
export default HomePage;
