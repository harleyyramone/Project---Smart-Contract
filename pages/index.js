import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [transactions, setTransactions] = useState([]);
  const [showTransactions, setShowTransactions] = useState(false);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait();
      getBalance();
      getTransactions();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait();
      getBalance();
      getTransactions();
    }
  };

  const getTransactions = async () => {
    if (atm) {
      const depositFilter = atm.filters.Deposit();
      const withdrawFilter = atm.filters.Withdraw();

      const depositEvents = await atm.queryFilter(depositFilter);
      const withdrawEvents = await atm.queryFilter(withdrawFilter);

      const allEvents = [...depositEvents, ...withdrawEvents];
      allEvents.sort((a, b) => a.blockNumber - b.blockNumber);

      const txs = allEvents.map(event => ({
        type: event.event,
        amount: event.args.amount.toNumber(),
        blockNumber: event.blockNumber,
      }));

      setTransactions(txs);
    }
  };

  const toggleTransactions = async () => {
    if (!showTransactions) {
      await getTransactions();
    }
    setShowTransactions(!showTransactions);
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
        <button onClick={connectAccount} style={buttonStyle}>
          Please connect your Metamask wallet
        </button>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <button onClick={deposit} style={buttonStyle} onMouseEnter={hoverEffect} onMouseLeave={resetEffect}>
          Deposit 1 ETH
        </button>
        <button onClick={withdraw} style={buttonStyle} onMouseEnter={hoverEffect} onMouseLeave={resetEffect}>
          Withdraw 1 ETH
        </button>
        <button onClick={toggleTransactions} style={buttonStyle} onMouseEnter={hoverEffect} onMouseLeave={resetEffect}>
          {showTransactions ? "Hide Transaction History" : "Show Transaction History"}
        </button>
        {showTransactions && (
          <ul>
            {transactions.map((tx, index) => (
              <li key={index}>
                {tx.type}: {tx.amount} ETH (Block: {tx.blockNumber})
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const buttonStyle = {
    backgroundColor: "#1c1c1c",
    color: "white",
    padding: "10px 20px",
    margin: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s, transform 0.3s",
  };

  const hoverEffect = (e) => {
    e.target.style.backgroundColor = "#555";
    e.target.style.transform = "scale(1.05)";
  };

  const resetEffect = (e) => {
    e.target.style.backgroundColor = "#1c1c1c";
    e.target.style.transform = "scale(1)";
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      <div className="card">{initUser()}</div>
      <style jsx>{`
        .container {
          text-align: center;
          background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: white;
        }

        .card {
          background: linear-gradient(135deg, #ffffff, #f0f0f0);
          color: #1c1c1c;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          text-align: center;
          max-width: 400px;
          width: 100%;
        }

        header h1 {
          font-size: 2em;
          animation: glow 1.5s ease-in-out infinite alternate;
        }

        @keyframes glow {
          from {
            text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #ff00ff, 0 0 40px #ff00ff,
              0 0 50px #ff00ff, 0 0 60px #ff00ff, 0 0 70px #ff00ff;
          }
          to {
            text-shadow: 0 0 20px #fff, 0 0 30px #ff00ff, 0 0 40px #ff00ff, 0 0 50px #ff00ff,
              0 0 60px #ff00ff, 0 0 70px #ff00ff, 0 0 80px #ff00ff;
          }
        }
      `}</style>
    </main>
  );
}
