// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title USDD (USD Decentralized Dollar)
 * @dev Simple ERC-20 stablecoin contract representing USD.
 */
contract USDT is ERC20 {
    constructor() ERC20("USD Decentralized Dollar", "USDD") {
        _mint(msg.sender, 1000000 * (10 ** decimals())); // Mint 1,000,000 USDD tokens initially
    }
}
