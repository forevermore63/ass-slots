import { useState } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

declare global {
  interface Window { solana?: any; }
}

const MINT = "CHuVCZjy7wzK2A4pLqAFCgiXX1A2cUwmeMHdpjW6FqUX";

export const usePhantom = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [solBalance, setSolBalance] = useState(0);
  const [assBalance, setAssBalance] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const connection = new Connection("https://api.mainnet-beta.solana.com");

  const connect = async () => {
    if (!window.solana?.isPhantom) {
      alert("Phantom not found");
      return;
    }
    const resp = await window.solana.connect();
    const addr = resp.publicKey.toString();
    setWalletAddress(addr);
    setIsConnected(true);

    // Fetch balances
    const pubkey = new PublicKey(addr);
    const sol = await connection.getBalance(pubkey);
    setSolBalance(sol / LAMPORTS_PER_SOL);

    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubkey, { mint: new PublicKey(MINT) });
    if (tokenAccounts.value.length > 0) {
      setAssBalance(tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount || 0);
    }
  };

  const disconnect = () => {
    window.solana?.disconnect();
    setWalletAddress(null);
    setIsConnected(false);
    setSolBalance(0);
    setAssBalance(0);
  };

  return { walletAddress, solBalance, assBalance, isConnected, connect, disconnect };
};