const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");



module.exports = buildModule("cUsdt", (m) => {

   const usdt = m.contract("USDT");
  return { usdt};

});




module.exports = buildModule("Lendingfi", (m) => {
 
  const usdtAddress = m.getParameter("usdtAddress","0x8668FE1fEa5963b52fbecbeE02ADED9F13f2B47C");
  const collateralRatio = m.getParameter("collateralRatio", 150);

  const lFi = m.contract("LendingFi", [usdtAddress, collateralRatio]);


  return { lFi};
 
});




module.exports = buildModule("alphadrop", (m) => {


  const alphadrop = m.contract("AlphaDrop");

  return { alphadrop};

});

// usdtModule#USDT - 0x23261542222e0FB9b295a755f6127Ec4AEE4b0Bf
// LendingModule#LendingFi - 0x8668FE1fEa5963b52fbecbeE02ADED9F13f2B47C
// Modules#AlphaDrop - 0xD86EB7E663deF7d63426cc668982D3F39cF5f8E4


// cantoUsdt#USDT - 0x8668FE1fEa5963b52fbecbeE02ADED9F13f2B47C
// canto_Lendingfi#LendingFi - 0x0Ba090AD0af26a95dfa7D8BC344288496416613f
// canto_alphadrop#AlphaDrop - 0xB1EA59521a88405D313d412f3f3EFCF4a329f2dc