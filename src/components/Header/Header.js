import React, { useEffect, useState } from 'react';
import './Header.scss'
import { Link } from 'react-router-dom';

const Header = () => {
    const signInPerson = JSON.parse(localStorage.getItem('IdU'))
    const [btnStatus, setBtnStatus] = useState(false) 
    
    function signOut() {
        localStorage.removeItem('IdU')
        window.location.reload(true)
    }

    useEffect(() => {
        signInPerson ? setBtnStatus(true) : setBtnStatus(false)
    },[signInPerson])

    return (
        <header className='header_wrapper'>
            <div className='header_content'>
                <p className='header_logo_text'>INFORMATION PORTAL</p>
            </div>
            <div className='header_navigation_block'>
                <nav className='header_navigation'>
                    <ul className='header_navigation_list'>
                        <li>
                            <Link to='/news'>News</Link>
                        </li>
                        <li>
                            <Link to='/posts'>Posts</Link>
                        </li>
                        {signInPerson && signInPerson.isAdmin ? 
                            <li>
                                <Link to='/admin-panel'>Admin-panel</Link>
                            </li> : 
                            false
                        }
                    </ul>
                </nav>
                <hr className='header_line' noshade='true'/>
                {!btnStatus ? 
                    <div className='sign_btn'>
                        <Link to='/signin'>Sing In</Link>
                    </div>
                :
                    false
                }
                <button onClick={signOut} className={ btnStatus ? 'visible_btn' : 'hidden_btn' }>Sign out</button>
            </div>
        </header>
    );
};

export default Header;