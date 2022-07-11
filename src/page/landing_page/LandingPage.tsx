import React from 'react';
import LandingPageNavbar from './LandingPageNavbar';
import './styles/LandingPageNavbar__css.css';

const Landing_page = () => {
  return (
    <div>
      <LandingPageNavbar />
      <div className="landingPage__content__container">
        <div className="content">
          <p><b>CHello is a Kanban-inspired collaborative work management application</b></p>
          <p>that helps everyone with tracking and organizing everything whether personally or with team.</p>
          <p>With CHello, users get better visualization on a workflow and project control</p> 
        </div>
      </div>
    </div>
  )
}

export default Landing_page;