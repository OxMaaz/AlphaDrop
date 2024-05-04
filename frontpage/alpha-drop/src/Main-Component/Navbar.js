import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import { ethers } from 'ethers';

const Navbar = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
        setConnected(true);
        sessionStorage.setItem("useraddress", address);
        sessionStorage.setItem("connected", true);
      } else {
        console.error('MetaMask not detected');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error.message);
      // Handle wallet connection error
    }
  };

  const checkWalletConnection = async () => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      const address = window.ethereum.selectedAddress;
      setWalletAddress(address);
      setConnected(true);
    }
  };

  return (
    <nav className="flex justify-evenly items-center py-4 px-6 bg-[#f2f2f7] font-heading text-gray-600">
      {/* Logo/Image on the left side */}
      <img src={logo} alt="Logo" className="h-24 w-24" />

      {/* Wallet Connection and User Address */}
      <div className="flex items-center">

          {/* Display User Address */}
          <span className="text-gray-500 text-sm  font-bold">
          {connected || sessionStorage.getItem("connected") ? `${sessionStorage.getItem("useraddress").slice(0, 5)}...${sessionStorage.getItem("useraddress").slice(-4)}` : ''}
        </span>


        {/* Connect Wallet Button */}
        <button
          onClick={connectWallet}
          className="font-heading ml-4 ring-offset-background focus-visible:ring-ring flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-[#7272ab] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          disabled={connected}
        >
          {connected || sessionStorage.getItem("connected") ? 'Connected' : 'Connect Wallet'}
        </button>
        
      
      </div>
    </nav>
  );
}

export default Navbar;
