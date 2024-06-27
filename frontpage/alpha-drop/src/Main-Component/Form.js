import React, { useEffect, useState, useMemo } from "react";
import Abi from "../artifacts/contracts/AlphaDrop.sol/AlphaDrop.json";
import { ethers } from "ethers";
import { Link } from "react-router-dom";

const Form = () => {
  const [positions, setPositions] = useState("");
  const [vestingPeriod, setVestingPeriod] = useState("")
  const [, setDepositId] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [amountPerPosition, setAmountPerPosition] = useState("");
  const [buttonActivity, setButtonActivity] = useState("Create Links");
  const [contractAddress] = useState("0xCfa88c4B7Cd2B3e87F25Df0292d7E961e69a8084");
  const [requirePreviousTx, setRequirePreviousTx] = useState(false);
  const [requireTokens, setRequireTokens] = useState(false);
  const [requireProofOfPersonhood, setRequireProofOfPersonhood] = useState(false);
  const [links, setLinks] = useState([]);
  const [selected, setSelected] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const passwords = [];
  const hashedpasswords = [];

  const options = [
    {
      value: "0xD1448Ca6ED3dfbCC5927ba6f2A4c032677FdADc8",
      label: "LendingFi (Deposit Position)",
    },
  ];

  const accountChecker = async () => {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    sessionStorage.setItem("address", accounts[0]);
  };

  useEffect(() => {
    accountChecker();
  }, []);

  useEffect(() => {
    const getChainId = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const { chainId } = await provider.getNetwork();
        console.log(chainId);
        if (chainId.toString() !== "199") {
          alert("Please connect to the Bttc Network");
        }
      } else {
        console.error("MetaMask is not installed.");
      }
    };

    getChainId();
  }, []);

  const ethereum = useMemo(() => {
    const { ethereum } = window;
    if (typeof ethereum !== "undefined") {
      return ethereum;
    } else {
      return null;
    }
  }, []);

  const generateRandomStrings = (length, count) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let j = 0; j < count; j++) {
      let result = "";
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      passwords.push(result);
      const utf8Bytes = ethers.utils.toUtf8Bytes(result);
      const encodedPassword = ethers.utils.keccak256(utf8Bytes);
      hashedpasswords.push(encodedPassword);
    }
    return passwords;
  };

  const TokenAbi = [
    "function approve(address _spender, uint256 _value) external returns (bool success)",
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function transfer(address _to, uint256 _value) external returns (bool success)",
    "function balanceOf(address _owner) external view returns (uint256)",
  ];

  const getAllowance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(tokenAddress, TokenAbi, provider);
    const allowance = await tokenContract.allowance(signer.getAddress(), contractAddress);
    return allowance;
  };

  const getBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(tokenAddress, TokenAbi, provider);
    const balance = await tokenContract.balanceOf(signer.getAddress());
    return balance;
  };

  const approveToken = async () => {
    try {
      const balance = await getBalance();
      const allowance = await getAllowance();
      console.log("Allowance:", Number(allowance), "Balance:", Number(balance));

      // Check if token has enough balance
      if (Number(balance) > amountPerPosition) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(tokenAddress, TokenAbi, signer);
        const amountInWei = ethers.utils.parseUnits(amountPerPosition, 18); // Adjust decimals if needed
        console.log("Approving token...", tokenAddress, amountInWei);
        if (allowance.lt(amountInWei)) {
          setButtonActivity("Approving Token...");
          const tx = await tokenContract.approve(contractAddress, amountInWei);
          await tx.wait();
          console.log("Token approved by relayer:", tx);
        } else {
          console.log("Token already approved with sufficient allowance");
        }
      } else {
        alert("Insufficient balance");
        return;
      }
    } catch (error) {
      console.error("Error approving token:", error);
    }
  };

  const GenerateLinks = (receipt) => {
    const eventInterface = new ethers.utils.Interface([
      "event DepositCreated(uint256 indexed _depositId, address indexed _senderAddress, uint256 _amount)",
    ]);

    const logs = receipt.logs;
    const eventTopic = eventInterface.getEventTopic("DepositCreated");
    const filteredLogs = logs.filter((log) => log.topics.includes(eventTopic));
    let depositId;

    if (filteredLogs.length > 0) {
      const log = filteredLogs[0];
      const parsedLog = eventInterface.parseLog(log);
      depositId = parsedLog.args["_depositId"].toString();
      setDepositId(depositId);
      console.log("Deposit ID:", depositId);

      setButtonActivity("Create links");
      const newLinks = passwords.map((password) =>
        `https://alphadrop.netlify.app/claim?depositId=${depositId}&password=${password}`
      );
      setLinks((prevLinks) => [...prevLinks, ...newLinks]);
      newLinks.forEach(link => console.log(link));
    } else {
      console.log("DepositCreated event not found in logs");
    }
  };

  const createDeposits = async () => {
    generateRandomStrings(6, positions);  // No need to await as this function is synchronous
    await approveToken();
    setButtonActivity("Generating links...");
  
    console.log(
      contractAddress,
      hashedpasswords,
      positions,
      vestingPeriod,
      tokenAddress,
      amountPerPosition,
      selected,
      true
    );
  
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, Abi.abi, signer);
  
      const tx = await contract.createDeposits(
        hashedpasswords,
        positions,
        vestingPeriod,
        tokenAddress,
        amountPerPosition,
        selected,
        true
      );
  
      const receipt = await tx.wait();
      console.log("Transaction logs:", receipt);
  
      setButtonActivity("Successfully created links...");
  
      setTimeout(() => {
        GenerateLinks(receipt);
      }, 2000);
    } catch (error) {
      console.error("Error creating deposits:", error);
    }
  };

  



  
  return (
    <>
      <div className="">
        <div className="flex h-screen flex-col  mt-12 items-center ">
          <div className="max-h-auto mx-auto max-w-xl">
            <div className="mb-8 space-y-3">
              <p className="text-4xl text-gray-600 font-bold font-heading">
                AlphaDrop
              </p>
              <p className="text-gray-500 text-lg font-heading font-semibold">
                Revolutionizing Airdrops , with sponsored Defi positions .{" "}
                <br />
                🎁 Reward your community for their active participation !
              </p>
            </div>

            <div className="w-full font-heading">
              <div className="mb-10 space-y-3">
                <div className="space-y-1">
                  <div className="space-y-2">
                    <label
                      htmlFor="positions"
                      className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Number of Positions
                    </label>
                    <input
                      type="text"
                      id="positions"
                      value={positions}
                      onChange={(e) => setPositions(e.target.value)}
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-md file:border-0 file:bg-transparent file:text-md file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Number Of positions"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="vestingPeriod"
                      className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Vesting Period
                    </label>
                    <input
                      type="text"
                      id="vestingPeriod"
                      value={vestingPeriod}
                      onChange={(e) => setVestingPeriod(e.target.value)}
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-md file:border-0 file:bg-transparent file:text-md file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Vesting Period (Days)"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="tokenAddress"
                      className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Token Address
                    </label>
                    <input
                      type="text"
                      id="tokenAddress"
                      value={tokenAddress}
                      onChange={(e) => setTokenAddress(e.target.value)}
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-md file:border-0 file:bg-transparent file:text-md file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Token Address"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="amountPerPosition"
                      className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Tokens Per Position
                    </label>

                    <input
                      type="text"
                      id="amountPerPosition"
                      value={amountPerPosition}
                      onChange={(e) => setAmountPerPosition(e.target.value)}
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-md file:border-0 file:bg-transparent file:text-md file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Amount Per Position"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor=""
                      className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Protocol Address
                    </label>

                    <div className="relative inline-block w-full">
                      <div
                        className="order-input bg-[white] ring-offset-background placeholder:text-muted-foreground flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                        onClick={() => setIsOpen(!isOpen)}
                      >
                        {selected
                          ? options.find((option) => option.value === selected)
                              .label
                          : "Select a protocol address"}
                        <svg
                          className="w-4 h-4 ml-2"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      {isOpen && (
                        <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">
                          <ul className="max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-md">
                            {options.map((option) => (
                              <li
                                key={option.value}
                                className={`cursor-pointer select-none relative py-2 pl-3 pr-9 ${
                                  selected === option.value
                                    ? "text-white bg-indigo-600"
                                    : "text-gray-900"
                                }`}
                                onClick={() => {
                                  setSelected(option.value);
                                  setIsOpen(false);
                                }}
                              >
                                <span
                                  className={`block truncate ${
                                    selected === option.value
                                      ? "font-semibold"
                                      : "font-normal"
                                  }`}
                                >
                                  {option.label}
                                </span>
                                {selected === option.value && (
                                  <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                    <svg
                                      className="w-5 h-5"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 10-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Requirements (Checkboxes) */}

                <label className="block text-md font-heading  font-semibold text-gray-700 mb-1">
                  Requirements:
                </label>
                <div className="flex items-center  font-heading mb-2">
                  <input
                    type="checkbox"
                    id="requirePreviousTx"
                    checked={requirePreviousTx}
                    onChange={(e) => setRequirePreviousTx(e.target.checked)}
                    className="mr-1"
                  />
                  <label
                    htmlFor="requirePreviousTx"
                    className="text-md  text-gray-600  font-heading"
                  >
                    Demonstrating a history of prior transactions within the
                    protocol.
                  </label>
                </div>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="requireTokens"
                    checked={requireTokens}
                    onChange={(e) => setRequireTokens(e.target.checked)}
                    className="mr-1"
                  />
                  <label
                    htmlFor="requireTokens"
                    className="text-md text-gray-600  font-heading"
                  >
                    Owning a minimum quantity of tokens.
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireProofOfPersonhood"
                    checked={requireProofOfPersonhood}
                    onChange={(e) =>
                      setRequireProofOfPersonhood(e.target.checked)
                    }
                    className="mr-1"
                  />
                  <label
                    htmlFor="requireProofOfPersonhood"
                    className="text-md text-gray-600 font-heading"
                  >
                    Requiring proof of personhood (This ensures that only humans
                    can claim it)
                  </label>
                </div>

                <button
                  onClick={createDeposits}
                  className=" flex h-10 w-full items-center justify-center hover:bg-black border-none  rounded-md bg-[#7272ab] px-4 py-2 text-md font-medium text-white "
                >
                  {buttonActivity}
                </button>
              </div>
            </div>
            <div className="flex w-full flex-col space-y-2 font-heading  font-medium max-h-32  overflow-scroll">
              {links.length > 0 && (
                <div className="text-start text-gray-500 font-bold  text-2xl   font-heading">
                  Claim Links
                </div >
              )}

              {links.map((link, index) => (
                <Link
                  to={link}
                  className="text-start ml-8 text-xl text-[#7272ab] underline underline-offset-2 "
                  key={index}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {index+1}.{" "} alphaDrop.claim.link#{index}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 
...................... */}
    </>
  );
};

export default Form;
