require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */


// const BTTC_TESTNET_URL = "https://pre-rpc.bittorrentchain.io/"
const PRIVATE_KEY = "c4f2df8e931caf7e567ea5a048a6461a25eb75e606a91358d222ef6407d9b5e1"
const CANTO_TESTNET_URL= `https://canto-testnet.plexnode.wtf`


module.exports = {
  solidity: "0.8.24",
//   networks: {
//     bttctestnet: {
//       url: BTTC_TESTNET_URL,
//       accounts: [PRIVATE_KEY],
//     }
// ,

networks: {
  cantotestnet: {
    url: CANTO_TESTNET_URL,
    accounts: [PRIVATE_KEY],
  }
 }
}
