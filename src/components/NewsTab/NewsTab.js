import React, { useCallback, useEffect, useState } from 'react';
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
import axios from "axios";
import Swal from 'sweetalert2'
import { BiXCircle } from "react-icons/bi";

import './NewsTab.scss'

const NewsTab = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [search,setSearch] = useState('')
    const [title,setTitle] = useState('')
    const [reload,setReload] = useState(false)
    const [description,setDescription] = useState('')
    const [validation,setValidation] = useState(true)

    const [news,setNews] = useState([])

    const getData = useCallback( () => {
        axios
            .get('https://mongo-login-server.netlify.app/.netlify/functions/server/news')
            .then(news => setNews(news.data))
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

    function createNews (e){
        let date = new Date()
        axios
            .post('https://mongo-login-server.netlify.app/.netlify/functions/server/news', {
                title: title,
                descr: description,
                date: `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`,
            })
            .then(()=> {
                setReload(!reload)
            })
            .catch(err => console.log(err))
        Swal.fire({
            title: `<p> News created </p>`,
            html: `<p> The news has been created and is available for viewing </p>`,
            icon: 'success',
            confirmButtonColor: '#28A079',
            confirmButtonText: `<p>OK</p>`
        })
        clearAllFields()
    }

    function deleteElementFromBase (e){
        Swal.fire({
            title: `<p> Element deleted</p>`,
            html: `<p> Element deleted, database reloaded </p>`,
            icon: 'question',
            showDenyButton: true,
            confirmButtonColor: '#28A079',
            confirmButtonText: `<p>Delete</p>`,
            denyButtonText: `Cancel`
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`https://mongo-login-server.netlify.app/.netlify/functions/server/news/${e}`)
                    .then(()=> {
                        setReload(!reload)
                    })
                    .catch(err => console.log(err))
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
        getData()
        validationFields()
    }, [getData,validationFields,reload])

    return (
        <div className='wrapper_news_tab'>
            <div className='news_tab_panel'>
                <input 
                    className='news_tab_input' 
                    placeholder='Search...'
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className='news_tab_create_btn' onClick={onOpen}>Create news</button>
                <div className='news_create_modal'>
                    <ChakraProvider>
                        <Modal isOpen={isOpen} onClose={() => {
                                onClose()
                                clearAllFields()
                            }}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>New news</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    <form className='news_tab_create_form' onSubmit={(e) => e.preventDefault()}>
                                        <input 
                                                className='news_tab_input' 
                                                id='news_title' 
                                                placeholder='Enter title of news'
                                                required
                                                onChange={(e) => setTitle(e.target.value)}
                                        />
                                        <label htmlFor='news_title' className='create_news_label'>The name must not be shorter than 3 characters</label>
                                        <textarea 
                                                className='news_tab_textarea news_tab_input' 
                                                id='news_description' 
                                                placeholder='Enter description'
                                                required
                                                onChange={(e) => setDescription(e.target.value)}
                                        />
                                        <label htmlFor='news_description' className='create_news_label'>The name must not be shorter than 3 characters</label>
                                        <div className='news_tab_form_btn'>
                                            <button 
                                                className={validation ? 'news_tab_save_btn_disabled' : 'news_tab_save_btn'} 
                                                onClick={() => {
                                                createNews()
                                                onClose()
                                            }}>Save news</button>
                                            <button 
                                                className='news_tab_close_btn'
                                                onClick={() => {
                                                    onClose()
                                                    setTitle('')
                                                    setDescription('')
                                                }}>
                                                Close
                                            </button>
                                        </div>
                                    </form>
                                </ModalBody>
                            </ModalContent>
                        </Modal>
                    </ChakraProvider>
                </div>
            </div>
            <div className='news_tab_content'>
                {news.toReversed().map( (news,index) => {
                    if (news.title.toLowerCase().includes(search.toLowerCase())){
                        return <div className='news_info_wrapper' key={index}>
                                    <p><span className='news_info_span'>ID: </span>{news._id}</p>
                                    <p className='news_info_title'><span className='news_info_span'>Title: </span>{news.title}</p>
                                    <p className='news_info_date'><span className='news_info_span'>Date: </span>{news.date}</p>
                                    <IconButton 
                                        className='news_manager_btn'
                                        onClick={(e) => deleteElementFromBase(news._id)}
                                        icon={<BiXCircle />}/>
                                </div>
                    }
                })}
            </div>
        </div>
    );
};

export default NewsTab;