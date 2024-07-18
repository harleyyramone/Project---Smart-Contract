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
