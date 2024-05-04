// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IPool {

    function deposit(uint256 amount , address token) external;
    function borrow(uint256 amount) external;
    function withdraw(uint256 amount , address token ,address caller , address receiver) external;
    function getCollateralBalance(address user) external view returns (uint256);
    function getBorrowedAmount(address user) external view returns (uint256);
    event Deposit(address indexed user, uint256 amount);
    event Borrow(address indexed user, uint256 amount);
}
