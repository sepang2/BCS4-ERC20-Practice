import { useSDK } from "@metamask/sdk-react";
import { useEffect, useState } from "react";
import Web3 from "web3";
import TokenCard from "./components/TokenCard";
import contractAddress from "./contractAddress.json";

const App = () => {
  const { sdk, provider } = useSDK();

  const [account, setAccount] = useState("");
  const [web3, setWeb3] = useState();

  const onClickMetaMask = async () => {
    try {
      const accounts = await sdk?.connect();
      setAccount(accounts?.[0]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!provider) return;

    setWeb3(new Web3(provider));
  }, [provider]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      {account ? (
        <>
          <div className="flex gap-4">
            <div className="bg-cyan-400 rounded-full text-4xl px-4 text-white hover:animate-pulse">
              🪪 {account.substring(0, 7)}...
              {account.substring(account.length - 5)}
            </div>
            <button
              onClick={() => setAccount("")}
              className="bg-yellow-300 rounded-full px-2 py-1 text-4xl"
            >
              🔒
            </button>
          </div>
          {contractAddress.map((v, i) => (
            <TokenCard
              key={i}
              account={account}
              web3={web3}
              address={v.address}
              owner={v.owner}
              walletAccount={v.walletAccount}
            />
          ))}
        </>
      ) : (
        <button
          onClick={onClickMetaMask}
          className="bg-orange-500 rounded-full px-4 py-2 text-white font-bold hover:bg-orange-300 active:bg-orange-500 hover:animate-bounce"
        >
          🦊 LOGIN
        </button>
      )}
    </div>
  );
};

export default App;
