import { usePhantom } from './hooks/usePhantom';
import { Button } from '@/components/ui/button';

export default function App() {
  const { walletAddress, solBalance, assBalance, isConnected, connect, disconnect } = usePhantom();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-6xl font-black mb-8">ASS SLOTS</h1>

      {!isConnected ? (
        <Button onClick={connect} className="bg-white text-black px-8 py-4 text-lg">
          Connect Phantom
        </Button>
      ) : (
        <div>
          <p className="mb-4">Connected: {walletAddress}</p>
          <p>SOL: {solBalance.toFixed(2)}</p>
          <p>$ASSLOTS: {assBalance}</p>

          <div className="mt-6 flex gap-4">
            <Button onClick={disconnect} variant="outline">Disconnect</Button>
            <Button onClick={() => window.open('https://jup.ag/swap/CHuVCZjy7wzK2A4pLqAFCgiXX1A2cUwmeMHdpjW6FqUX-SOL', '_blank')}>
              Cash Out on Jupiter
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}