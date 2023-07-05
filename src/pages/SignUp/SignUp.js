import React, { useCallback, useEffect } from 'react';
import './SignUp.scss'
import { useState } from "react";
import axios from "axios";
import { Link,useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'

const Registration = () => {
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [pass,setPass] = useState('')
    const [validation,setValidation] = useState(true)

    const navigate = useNavigate()
    const signInPerson = localStorage.getItem('IdU')

    
    const validationFields = useCallback(() => {
        const regExEmail = /^.{3,}@.{2,}\..{2,}$/i
        if (name.length >= 3 && regExEmail.exec(email) && pass.length >= 8){
            setValidation(false)
        } else {
            setValidation(true)
        }
    },[name,email,pass])

    function createPerson (e){
        e.preventDefault()
        let date = new Date()
        axios
            .post('https://mongo-login-server.netlify.app/.netlify/functions/server/users', {
                name : name,
                email: email,
                pass: pass,
                isAdmin: false,
                date: `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`
            })
            .catch(err => console.log(err))
        Swal.fire({
            title: `<p class='signup_alert_tit_text'> Thank you for registration!</p>`,
            html: `<p class='signup_alert_sec_text'>Now you can log in</p>`,
            icon: 'success',
            confirmButtonColor: '#28A079',
            confirmButtonText: `<p class='signup_alert_btn'>OK</p>`
        }).then((result) => {
            if (result.isConfirmed) {
                setEmail('')
                setPass('')
                setName('')
                navigate('/signin')
            }
        })
    }

    useEffect(() => {
        signInPerson ? navigate("/news") : navigate("/signup")
        validationFields()
    },[signInPerson,navigate,validationFields])

    return (
        <section className='wrapper_signup_form'>
            <form className='signup_form'>
                <p className='signup_tit_text'>Registration</p>
                <input 
                    className='signup_form_name'
                    id='signup_name' 
                    placeholder='Enter name' 
                    required
                    onChange={(e) => setName(e.target.value.trim()
                        .toLowerCase()
                        .charAt(0)
                        .toUpperCase() + e.target.value.slice(1))}/>
                <label htmlFor='signup_name' className='signup_form_label'>The name must not be shorter than 3 characters</label>
                <input 
                    className='signup_form_email'
                    id='signup_email' 
                    placeholder='Enter email' 
                    required 
                    onChange={(e) => setEmail(e.target.value.trim().toLowerCase())}/>
                <label htmlFor='signup_email' className='signup_form_label'>The email address must be in the following format ***@**.**</label>
                <input 
                    className='signup_form_password'
                    id='signup_pass' 
                    placeholder='Enter password' 
                    required onChange={(e) => setPass(e.target.value.trim().toLowerCase())}/>
                <label htmlFor='signup_pass' className='signup_form_label'>The password must contain at least 8 characters</label>
                <button className={validation ? 'signup_btn_disabled' : 'signup_btn'} onClick={(e) => createPerson(e)} disabled={validation}>CRETE</button>
                <p className='signup_text'>If you are already registered, use the login <Link to='/signin'>Sign In</Link></p>
            </form>
        </section>
    );
};

export default Registration;