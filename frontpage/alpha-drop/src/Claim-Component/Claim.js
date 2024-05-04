import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Abi from "../artifacts/contracts/AlphaDrop.sol/AlphaDrop.json";
import { ethers } from "ethers";
import logo from '../assets/logo.png'
import Navbar from "../Main-Component/Navbar";

const Claim = () => {
  const contractAddress = "0xD86EB7E663deF7d63426cc668982D3F39cF5f8E4";
  const { ethereum } = window;

  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");

  const [password, setPassword] = useState([]);
  const [depositId, setDepositId] = useState("");

  let urlDepositId;
  let urlPassword;

  const accountChecker = async () => {
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    sessionStorage.setItem("address", accounts[0]);
    setAddress(accounts[0]);
  };

  const viewDeposit = async () => {
    try {
      if (!ethereum) return;

      const provider = new ethers.providers.Web3Provider(ethereum);

      const contract = new ethers.Contract(contractAddress, Abi.abi, provider);

      const viewInfo = await contract.deposits(urlDepositId);
      console.log("View Info:", viewInfo.amount.toString());
      setAmount(viewInfo.amount.toString());
    } catch (error) {
      console.error("Error viewing deposit:", error);
    }
  };

  const location = useLocation();

  useEffect(() => {
    accountChecker()
    const searchParams = new URLSearchParams(location.search);

    urlDepositId = searchParams.get("depositId");
    urlPassword = searchParams.get("password");

    setPassword(urlPassword);
    setDepositId(urlDepositId);

    if (urlDepositId && urlPassword) {
      viewDeposit();
    }
  }, [location.search]);

  const claimDeposit = async () => {
    try {
      if (!ethereum) return;

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(contractAddress, Abi.abi, signer);

      console.log("Claiming deposit...", password, depositId);

      const tx = await contract.claimDeposit(depositId, password);
      console.log("Transaction:", tx);

      const receipt = await tx.wait();
      console.log("Transaction receipt:", receipt);

      // Handle success - emit event or update UI
    } catch (error) {
      console.error("Transaction failed:", error);
      alert(error.message);
    }
  };

  return (
    <>
   
      <div className="bg-[#f2f2f7]  w-[100%] font-heading min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full p-8 rounded shadow-md">
          <img
            src={logo}
            alt="Logo"
            className=" w-32 h-32 mx-auto mb-6"
          />

          <h1 className="text-4xl  font-bold mb-4">Congratulations 🥳 , {address.slice(0, 4)}...{address.slice(-4)} !</h1>

          <p className="mb-4">To activate click on the button below</p>

          <p className="mb-4">
          You are eligible to activate a position on Lending.fi platform
          with {amount} USDT  , claim now through AlphaDrop.
          </p>

          <button
             onClick={claimDeposit}
             className="ring-offset-background  focus-visible:ring-ring  flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-[#7272ab] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            Claim
    
          </button>

          <p className="text-sm text-gray-700 mb-2 mt-6">
          Sponsored by Lending.fi
          </p>

        
  
        </div>
      </div>
    </>
  );
};

export default Claim;