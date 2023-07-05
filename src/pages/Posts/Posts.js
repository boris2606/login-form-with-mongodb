import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
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
import { BiXCircle } from "react-icons/bi";
import './Posts.scss'

const Posts = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [posts,setPosts] = useState([])
    const [btnStatus, setBtnStatus] = useState(false)
    const [title,setTitle] = useState('')
    const [reload,setReload] = useState(false)
    const [description,setDescription] = useState('')
    const [validation,setValidation] = useState(true)

    const signInPerson = JSON.parse(localStorage.getItem('IdU'))

    const getData = useCallback( () => {
        axios
            .get('https://mongo-login-server.netlify.app/.netlify/functions/server/posts')
            .then(posts => setPosts(posts.data))
            .catch(err => console.log(err))
    },[])

    const validationFields = useCallback(() => {
        if (title.length >= 3 && description.length >= 3){
            setValidation(false)
        } else {
            setValidation(true)
        }
    },[title,description])

    function clearAllFields(){
        setTitle('')
        setDescription('')
    }

    function createPosts (e){
        let date = new Date()
        axios
            .post('https://mongo-login-server.netlify.app/.netlify/functions/server/posts', {
                title: title,
                descr: description,
                date: `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`,
                author: signInPerson.name
            })
            .then(()=> {
                setReload(!reload)
            })
            .catch(err => console.log(err))
        Swal.fire({
            title: `<p> Post created </p>`,
            html: `<p> The post has been created and is available for viewing </p>`,
            icon: 'success',
            confirmButtonColor: '#28A079',
            confirmButtonText: `<p>OK</p>`
        })
        clearAllFields()
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
                    .delete(`https://mongo-login-server.netlify.app/.netlify/functions/server/posts/${e}`)
                    .then(()=> {
                        setReload(!reload)
                    })
                    .catch(err => console.log(err))
                Swal.fire({
                    title: 'Deleted',
                    icon: 'success',
                    confirmButtonColor: '#28A079',
                    confirmButtonText: 'OK'
                })
            } else {
                Swal.fire({
                    title: 'Deletion cancelled',
                    icon: 'info',
                    confirmButtonColor: '#28A079',
                    confirmButtonText: 'OK'
                })
            }
        })
    }

    useEffect(() => {
        signInPerson ? setBtnStatus(true) : setBtnStatus(false)
        getData()
        validationFields()
    },[getData,reload,validationFields])

    return (
        <div className='wrapper_posts'>
            {btnStatus ? 
                <button className='posts_create_btn' onClick={onOpen}>Create post</button>
            :
                false
            }
            <div className='posts_create_modal'>
                <ChakraProvider>
                    <Modal isOpen={isOpen} onClose={() => {
                            onClose()
                            clearAllFields()
                        }}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>New post</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <form className='posts_tab_create_form' onSubmit={(e) => e.preventDefault()}>
                                    <input 
                                            className='posts_tab_input' 
                                            id='posts_title' 
                                            placeholder='Enter title of post'
                                            required
                                            onChange={(e) => setTitle(e.target.value)}
                                    />
                                    <label htmlFor='posts_title' className='create_posts_label'>The name must not be shorter than 3 characters</label>
                                    <textarea 
                                            className='posts_tab_textarea posts_tab_input' 
                                            id='posts_description' 
                                            placeholder='Enter description'
                                            required
                                            onChange={(e) => setDescription(e.target.value)}
                                    />
                                    <label htmlFor='posts_description' className='create_posts_label'>The name must not be shorter than 3 characters</label>
                                    <div className='posts_tab_form_btn'>
                                        <button className={validation ? 'posts_tab_save_btn_disabled' : 'posts_tab_save_btn'}
                                                disabled={validation}
                                                onClick={() => {
                                                createPosts()
                                                onClose()}}
                                            >Save post
                                        </button>
                                        <button 
                                            className='posts_tab_close_btn'
                                            onClick={() => {
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
            <Accordion allowToggle className='posts_accord'>
                {posts.map( (post,index) => {
                    return  <AccordionItem key={index} className='posts_item'>
                                <h2>
                                    {signInPerson && signInPerson.name.toLowerCase() === post.author.toLowerCase() ? 
                                        <IconButton 
                                            className='posts_user_delete_btn'
                                            onClick={(e) => deleteElementFromBase(post._id)}
                                            icon={<BiXCircle />}
                                        />
                                    : 
                                        false
                                    }
                                    <AccordionButton className='posts_accord_btn'>
                                        <Box as="span" flex='1' textAlign='center' className='posts_accord_title'>
                                            {post.title}
                                        </Box>
                                        <Box as="span" flex='1' textAlign='center' className='posts_accord_data'>
                                            {post.date}
                                        </Box>
                                        <Box as="span" flex='1' textAlign='center' className='posts_accord_data'>
                                            {post.author}
                                        </Box>
                                        <AccordionIcon className='posts_accord_arrow'/>
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4} className='posts_accord_descr'>
                                    {post.descr}
                                </AccordionPanel>
                            </AccordionItem>
                })}
            </Accordion>
        </div>
    );
};

export default Posts;