import { useState, useEffect } from "react";
import mintTokenAbi from "../mintTokenAbi.json";
import {
  MdKeyboardDoubleArrowDown,
  MdKeyboardDoubleArrowUp,
  MdOutlineSend,
  MdHourglassBottom,
} from "react-icons/md";
import OptionCard from "./OptionCard";
import contractAddress from "../contractAddress.json";

const TokenCard = ({ account, web3, address, owner, walletAccount }) => {
  const [name, setName] = useState("TOKEN");
  const [symbol, setSymbol] = useState("SYM");
  const [balance, setBalance] = useState(0);
  const [contract, setContract] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [inputAccount, setInputAccount] = useState("");
  const [inputValue, setInputValue] = useState("0");

  const getName = async () => {
    try {
      const response = await contract.methods.name().call();

      setName(response);
    } catch (err) {
      console.error(err);
    }
  };

  const getSymbol = async () => {
    try {
      const response = await contract.methods.symbol().call();

      setSymbol(response);
    } catch (err) {
      console.error(err);
    }
  };

  const getBalanceOf = async () => {
    try {
      const response = await contract.methods.balanceOf(account).call();

      setBalance(Number(web3.utils.fromWei(response, "ether")));
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmitSend = async (e) => {
    try {
      e.preventDefault();

      const response = await contract.methods
        .transfer(inputAccount, web3.utils.toWei(inputValue, "ether"))
        .send({ from: account });

      getBalanceOf();

      setInputValue("0");
      alert("Sending Complete.");
    } catch (err) {
      console.error(err);
    }
  };

  const onClickClipBoard = async () => {
    try {
      await navigator.clipboard.writeText(walletAccount);
      alert("Wallet Address is Copied");
    } catch (err) {
      console.error(err);
    }
  };

  const onClickOpen = () => {
    if (isOpen === false) setIsOpen(true);
    else setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!web3) return;

    setContract(new web3.eth.Contract(mintTokenAbi, address));
  }, [web3]);

  useEffect(() => {
    if (!contract || !account) return;

    getBalanceOf();
    getName();
    getSymbol();
  }, [contract, account]);

  return (
    <>
      <div className="flex gap-2 mt-3">
        <button
          className="text-lg font-bold hover:text-cyan-400"
          onClick={onClickClipBoard}
        >
          {owner}'s 🪙
        </button>
        <button className="text-lg hover:text-2xl" onClick={onClickOpen}>
          {isOpen ? <MdKeyboardDoubleArrowUp /> : <MdKeyboardDoubleArrowDown />}
        </button>
      </div>
      <div className="flex">
        <span className="">{name}</span>
        <span className="">{balance.toFixed(4)}</span>
        <span className="">({symbol})</span>
        <form className="flex" onSubmit={onSubmitSend}>
          <select
            value={inputAccount}
            onChange={(e) => setInputAccount(e.target.value)}
          >
            {contractAddress.map((v, i) => (
              <OptionCard
                key={i}
                walletAccount={v.walletAccount}
                owner={v.owner}
              />
            ))}
          </select>
          <input
            className="bg-blue-100"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit">
            <MdOutlineSend className="bg-cyan-400 rounded-full text-white hover:text-black" />
          </button>
        </form>
      </div>
    </>
  );
};

export default TokenCard;
