require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */


const BTTC_URL = "https://rpc.bittorrentchain.io"
const PRIVATE_KEY = "22fc727badbaa35e094b65316ec534acb7a8a5d4dfe95eea33f1db71643a6aa0"



module.exports = {
  solidity: "0.8.24",
  networks: {
    bttcmainnet: {
      url: BTTC_URL,
      accounts: [PRIVATE_KEY],
    }
  },


}
