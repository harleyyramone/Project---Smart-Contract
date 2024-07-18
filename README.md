# Project-Smart-Contract-Management

This project utilizes a smart contract on the Ethereum blockchain to manage Movie Ticket purchases and refunds. It uses Solidity to enable safe, transparent, and automated transactions, allowing users to purchase and return tickets while keeping a detailed record of all transactions.

## Description

The MovieTicket smart contract enables users to purchase and refund movie tickets. Users can purchase a ticket by transferring one ether, which identifies the seat as occupied and records the transaction. If a user requests a refund when the seat is taken, the seat becomes vacant again and the ether is returned to the user. The contract tracks seat occupancy, maintains a transaction history, and allows users to examine balances and seat status. The contract starts with the owner having a balance of 100 ether to facilitate reimbursements.



## Getting Started

### Executing program

To execute this program, you may use Remix, an online Solidity IDE; to get started, go visit https://remix.ethereum.org/.

Once on the Remix website, click the "+" symbol in the left-hand sidebar to create a new file. Save the file as HelloWorld.sol. Copy and paste the code below into the file.

```javascript
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MovieTicket {
    address public owner;
    mapping(uint256 => bool) public seatOccupied;
    mapping(address => uint256) public balances;

    struct Transaction {
        address user;
        uint256 seatNumber;
        string action; // "buy" or "refund"
        uint256 timestamp;
    }

    Transaction[] public transactions;

    constructor() {
        owner = msg.sender;
        balances[owner] = 100 ether; // Initialize owner's balance to 100 ETH
    }

    function buyTicket(uint256 seatNumber) external payable {
        require(msg.value >= 1 ether, "Insufficient funds to buy ticket");
        require(seatNumber >= 1 && seatNumber <= 10, "Invalid seat number");
        require(!seatOccupied[seatNumber], "Seat already occupied");
        require(balances[msg.sender] >= 1 ether, "Insufficient balance");

        // Mark seat as occupied
        seatOccupied[seatNumber] = true;

        // Deduct from sender's balance
        balances[msg.sender] -= 1 ether;

        // Log transaction
        transactions.push(Transaction(msg.sender, seatNumber, "buy", block.timestamp));
    }

    function refundTicket(uint256 seatNumber) external {
        require(seatOccupied[seatNumber], "Seat is not occupied");

        // Refund ticket
        require(balances[owner] >= 1 ether, "Owner has insufficient balance to refund");
        balances[owner] -= 1 ether;
        balances[msg.sender] += 1 ether;
        payable(msg.sender).transfer(1 ether);

        // Mark seat as vacant
        seatOccupied[seatNumber] = false;

        // Log transaction
        transactions.push(Transaction(msg.sender, seatNumber, "refund", block.timestamp));
    }

    function getTakenSeats() external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= 10; i++) {
            if (seatOccupied[i]) {
                count++;
            }
        }

        uint256[] memory takenSeats = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= 10; i++) {
            if (seatOccupied[i]) {
                takenSeats[index] = i;
                index++;
            }
        }

        return takenSeats;
    }

    function getTransactionHistory() external view returns (Transaction[] memory) {
        return transactions;
    }

    function getBalance() external view returns (uint256) {
        return balances[msg.sender];
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
