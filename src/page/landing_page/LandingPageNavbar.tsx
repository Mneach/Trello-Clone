import React from 'react'
import { Link } from 'react-router-dom';

const LandingPageNavbar = () => {
    return (
        <div>
            <div className="landingPage__navbar__container">
                <div className="navbar">
                    <Link to='/'>
                        <div className='left__navbar'>
                            <div className='button'>
                                Chello
                            </div>
                        </div>
                    </Link>
                    <div className='landingPage__right__navbar'>
                        <Link to='/landingPage/register'>
                            <div className='button'>
                                Register
                            </div>
                        </Link>
                        <Link to='/landingPage/login'>
                            <div className='button'>
                                Login
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LandingPageNavbar