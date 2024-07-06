# Project-Smart-Contract-Management

This project presents an Ethereum smart contract created in Solidity with strong error handling for transaction management. It let users to make deposits and withdrawals of Ether while imposing restrictions to guard against mistakes and unwanted access. 

## Description

This program shows how to safely manage transactions using an Ethereum smart contract in communication with a React-based front end. The program links users' MetaMask wallets to the Ethereum blockchain so they may deposit and withdraw ether by using the Web3.js and ethers.js libraries. Deployed at 0x5FbDB2315678afecb367f032d93F642f64180aa3, the smart contract carries out error handling and transaction history tracking. In addition to performing transactions and seeing their account balances, users may also fetch and dynamically display transaction history and adjust its visibility. In order to improve usability and accessibility for Ethereum blockchain interactions, the front end makes advantage of contemporary UI principles, such as responsive buttons and visual feedback on user inputs.


## Getting Started

### Executing program

To execute this program, you may use Remix, an online Solidity IDE; to get started, go visit https://remix.ethereum.org/.

Once on the Remix website, click the "+" symbol in the left-hand sidebar to create a new file. Save the file as HelloWorld.sol. Copy and paste the code below into the file.

```javascript
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount);
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // emit the event
        emit Withdraw(_withdrawAmount);
    }
}

```


To compile the code, select the "Solidity Compiler" tab from the left sidebar. Set the "Compiler" option to "0.8.18" (or any suitable version), then click the "Compile HelloWorld.sol" button.

Once the code has been built, you can deploy the contract by selecting the "Deploy & Run Transactions" tab in the left-hand sidebar. Choose the "HelloWorld" contract from the dropdown menu, and then click the "Deploy" button.

Once the contract has been deployed, you can interact with it by using the sayHello method. Click the "HelloWorld" contract in the left-hand sidebar, followed by the "sayHello" function. Finally, click the "transact" button to call the function and get the "Hello World!" message.
## Authors

Metacrafter Student Harley Ramone Tesorero
[@harleyramonee](https://twitter.com/harleyramonee)


## License

This project is licensed under the Harley Ramone Tesorero License - see the LICENSE.md file for details
