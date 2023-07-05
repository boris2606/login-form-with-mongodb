import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    ChakraProvider,
    IconButton
} from '@chakra-ui/react'
import { BiXCircle,BiPencil } from "react-icons/bi";
import './UsersTab.scss'

const UsersTab = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [search,setSearch] = useState('')
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [pass,setPass] = useState('')
    const [role,setRole] = useState('')
    const [update,setUpdate] = useState(null)
    const [reload,setReload] = useState(false)
    const [validation,setValidation] = useState(true)

    const [users,setUsers] = useState([])

    const getData = useCallback( () => {
        axios
            .get('https://mongo-login-server.netlify.app/.netlify/functions/server/users')
            .then(users => setUsers(users.data))
            .catch(err => console.log(err))
    },[])

    const validationFields = useCallback(() => {
        const regExEmail = /^.{3,}@.{2,}\..{2,}$/i
        if (name.length >= 3 && regExEmail.exec(email) && pass.length >= 8){
            setValidation(false)
        } else {
            setValidation(true)
        }
    },[name,email,pass])

    function clearAllFields(){
        setEmail('')
        setPass('')
        setName('')
        setRole('')
        setUpdate(null)
    }

    function createUsers (e){
        let date = new Date()
        axios
            .post('https://mongo-login-server.netlify.app/.netlify/functions/server/users', {
                name: name,
                email: email,
                pass: pass,
                isAdmin: role === 'Admin' ? true : false,
                date: `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`
            })
            .then(()=> {
                setReload(!reload)
            })
            .catch(err => console.log(err))
        Swal.fire({
            title: `<p> User created </p>`,
            html: `<p> The user has been created</p>`,
            icon: 'success',
            confirmButtonColor: '#28A079',
            confirmButtonText: `<p>OK</p>`
        }).then((result) => {
            if (result.isConfirmed) {
                clearAllFields()
            }
        })
    }

    function updateUserInDatabase(id){
        let date = new Date()

        Swal.fire({
            title: `<p> Are you sure you want to update the record? </p>`,
            html: `<p> After the update, the record with the previous data will not be available </p>`,
            icon: 'question',
            showDenyButton: true,
            confirmButtonColor: '#28A079',
            confirmButtonText: `<p>Update</p>`,
            denyButtonText: `Cancel`
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .patch(`https://mongo-login-server.netlify.app/.netlify/functions/server/users/${id}`, {
                        name: name,
                        email: email,
                        pass: pass,
                        isAdmin: role === 'Admin' ? true : false,
                        updated: `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`
                    })
                    .then(()=> {
                        setReload(!reload)
                    })
                    .catch(err => console.log(err))
                Swal.fire({
                    title: 'Updated',
                    icon: 'success',
                    confirmButtonColor: '#28A079',
                    confirmButtonText: 'OK'
                })
                clearAllFields()
            } else {
                Swal.fire({
                    title: 'Update cancelled',
                    icon: 'info',
                    confirmButtonColor: '#28A079',
                    confirmButtonText: 'OK'
                })
            }
        })
    }

    function deleteElementFromBase (e){
        Swal.fire({
            title: `<p> Element deleted </p>`,
            html: `<p> Element deleted, database reloaded </p>`,
            icon: 'question',
            showDenyButton: true,
            confirmButtonColor: '#28A079',
            confirmButtonText: `<p>Delete</p>`,
            denyButtonText: `Cancel`
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`https://mongo-login-server.netlify.app/.netlify/functions/server/users/${e}`)
                    .then(()=> {
                        setReload(!reload)
                    })
                    .catch(err => console.log(err))
                Swal.fire('Deleted!', '', 'success')
            } else {
                Swal.fire('Deletion cancelled', '', 'info')
            }
        })
    }

    useEffect(() => {
        getData()
        validationFields()
    }, [getData,validationFields,reload])

    return (
        <div className='wrapper_news_tab'>
            <div className='users_tab_panel'>
                <input 
                    className='users_tab_input' 
                    placeholder='Search...'
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className='users_tab_create_btn' onClick={onOpen}>Create user</button>
                <div className='users_create_modal'>
                    <ChakraProvider>
                        <Modal isOpen={isOpen} 
                            onClose={() => {
                                onClose()
                                clearAllFields()
                            }}
                        >
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>New user</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    <form className='users_tab_create_form' onSubmit={(e) => e.preventDefault()}>
                                        <input 
                                                className='users_tab_input' 
                                                id='users_name' 
                                                placeholder='Enter name'
                                                value={name}
                                                required
                                                onChange={(e) => setName(e.target.value)}
                                        />
                                        <label htmlFor='users_name' className='create_users_label'>The name must not be shorter than 3 characters</label>
                                        <input 
                                                className='users_tab_input' 
                                                id='users_email' 
                                                placeholder='Enter email'
                                                value={email}
                                                required
                                                onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <label htmlFor='users_email' className='create_users_label'>The email address must be in the following format ***@**.**</label>
                                        <input 
                                                className='users_tab_input' 
                                                id='users_pass' 
                                                placeholder='Enter password'
                                                value={pass}
                                                required
                                                onChange={(e) => setPass(e.target.value)}
                                        />
                                        <label htmlFor='users_pass' className='create_users_label'>The password must contain at least 8 characters</label>
                                        <select className='users_role' onChange={(e)=>setRole(e.target.value)}>
                                            <option>Chose role for user</option>
                                            <option value='User'>User</option>
                                            <option value='Admin'>Admin</option>
                                        </select>
                                        <div className='users_tab_form_btn'>
                                            {update === null ? 
                                                <button 
                                                    className={validation ? 'users_tab_save_btn_disabled' : 'users_tab_save_btn'} 
                                                    disabled={validation} 
                                                    onClick={() => {
                                                    createUsers()
                                                    clearAllFields()
                                                    onClose()
                                                }}>
                                                    Create user
                                                </button>
                                                    :                                                
                                                <button 
                                                    className={'users_tab_save_btn'} 
                                                    onClick={() => {
                                                    updateUserInDatabase(update)
                                                    clearAllFields()
                                                    onClose()
                                                }}>
                                                    Update user
                                                </button>
                                            }
                                            <button className='users_tab_close_btn' onClick={() => {
                                                onClose()
                                                clearAllFields()
                                            }}>Close</button>
                                        </div>
                                    </form>
                                </ModalBody>
                            </ModalContent>
                        </Modal>
                    </ChakraProvider>
                </div>
            </div>
            <div className='posts_tab_content'>
                {users.toReversed().map( (user,index) => {
                    if (user.name.toLowerCase().includes(search.toLowerCase())){
                        return <div className='users_info_wrapper' key={index}>
                                    <p><span className='users_info_span'>Create date: </span>{user.date}</p>
                                    <p><span className='users_info_span'>Update: </span>{user.updated || false}</p>
                                    <p><span className='users_info_span'>Name: </span>{user.name}</p>
                                    <p className='users_info_title'><span className='users_info_span'>Email: </span>{user.email}</p>
                                    <p className='users_info_date'><span className='users_info_span'>Admin: </span>{`${user.isAdmin}`}</p>
                                    <IconButton 
                                        className='users_manager_btn'
                                        onClick={(e) => {
                                            onOpen()
                                            setUpdate(user._id)
                                            setName(user.name)
                                            setEmail(user.email)
                                            setPass(user.pass)
                                            setRole(user.isAdmin)
                                        }}
                                        icon={<BiPencil />}
                                    />
                                    {user.isAdmin ? false : 
                                    <IconButton 
                                        className='users_manager_btn'
                                        onClick={(e) => deleteElementFromBase(user._id)}
                                        icon={<BiXCircle />}
                                    />
                                    }
                                </div>
                    }
                })}
            </div>
        </div>
    );
};

export default UsersTab;