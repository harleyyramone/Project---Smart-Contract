# Project-Functions-and-Errors

This programs is a straightforward example designed to illustrate the fundamental error handling mechanisms in Solidity. This contract enables users to deposit and withdraw Ether while ensuring that specific conditions are met to prevent errors and unauthorized access. It leverages require and assert statements to enforce these conditions, making it an excellent educational tool for those new to smart contract development.

## Description

This program provides an in-depth look at basic error handling within a Solidity smart contract through three core functions. The deposit function allows users to add Ether to the contract, ensuring through a require statement that the deposit amount is greater than zero, thus preventing empty transactions. The withdraw function permits the owner of the contract to withdraw a specified amount of Ether, incorporating multiple require statements to confirm that the amount does not exceed the contract's balance and that the caller is indeed the owner. Lastly, the check owner function uses an assert statement to verify that the caller is the contract owner, serving as a critical check to maintain the contract's integrity.

## Getting Started

### Executing program

To execute this program, you may use Remix, an online Solidity IDE; to get started, go visit https://remix.ethereum.org/.

Once on the Remix website, click the "+" symbol in the left-hand sidebar to create a new file. Save the file as HelloWorld.sol. Copy and paste the code below into the file.

```javascript
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ErrorHandlingDemo {
    address public user;
    uint256 public balance;

    constructor() {
        user = msg.sender;
    }

    // Function to deposit 
    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        balance += msg.value;
    }

    // Function to withdraw 
    function withdraw(uint256 amount) public {
        require(amount <= balance, "Insufficient balance");
        require(msg.sender == user, "Only the owner can withdraw");
        payable(msg.sender).transfer(amount);
        balance -= amount;
    }

    // Function to assert
    function checkOwner() public view {
        assert(user == msg.sender);
    }

    // Function to revert
    function triggerRevert() public view {
        if (msg.sender != user) {
            revert("Caller is not the owner");
        }
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
