import React from 'react'
import { Routes, Route } from "react-router-dom";
import "./App.css";

import { ethers } from 'ethers';
import { Web3ReactProvider } from '@web3-react/core'
import { AppContextProvider } from './AppContext';
import Home from './pages/Home';
import Header from './components/Header';

function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider);
}

export default function App () {
  return (
    <div className="App">
      <AppContextProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <div>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
          </div>
        </Web3ReactProvider>
      </AppContextProvider>
    </div>
  )
};
