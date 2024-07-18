import { useState, useEffect } from "react";
import { ethers } from "ethers";
import ticket_ABI from "../artifacts/contracts/Assessment.sol/MovieTicket.json";

const contractAddress = "0x9E545E3C0baAB3E08CdfD552C960A1050f373042";

function App() {
    const [ethWallet, setEthWallet] = useState(undefined);
    const [account, setAccount] = useState(undefined);
    const [contract, setContract] = useState(undefined);
    const [balance, setBalance] = useState("0.0");
    const [seatNumber, setSeatNumber] = useState("");
    const [refundSeatNumber, setRefundSeatNumber] = useState("");
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        async function initialize() {
            if (window.ethereum) {
                setEthWallet(window.ethereum);
                await getWallet();
            } else {
                console.error("MetaMask is not installed");
            }
        }

        initialize();
    }, []);

    const getWallet = async () => {
        if (ethWallet) {
            try {
                const accounts = await ethWallet.request({ method: "eth_accounts" });
                handleAccount(accounts);
            } catch (error) {
                console.error("Error fetching accounts:", error);
            }
        }
    };

    const handleAccount = (accounts) => {
        if (accounts.length > 0) {
            setAccount(accounts[0]);
            getContract();
        } else {
            console.log("No account found");
        }
    };

    const connectAccount = async () => {
        if (!ethWallet) {
            alert('MetaMask wallet is required to connect');
            return;
        }

        try {
            const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
            handleAccount(accounts);
        } catch (error) {
            console.error("Error connecting account:", error);
        }
    };

    const getContract = () => {
        if (ethWallet) {
            const provider = new ethers.providers.Web3Provider(ethWallet);
            const signer = provider.getSigner();
            const atmContract = new ethers.Contract(contractAddress, ticket_ABI.abi, signer);
            setContract(atmContract);
            getBalance();
            getTransactionHistory();
        }
    };

    const getBalance = async () => {
        if (contract && account) {
            try {
                const balanceBigNumber = await contract.getBalance();
                const formattedBalance = ethers.utils.formatEther(balanceBigNumber);
                setBalance(formattedBalance);
            } catch (error) {
                console.error("Error fetching balance:", error);
            }
        }
    };

    const getTransactionHistory = async () => {
        if (contract) {
            try {
                const txHistory = await contract.getTransactionHistory();
                const formattedTxHistory = txHistory.map(tx => ({
                    user: tx.user,
                    action: tx.action,
                    seatNumber: tx.seatNumber.toString(),
                    timestamp: tx.timestamp.toNumber()
                }));
                setTransactions(formattedTxHistory);
            } catch (error) {
                console.error("Error fetching transaction history:", error);
            }
        }
    };

    const buyTicket = async () => {
        if (!seatNumber || !contract) return;

        try {
            const tx = await contract.buyTicket(seatNumber, { value: ethers.utils.parseEther("1") });
            await tx.wait();
            alert("Ticket successfully purchased for seat " + seatNumber);
            getBalance();
            getTransactionHistory();
        } catch (error) {
            console.error("Error buying ticket:", error);
        }
    };

    const refundTicket = async () => {
        if (!refundSeatNumber || !contract) return;

        try {
            const tx = await contract.refundTicket(refundSeatNumber);
            await tx.wait();
            alert("Ticket successfully refunded for seat " + refundSeatNumber);
            getBalance();
            getTransactionHistory();
        } catch (error) {
            console.error("Error refunding ticket:", error);
        }
    };

    return (
        <main className="container">
            <header>
                <h1>Movie Ticket DApp</h1>
            </header>
            <div className="content">
                {ethWallet ? (
                    account ? (
                        <div className="account-info">
                            <p className="info">Your Account: {account}</p>
                            <p className="info">Your Balance: {balance} ETH</p>

                            <div className="actions">
                                <h3>Buy Ticket</h3>
                                <input
                                    type="number"
                                    value={seatNumber}
                                    onChange={(e) => setSeatNumber(e.target.value)}
                                    placeholder="Seat Number (1-10)"
                                    className="input"
                                />
                                <button className="button" onClick={buyTicket}>Buy Ticket</button>
                            </div>

                            <div className="actions">
                                <h3>Refund Ticket</h3>
                                <input
                                    type="number"
                                    value={refundSeatNumber}
                                    onChange={(e) => setRefundSeatNumber(e.target.value)}
                                    placeholder="Seat Number (1-10)"
                                    className="input"
                                />
                                <button className="button" onClick={refundTicket}>Refund Ticket</button>
                            </div>

                            <div className="transactions">
                                <h3>Transaction History</h3>
                                <ul>
                                    {transactions.map((tx, index) => (
                                        <li key={index}>
                                            {tx.user} {tx.action}ed seat {tx.seatNumber} at {new Date(tx.timestamp * 1000).toLocaleString()}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <button className="button connect-button" onClick={connectAccount}>Connect MetaMask</button>
                    )
                ) : (
                    <p>Please install MetaMask to use this DApp.</p>
                )}
            </div>

            <style jsx>{`
                .container {
                    font-family: 'Roboto', sans-serif;
                    text-align: center;
                    background: linear-gradient(to right, #6a11cb, #2575fc);
                    color: #fff;
                    padding: 20px;
                    border-radius: 10px;
                    max-width: 600px;
                    margin: 20px auto;
                }

                header {
                    margin-bottom: 20px;
                }

                header h1 {
                    font-size: 2.5rem;
                    margin: 0;
                }

                .content {
                    background: #fff;
                    color: #333;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }

                .account-info {
                    margin-bottom: 20px;
                }

                .info {
                    font-size: 1.2rem;
                }

                .actions {
                    margin-bottom: 20px;
                }

                .actions h3 {
                    margin: 0 0 10px;
                    color: #333;
                    font-size: 1.4rem;
                }

                .input {
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    width: 150px;
                    margin-right: 10px;
                }

                .button {
                    padding: 10px 20px;
                    background-color: #007bff;
                    border: none;
                    color: #fff;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: background-color 0.3s;
                }

                .button:hover {
                    background-color: #0056b3;
                }

                .connect-button {
                    background-color: #28a745;
                }

                .connect-button:hover {
                    background-color: #218838;
                }

                .transactions {
                    margin-top: 20px;
                }

                .transactions h3 {
                    margin-bottom: 10px;
                    color: #333;
                }

                .transactions ul {
                    list-style: none;
                    padding: 0;
                }

                .transactions li {
                    background-color: #f8f9fa;
                    padding: 10px;
                    border-radius: 5px;
                    margin-bottom: 5px;
                    font-size: 0.9rem;
                }
            `}</style>
        </main>
    );
}

export default App;
