import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';

import App from './App';
import './setup';

import AccountState from './States/AccountState';
import { WebSocketProvider } from './Context/WebSocketContext';
import { CallContextProvider } from './Context/CallContext';

import Home from './Components/home';
import Login from './Components/User/Login_user';
import Signup_user from './Components/User/SignUp_user';
import Feed from './Components/User/feed';
import Feed_Header from './Components/User/feed_header';
import Settings from './Components/User/settings';
import Profile from './Components/User/profile';
import Chat from './Components/Chat/chat';
import Sproduct from './Components/Products/Sproduct';
import Messager from './Components/Chat/message_box';
import Video from './Components/Chat/VideoCall';
import Inventory from './Components/User/Inventory';
import Bar from './Components/User/Bar';
import Post from './Components/User/Post';
import AddProduct from './Components/Products/NewProduct';
import BusinessFinder from './Components/Finder/Finder';
import Party from './Components/Party/Party';
import GoogleCalendar from './Components/User/Calendar';
import Wallet from './Components/User/Wallet';
import Looker from './Components/Finder/looker';
import Oinventory from './Components/Finder/Oinventory';
import Oprofile from './Components/Finder/Oprofile';
import Ocalendar from './Components/Finder/Ocalendar';

const websocketurl = 'wss://qtwordoyl7.execute-api.us-east-1.amazonaws.com/production/';
const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <BrowserRouter basename={baseUrl}>
    <AccountState>
      <WebSocketProvider url={websocketurl}>
        <CallContextProvider>
          <Routes>
            <Route path="/" element={<Feed_Header />} />
            <Route index element={<Home />} />
            <Route path="Login_user" element={<Login />} />
            <Route path="SignUp_user" element={<Signup_user />} />
            <Route path="feed" element={<Feed />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="chat" element={<Chat />} />
            <Route path="message_box" element={<Messager />} />
            <Route path="post" element={<Post />} />
            <Route path="bar" element={<Bar />} />
            <Route path="video" element={<Video />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="newproduct" element={<AddProduct />} />
            <Route path="finder" element={<BusinessFinder />} />
            <Route path="looker" element={<Looker/>} />
            <Route path="party" element={<Party />} />
            <Route path="calendar" element={<GoogleCalendar />} />
            <Route path="wallet" element={<Wallet/>} />
            <Route path="oinventory" element={<Oinventory/>} />
            <Route path="oprofile" element={<Oprofile/>} />
            <Route path="ocalendar" element={<Ocalendar/>} />
            <Route path="sproduct" element={<Sproduct/>} />
          </Routes>
        </CallContextProvider>
      </WebSocketProvider>
    </AccountState>
  </BrowserRouter>
);
