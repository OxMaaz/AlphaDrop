import React, { useEffect, useState, useMemo } from "react";
import Abi from "../artifacts/contracts/AlphaDrop.sol/AlphaDrop.json";
import { ethers } from "ethers";

const Form = () => {
  // const [contractAddress, setContractAddress] = useState("");

  const passwords = [];
  const hashedpasswords = [];

  const [positions, setPositions] = useState("");
  const [vestingPeriod, setVestingPeriod] = useState("");
  const [protocolAddress, setProtocolAddress] = useState("");

  const [chainId, setChainId] = useState("");

  const [, setDepositId] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [amountPerPosition, setAmountPerPosition] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [contractAddress, setContractAddress] = useState("");

  const [requirePreviousTx, setRequirePreviousTx] = useState(false);
  const [requireTokens, setRequireTokens] = useState(false);
  const [requireProofOfPersonhood, setRequireProofOfPersonhood] =useState(false);

  const [links, setLinks] = useState([]);

 
  const accountChecker = async () => {
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    sessionStorage.setItem("address", accounts[0]);
  };

  const getChainId = async () => {

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      setChainId(network.chainId);
      console.log(network.chainId);


      if (network.chainId === 7701) {
        setContractAddress("0xB1EA59521a88405D313d412f3f3EFCF4a329f2dc");
      } else if (network.chainId === 1029) {
        setContractAddress("0xD86EB7E663deF7d63426cc668982D3F39cF5f8E4");
      }
  };
}
  useEffect(() => {
    accountChecker();
    getChainId();
  }, []);

  useEffect(() => {
    // Set contract address based on chainId
    if (chainId === "7701") {
      setContractAddress("0xB1EA59521a88405D313d412f3f3EFCF4a329f2dc");
    } else if (chainId === "1029") {
      setContractAddress("0xD86EB7E663deF7d63426cc668982D3F39cF5f8E4");
    }
  }, [chainId]); // Update contractAddress whenever chainId changes





  const ethereum = useMemo(() => {
    const { ethereum } = window;
    if (typeof ethereum !== "undefined") {
      return ethereum;
    } else {
      // Handle the case where Ethereum is not available
      return null; // or some other default value
    }
  }, []);



  const generateRandomStrings = (length, count) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    // Initialize an array to store generated passwords

    for (let j = 0; j < count; j++) {
      let result = "";
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      passwords.push(result); // Store each generated password in the array

      const utf8Bytes = ethers.utils.toUtf8Bytes(result);
      const encodedPassword = ethers.utils.keccak256(utf8Bytes);
      hashedpasswords.push(encodedPassword);
      console.log(encodedPassword);
    }

    return passwords; // Return the array of generated passwords
  };

  // Function to interact with the contract and handle events
  const createDeposits = async () => {
    // Generate random strings (assuming this function is defined elsewhere)
    generateRandomStrings(6, positions);

    try {
      console.log(
        contractAddress,
        hashedpasswords,
        positions,
        vestingPeriod,
        tokenAddress,
        amountPerPosition,
        protocolAddress,
        true
      );
      // Initialize provider and signer
      const provider = new ethers.providers.Web3Provider(ethereum); // Assuming you're using MetaMask
      const signer = provider.getSigner();

      // Create a contract instance
      const contract = new ethers.Contract(contractAddress, Abi.abi, signer);

      // Execute the contract function (createDeposits)
      const tx = await contract.createDeposits(
        hashedpasswords,
        positions,
        vestingPeriod,
        tokenAddress,
        amountPerPosition,
        protocolAddress,
        true
      );

      // console.log("Transaction hash:", tx.hash);

      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      console.log("Transaction logs:", receipt);

      const eventInterface = new ethers.utils.Interface([
        "event DepositCreated(uint256 indexed _depositId, address indexed _senderAddress, uint256 _amount)",
      ]);

      // Find the event in the logs
      const logs = receipt.logs;
      const eventTopic = eventInterface.getEventTopic("DepositCreated");
      const filteredLogs = logs.filter((log) =>
        log.topics.includes(eventTopic)
      );

      let depositId;
      // Extract depositId from the first matching log
      if (filteredLogs.length > 0) {
        const log = filteredLogs[0];
        const parsedLog = eventInterface.parseLog(log);
        depositId = parsedLog.args["_depositId"].toString();
        setDepositId(depositId);

        console.log("Deposit ID:", depositId);
      } else {
        console.log("DepositCreated event not found in logs");
      }

      for (let i = 0; i < passwords.length; i++) {
        console.log(
          `http://localhost:3000/claim?depositId=${depositId}&password=${passwords[i]}`
        );
        setLinks((prevLinks) => [
          ...prevLinks,
          `http://localhost:3000/claim?depositId=${depositId}&password=${passwords[i]}`,
        ]);
      }
    } catch (error) {
      console.error("Error creating deposits:", error);
    }
  };

  // console.log(
  //   `https://localhost:3000/claim?depositId=${1}&password=${passwords[0]}`
  // );

  return (
    <>
      <div className="bg-[#f2f2f7]">
        <div className="flex h-screen flex-col  mt-12 items-center ">
          <div className="max-h-auto mx-auto max-w-xl">
            <div className="mb-8 space-y-3">
              <p className="text-3xl text-gray-600 font-bold font-heading">
                AlphaDrop
              </p>
              <p className="text-gray-500 font-heading font-semibold">
                Revolutionizing Airdrops , with sponsored Defi positions .{" "}
                <br />
                Reward your community 🎁 for their active participation !
              </p>
            </div>

            <div className="w-full font-heading">
              <div className="mb-10 space-y-3">
                <div className="space-y-1">
                  <div className="space-y-2">
                    <label
                      htmlFor="positions"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Number of Positions
                    </label>
                    <input
                      type="text"
                      id="positions"
                      value={positions}
                      onChange={(e) => setPositions(e.target.value)}
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Number Of positions"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="vestingPeriod"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Vesting Period
                    </label>
                    <input
                      type="text"
                      id="vestingPeriod"
                      value={vestingPeriod}
                      onChange={(e) => setVestingPeriod(e.target.value)}
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Vesting Period"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="tokenAddress"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Token Address
                    </label>
                    <input
                      type="text"
                      id="tokenAddress"
                      value={tokenAddress}
                      onChange={(e) => setTokenAddress(e.target.value)}
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Token Address"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="amountPerPosition"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Tokens Per Position
                    </label>

                    <input
                      type="text"
                      id="amountPerPosition"
                      value={amountPerPosition}
                      onChange={(e) => setAmountPerPosition(e.target.value)}
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Amount Per Position"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="protocolAddress"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Protocol Address
                    </label>

                    <select
                      id="protocolAddress"
                      value={protocolAddress}
                      onChange={(e) => setProtocolAddress(e.target.value)}
                      className="order-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="" disabled>
                        Select a protocol address
                      </option>
                      <option value="0x8668FE1fEa5963b52fbecbeE02ADED9F13f2B47C">
                        LendingFi (Deposit Position)
                      </option>
                      <option value="0x0Ba090AD0af26a95dfa7D8BC344288496416613f">
                        LendingFi (Deposit Position 2)
                      </option>
                      <option value="0x0Ba090AD0af26a95dfa7D8BC344288496416613f">
                        Sunswap (Liquidity Position)
                      </option>
                      <option value="0x8668FE1fEa5963b52fbecbeE02ADED9F13f2B47C">
                        SlingShot.fi (Liquidity Position)
                      </option>
                    </select>
                  </div>
                </div>

                {/* Requirements (Checkboxes) */}

                <label className="block text-sm font-heading  font-semibold text-gray-700 mb-1">
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
                    className="text-sm  text-gray-700"
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
                    className="text-sm text-gray-700"
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
                    className="text-sm text-gray-700"
                  >
                    Requiring proof of personhood (This ensures that only humans
                    can claim it)
                  </label>
                </div>

                <button
                  onClick={createDeposits}
                  className="ring-offset-background  focus-visible:ring-ring  flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-[#7272ab] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                >
                  Create Deposits
                </button>
              </div>
            </div>

            <div className="text-center font-heading underline underline-offset-2 te font-medium text-gray-400">
              {links.map((link, index) => (
                <p className=" text-gray-800" key={index}>
                  {link}{" "}
                </p>
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
