import './App.css';
import web3 from "./web3";
import lottery from "./lottery";
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";

function App() {
  const [manager, setManager] = useState("loading manager address...");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState("0");
  const [message, setMessage] = useState("")
  const { handleSubmit } = useForm()

  console.log(value)

  
  useEffect(() => {
    async function fetchManager() { //do not need to specify which account this is from as metamask already chooses the account
      const manager = await lottery.methods.manager().call(); 
      setManager(manager)
    } 

    fetchManager();

    async function getPlayers() {
      const players = await lottery.methods.getPlayers().call();
      setPlayers(players);
    }

    getPlayers();

    async function getBalance() {
      const balance = await web3.eth.getBalance(lottery.options.address);
      setBalance(balance);
    }

    getBalance();

  }, []);

  const onSubmit = async () => {  
    const accounts = await web3.eth.getAccounts();

    const message = "waiting on transaction success..."
    setMessage(message);

    await lottery.methods.enter().send({
      from: accounts[0], 
      value: web3.utils.toWei(value, "ether")
    });

    const messageTwo = "Transaction has succeded!"
    setMessage(messageTwo);
  };

  const pickWinner = async () => {
    const accounts = await web3.eth.getAccounts();

    const message = "waiting on transaction success..."
    setMessage(message);

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    })

    const messageWin = "a winner has been picked!"
    setMessage(messageWin);

  }

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>this contract is managed by {manager}</p>
      <p>the number of players competing to win the lottery contract is {players.length}</p>
      <p>the balance of the contract is {web3.utils.fromWei(balance, "ether")} ether</p>
      <hr />
      <form onSubmit={handleSubmit(onSubmit)}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>amount of ether to enter</label>
          <input 
            value = {value}
            onChange={event => setValue(event.target.value)}
          />
          <button>Enter</button>
        </div>
      </form>
      <hr />
        <h4>Ready to pick a winner?</h4>
        <button onClick={handleSubmit(pickWinner)}>Pick a winner</button>
      <hr />
      <h1>{message}</h1>
    </div>
  );
}

export default App;
