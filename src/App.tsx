import { useState } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

const MINT = "CHuVCZjy7wzK2A4pLqAFCgiXX1A2cUwmeMHdpjW6FqUX";

export default function App() {
  const [address, setAddress] = useState("");
  const [sol, setSol] = useState(0);
  const [ass, setAss] = useState(0);
  const [connected, setConnected] = useState(false);

  const connect = async () => {
    const solana = (window as any).solana;
    if (!solana?.isPhantom) {
      alert("Install Phantom wallet from phantom.app");
      return;
    }

    try {
      const resp = await solana.connect();
      const addr = resp.publicKey.toString();
      setAddress(addr);
      setConnected(true);

      const connection = new Connection("https://api.mainnet-beta.solana.com");
      const pubkey = new PublicKey(addr);

      const balance = await connection.getBalance(pubkey);
      setSol(balance / LAMPORTS_PER_SOL);

      const tokens = await connection.getParsedTokenAccountsByOwner(pubkey, {
        mint: new PublicKey(MINT),
      });

      if (tokens.value.length > 0) {
        setAss(tokens.value[0].account.data.parsed.info.tokenAmount.uiAmount || 0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const disconnect = () => {
    (window as any).solana?.disconnect();
    setConnected(false);
    setAddress("");
    setSol(0);
    setAss(0);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-7xl font-black mb-4">ASS SLOTS</h1>
      <p className="text-emerald-400 text-xl mb-8">Poke it. Lick it. Pull out… or hold.</p>

      {!connected ? (
        <button 
          onClick={connect}
          className="bg-white text-black px-8 py-4 text-xl font-bold rounded-xl"
        >
          Connect Phantom
        </button>
      ) : (
        <div className="max-w-md">
          <p className="mb-2 text-sm text-zinc-400">Connected:</p>
          <p className="font-mono text-sm break-all mb-6">{address}</p>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <div className="text-xs text-zinc-400">SOL</div>
              <div className="text-5xl font-bold">{sol.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-xs text-zinc-400">$ASSLOTS</div>
              <div className="text-5xl font-bold text-emerald-400">{ass}</div>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={disconnect}
              className="px-6 py-3 border border-white/30 rounded-xl"
            >
              Disconnect
            </button>
            <button 
              onClick={() => window.open(`https://jup.ag/swap/${MINT}-SOL`, "_blank")}
              className="flex-1 bg-emerald-500 text-black font-bold px-6 py-3 rounded-xl"
            >
              CASH OUT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
