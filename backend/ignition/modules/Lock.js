const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");



// module.exports = buildModule("usdt", (m) => {

//    const usdt = m.contract("USDT");
//   return { usdt};

// });




// module.exports = buildModule("Lendingfi", (m) => {
 
//   const usdtAddress = m.getParameter("usdtAddress","0x9409358b1Cb54AE10Bab80c5983C940d771D6B4d");
//   const collateralRatio = m.getParameter("collateralRatio", 150);

//   const lFi = m.contract("LendingFi", [usdtAddress, collateralRatio]);


//   return { lFi};
 
// });




module.exports = buildModule("alphadrop", (m) => {


  const alphadrop = m.contract("AlphaDrop");

  return { alphadrop};

});

// usdt#USDT - 0x9409358b1Cb54AE10Bab80c5983C940d771D6B4d
// Lendingfi#LendingFi - 0xD1448Ca6ED3dfbCC5927ba6f2A4c032677FdADc8
// alphadrop#AlphaDrop - 0xCfa88c4B7Cd2B3e87F25Df0292d7E961e69a8084

