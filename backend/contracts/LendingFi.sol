// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LendingFi {
    mapping(address => uint256) public collateralBalances;
    mapping(address => uint256) public borrowedAmounts;

    IERC20 public borrowedToken;
    uint256 public collateralRatio; // Collateral ratio in percentage (e.g., 150 means 150%)

    event Deposit(address indexed user, uint256 amount);
    event Borrow(address indexed user, uint256 amount);

    constructor(address _borrowedToken, uint256 _collateralRatio) {
        borrowedToken = IERC20(_borrowedToken);
        collateralRatio = _collateralRatio;
    }

    function deposit(uint256 amount, address collateralToken) external {
        require(amount > 0, "Deposit amount must be greater than zero");
        collateralBalances[msg.sender] += amount;
        IERC20(collateralToken).transferFrom(msg.sender, address(this), amount);
        emit Deposit(msg.sender, amount);
    }

    function borrow(uint256 amount) external {
        require(amount > 0, "Borrow amount must be greater than zero");
        require(collateralBalances[msg.sender] > 0, "No collateral deposited");
        require(
            (borrowedAmounts[msg.sender] + amount) <= (collateralBalances[msg.sender] * collateralRatio / 100),
            "Exceeds collateral ratio"
        );

        borrowedAmounts[msg.sender] += amount;
        borrowedToken.transfer(msg.sender, amount);
        emit Borrow(msg.sender, amount);
    }

    function withdraw(uint256 amount, address collateralToken, address caller , address receiver) external {
        require(amount > 0, "Repay amount must be greater than zero");
        require(collateralBalances[caller] >= amount,'oops');
        collateralBalances[caller] -= amount;
        IERC20(collateralToken).transfer(receiver, amount);
    }

    

    function getCollateralBalance(address user) external view returns (uint256) {
        return collateralBalances[user];
    }

    function getBorrowedAmount(address user) external view returns (uint256) {
        return borrowedAmounts[user];
    }
}
