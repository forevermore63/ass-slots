import { useState, useMemo } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

declare global {
  interface Window {
    solana?: any;
  }
}

const MINT = "CHuVCZjy7wzK2A4pLqAFCgiXX1A2cUwmeMHdpjW6FqUX";

export function usePhantom() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [assBalance, setAssBalance] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const connection = useMemo(
    () => new Connection("https://api.mainnet-beta.solana.com"),
    []
  );

  const connect = async () => {
    if (!window.solana?.isPhantom) {
      alert("Phantom wallet not found");
      return;
    }

    try {
      const response = await window.solana.connect();
      const address = response.publicKey.toString();
      setWalletAddress(address);
      setIsConnected(true);

      const pubKey = new PublicKey(address);
      const solLamports = await connection.getBalance(pubKey);
      setSolBalance(solLamports / LAMPORTS_PER_SOL);

      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubKey, {
        mint: new PublicKey(MINT),
      });

      if (tokenAccounts.value.length > 0) {
        const amount = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount || 0;
        setAssBalance(amount);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const disconnect = () => {
    if (window.solana) {
      window.solana.disconnect();
    }
    setWalletAddress(null);
    setIsConnected(false);
    setSolBalance(0);
    setAssBalance(0);
  };

  return {
    walletAddress,
    solBalance,
    assBalance,
    isConnected,
    connect,
    disconnect,
  };
}
