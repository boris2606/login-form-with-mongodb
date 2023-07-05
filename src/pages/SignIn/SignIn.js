import React from 'react';
import './SignIn.scss'
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2'
import { Link , useNavigate} from 'react-router-dom';

const SignIn = () => {
    const [users,setUsers] = useState([])
    const [emailUser,setEmailUser] = useState('')
    const [passUser,setPassUser] = useState('')

    const signInPerson = localStorage.getItem('IdU')
    const navigate = useNavigate()

    function chekUserFromBase(e){
        e.preventDefault()
        const signed = users.find(user => user.email === emailUser && user.pass === passUser)
        if (signed){
            localStorage.setItem('IdU', JSON.stringify({id: signed._id, name:signed.name, isAdmin:signed.isAdmin}))
            Swal.fire({
                title: `<p class='signin_alert_tit_text'> Hello ${signed.name}!</p>`,
                html: signed.isAdmin ? `<p class='signin_alert_sec_text'>You are logged in as an administrator. The administrative panel (Admin-panel) of the site is available to you in the site header.</p>` : false,
                icon: 'success',
                confirmButtonColor: '#28A079',
                confirmButtonText: signed.isAdmin ? `<p class='signin_alert_btn'>Go to admin panel</p>` : `<p class='signin_alert_btn'>OK</p>`,
                showCancelButton: signed.isAdmin ? true : false,
                cancelButtonText:'Stay at news',
            }).then((result) => {
                if (result.isConfirmed && signed.isAdmin){
                    navigate('/admin-panel')
                    window.location.reload(true);
                } else {
                    navigate('/news')
                    window.location.reload(true);
                }
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: `<p class='signin_alert_tit_text'> Oops...</p>`,
                html: `<p class='signin_alert_sec_text'>Email or password incorrect, pleace check fields</p>`,
                confirmButtonColor: '#28A079'
            })
        }
    }

    const getData = useCallback( () => {
        axios
            .get('https://mongo-login-server.netlify.app/.netlify/functions/server/users')
            .then(users => setUsers(users.data))
            .catch(err => console.log(err))
    },[])

    useEffect(() => {
        if (signInPerson){
            return navigate("/news");
        }
        getData()
    }, [signInPerson,getData,navigate])

    return (
        <section className='wrapper_signin_form'>
            <form className='signin_form' onSubmit={(e) => chekUserFromBase(e)}>
                <input 
                    className='signin_form_email'
                    type='email' 
                    placeholder='Enter email' 
                    required 
                    onChange={(e) => setEmailUser(e.target.value.trim().toLowerCase())}/>
                <input 
                    className='signin_form_password'
                    type='password' 
                    placeholder='Enter pass' 
                    required 
                    onChange={(e) => setPassUser(e.target.value.trim().toLowerCase())}/>
                <button className='signin_btn' type='submit'>Sign In</button>
                <p className='signin_text'>If you do not have an account,<br/> go to create one <Link to='/signup'>Sign Up</Link></p>
            </form>
        </section>
    );
};

export default SignIn;