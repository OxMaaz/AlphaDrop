import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import { ethers } from 'ethers';

const Navbar = () => {
  const [walletAddress, setWalletAddress] = useState(sessionStorage.getItem('useraddress') || '');
  const [connected, setConnected] = useState(sessionStorage.getItem('connected') === 'true');

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        const newAddress = accounts[0];
        setWalletAddress(newAddress);
        setConnected(true);
        sessionStorage.setItem('useraddress', newAddress);
        sessionStorage.setItem('connected', 'true');
      } else {
        setWalletAddress('');
        setConnected(false);
        sessionStorage.removeItem('useraddress');
        sessionStorage.setItem('connected', 'false');
      }
      window.location.reload();
    };

    const checkWalletConnection = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          const address = accounts[0];
          setWalletAddress(address);
          setConnected(true);
          sessionStorage.setItem('useraddress', address);
          sessionStorage.setItem('connected', 'true');
        }
        window.ethereum.on('accountsChanged', handleAccountsChanged);
      }
    };

    checkWalletConnection();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
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
        sessionStorage.setItem('useraddress', address);
        sessionStorage.setItem('connected', 'true');
      } else {
        console.error('MetaMask not detected');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error.message);
    }
  };

  return (
    <nav className="flex justify-evenly items-center py-4 px-6 font-heading text-gray-600">
      <img src={logo} alt="Logo" className="h-28 w-28" />
      <div className="flex items-center">
        {connected && (
          <span className="text-gray-500 text-md font-bold">
            {`${walletAddress.slice(0, 5)}...${walletAddress.slice(-4)}`}
          </span>
        )}
        <button
          onClick={connectWallet}
          className="font-heading ml-4 flex h-10 items-center justify-center hover:bg-black border-none rounded-md bg-[#7272ab] px-4 py-2 text-md font-medium text-white"
          disabled={connected}
        >
          {connected ? 'Connected' : 'Connect Wallet'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
