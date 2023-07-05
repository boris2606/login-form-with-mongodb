import React from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import './Admin.scss'
import NewsTab from '../../components/NewsTab/NewsTab';
import PostsTab from '../../components/PostsTab/PostsTab';
import UsersTab from '../../components/UsersTab/UsersTab';

const Admin = () => {

    return (
        <section className='wrapper_admin_panel'>
            <Tabs className='admin_panel_tabs'>
                <TabList className='wrapper_admin_panel_tab'>
                    <Tab className='admin_panel_tab'>News</Tab>
                    <Tab className='admin_panel_tab'>Posts</Tab>
                    <Tab className='admin_panel_tab'>Users</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <NewsTab/>
                    </TabPanel>
                    <TabPanel>
                        <PostsTab/>
                    </TabPanel>
                    <TabPanel>
                        <UsersTab/>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </section>
    );
};

export default Admin;