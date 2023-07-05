import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box
} from '@chakra-ui/react'
import './News.scss'

const News = () => {
    const [news,setNews] = useState([])

    const getData = useCallback( () => {
        axios
            .get('https://mongo-login-server.netlify.app/.netlify/functions/server/news')
            .then(news => setNews(news.data))
            .catch(err => console.log(err))
    },[])

    useEffect(() => {
        getData()
    },[getData])

    return (
        <div className='wrapper_news'>
            <Accordion allowToggle className='news_accord'>
                {news.map( (news,index) => {
                    return  <AccordionItem key={index} className='news_item'>
                                <h2>
                                    <AccordionButton className='news_accord_btn'>
                                        <Box as="span" flex='1' textAlign='center' className='news_accord_title'>
                                            {news.title}
                                        </Box>
                                        <Box as="span" flex='1' textAlign='center' className='news_accord_data'>
                                            {news.date}
                                        </Box>
                                        <AccordionIcon className='news_accord_arrow'/>
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4} className='news_accord_descr'>
                                    {news.descr}
                                </AccordionPanel>
                            </AccordionItem>
                })}
            </Accordion>
        </div>
    );
};

export default News;