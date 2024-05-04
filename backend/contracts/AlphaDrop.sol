// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./Interfaces/IPool.sol";


contract AlphaDrop is ERC721 {

   

    struct Deposit {
        address depositor;
        bytes32 hashedPassword;
        uint256 amount;
        address tokenAddress;
        IPool pool;
        uint256 withdrawableAt;
        bool claimed;
        bool checkEligibility; // Whether to check eligibility to claim the deposit or anyone can claim it
        uint256 batchId; // The batch ID of the deposit
    }

    uint256 public batchIdCounter = 0;
    Deposit[] public deposits;

    // =========================== Events ==============================

    event DepositCreated(
        uint256 indexed _depositId,
        address indexed _senderAddress,
        uint256 _amount
    );

    event DepositClaimed(
        uint256 indexed _depositId,
        address indexed _recipientAddress,
        uint256 _amount
    );

    // =========================== Constructor ==============================

    constructor() ERC721("AlphaDrop", "AD") {}

    // =========================== User functions ==============================

    /**
     * @dev Create a new deposit
     * @param _hashedPasswords Hashed passwords
     * @param _withdrawableAt Timestamp after which the deposit can be withdrawn
     * @param _tokenAddress Address of the ERC20 token to deposit
     * @param _tokenAmount Amount of the ERC20 token to deposit per password
     * @param _pool Pool contract to use for the deposit
     * @param _checkEligibility Whether to check eligibility to claim the deposit or anyone can claim it
     */
    function createDeposits(
        bytes32[] memory _hashedPasswords,
        uint256 _numofPosititons,
        uint256 _withdrawableAt,
        address _tokenAddress,
        uint256 _tokenAmount,
        IPool _pool,
        bool _checkEligibility
    ) public payable  {
        require(_hashedPasswords.length > 0, "No hashed passwords provided");
        require(_tokenAmount > 0, "Token amount must be greater than zero");

           IERC20 token = IERC20(_tokenAddress);
        require(token.balanceOf((msg.sender)) >_tokenAmount * _numofPosititons);

        batchIdCounter += 1;
        uint256 _batchId = batchIdCounter;

        if (_tokenAddress != address(0)) {
            require(msg.value == 0, "Cannot deposit both ETH and ERC20 token");
            
            require(
                token.transferFrom(msg.sender, address(this), _tokenAmount * _numofPosititons),
                "Failed to transfer ERC20 token"
            );
        } else {
            require(msg.value > 0, "No ETH sent"); // TODO: Handle ETH deposits
            _tokenAmount = msg.value;
        }

        for (uint256 i = 0; i < _numofPosititons; i++) {
            deposits.push(
                Deposit({
                    depositor: msg.sender,
                    hashedPassword: _hashedPasswords[i],
                    amount: _tokenAmount,
                    tokenAddress: _tokenAddress,
                    withdrawableAt: _withdrawableAt,
                    pool: _pool,
                    claimed: false,
                    checkEligibility: _checkEligibility,
                    batchId: _batchId
                })
            );
            uint256 depositId = deposits.length - 1;

            emit DepositCreated(depositId, msg.sender, _tokenAmount);

        }
    }

    /**
     * @dev Claim a deposit by providing the correct password
     * @param _depositId ID of the deposit to claim
     * @param _password Password to claim the deposit
     */
    function claimDeposit(uint256 _depositId, string memory _password) public returns (uint256 ,address , uint256) {
        require(_depositId < deposits.length, "Deposit ID out of range");
        Deposit storage deposit = deposits[_depositId];

        require(!deposit.claimed, "Deposit already claimed");
             require(
            deposit.hashedPassword == keccak256(abi.encodePacked(_password)),
            "Invalid password"
        );


        IPool pool = deposit.pool;

        

        IERC20 token = IERC20(deposit.tokenAddress);
        token.approve(address(pool), deposit.amount);
        pool.deposit(deposit.amount, deposit.tokenAddress);

        _safeMint(msg.sender, _depositId);

        deposit.claimed = true;
        emit DepositClaimed(_depositId, msg.sender, deposit.amount);

        return (_depositId,msg.sender, deposit.amount);
    }


   /**
     * @dev View a deposit by providing the correct password
     * @param _depositId ID of the deposit to claim
     * @param _password Password to claim the deposit
     */
    function viewDeposit(uint256 _depositId, string memory _password) public view returns (uint256 ,address , uint256) {
        require(_depositId < deposits.length, "Deposit ID out of range");
        Deposit storage deposit = deposits[_depositId];

        require(!deposit.claimed, "Deposit already claimed");
             require(
            deposit.hashedPassword == keccak256(abi.encodePacked(_password)),
            "Invalid password"
        );

       
        return (_depositId,msg.sender, deposit.amount);
    }

    /**
     * @dev Withdraw a portion of the claimed deposit amount
     * @param _depositId ID of the deposit to withdraw from
     * @param _amount Amount to withdraw
     */
    function withdrawDeposit(uint256 _depositId, uint256 _amount) public {

        require(_depositId < deposits.length, "Deposit ID out of range");
        Deposit storage deposit = deposits[_depositId];

        require(ownerOf(_depositId) == msg.sender, "Not owner of deposit");

        require(deposit.claimed, "Deposit must be claimed");
        require(deposit.amount >= _amount, "Not enough funds");
        require(block.timestamp >= deposit.withdrawableAt, "Deposit not yet withdrawable");

        IPool pool = deposit.pool;
        pool.withdraw(_amount, deposit.tokenAddress , address(this) ,msg.sender);

        deposit.amount -= _amount;

        emit DepositClaimed(_depositId, msg.sender, _amount);
    }

    /**
     * @dev Get the number of deposits
     */
    function getDepositCount() public view returns (uint256) {
        return deposits.length;
    }


    // Function to hash a password and return the hashed value
    function hashPassword(string memory password) public pure returns (bytes32) {
        // Use keccak256 hash function to hash the password
        bytes32 hashed = keccak256(abi.encodePacked(password));
        return hashed;
    }


}
