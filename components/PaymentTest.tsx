'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { usePayment } from '@/lib/hooks/usePayment';
import { PaymentButton } from './PaymentButton';
import { InfoCard } from './InfoCard';
import { ActionLink } from './ActionLink';
import { formatPrice } from '@/lib/utils';
import { Wallet, RefreshCw, TestTube } from 'lucide-react';

export function PaymentTest() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { balance, error, refreshBalance } = usePayment();
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    if (isConnected) {
      refreshBalance();
    }
  }, [isConnected, refreshBalance]);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const handleConnect = () => {
    const connector = connectors[0];
    if (connector) {
      connect({ connector });
      addTestResult('Attempting to connect wallet...');
    }
  };

  const handleDisconnect = () => {
    disconnect();
    addTestResult('Wallet disconnected');
    setTestResults([]);
  };

  const handlePaymentSuccess = (transactionHash: string) => {
    addTestResult(`✅ Payment successful! TX: ${transactionHash}`);
  };

  const handlePaymentError = (error: string) => {
    addTestResult(`❌ Payment failed: ${error}`);
  };

  const handleRefreshBalance = async () => {
    addTestResult('Refreshing USDC balance...');
    await refreshBalance();
    addTestResult(`Balance updated: ${balance !== null ? formatPrice(balance) : 'Unknown'}`);
  };

  return (
    <div className="space-y-6">
      <InfoCard>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <TestTube className="w-5 h-5 text-accent" />
            <h3 className="text-heading">x402 Payment Flow Test</h3>
          </div>
          
          <div className="text-sm text-white text-opacity-80">
            This component tests the x402 payment integration with USDC on Base.
          </div>
        </div>
      </InfoCard>

      {/* Wallet Connection */}
      <InfoCard>
        <div className="space-y-4">
          <h4 className="text-heading">Wallet Connection</h4>
          
          {!isConnected ? (
            <div className="space-y-3">
              <p className="text-sm text-white text-opacity-80">
                Connect your wallet to test payments
              </p>
              <ActionLink variant="primary" onClick={handleConnect}>
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </ActionLink>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm">
                <p className="text-white text-opacity-80">Connected Address:</p>
                <p className="font-mono text-xs break-all">{address}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white text-opacity-80">USDC Balance:</p>
                  <p className="text-lg font-semibold">
                    {balance !== null ? formatPrice(balance) : 'Loading...'}
                  </p>
                </div>
                <ActionLink variant="secondary" onClick={handleRefreshBalance}>
                  <RefreshCw className="w-4 h-4" />
                </ActionLink>
              </div>

              <ActionLink variant="secondary" onClick={handleDisconnect}>
                Disconnect
              </ActionLink>
            </div>
          )}

          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg p-3">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}
        </div>
      </InfoCard>

      {/* Payment Tests */}
      {isConnected && (
        <InfoCard>
          <div className="space-y-4">
            <h4 className="text-heading">Payment Tests</h4>
            
            <div className="grid gap-4">
              {/* Small Payment Test */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Test Small Payment ($0.50)</p>
                <PaymentButton
                  contentId="test-small"
                  amount={50} // 50 cents
                  description="Test small payment"
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
              </div>

              {/* Medium Payment Test */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Test Medium Payment ($1.00)</p>
                <PaymentButton
                  contentId="test-medium"
                  amount={100} // $1.00
                  description="Test medium payment"
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
              </div>

              {/* Large Payment Test */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Test Large Payment ($5.00)</p>
                <PaymentButton
                  contentId="test-large"
                  amount={500} // $5.00
                  description="Test large payment"
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
              </div>
            </div>
          </div>
        </InfoCard>
      )}

      {/* Test Results */}
      {testResults.length > 0 && (
        <InfoCard>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-heading">Test Results</h4>
              <ActionLink 
                variant="secondary" 
                onClick={() => setTestResults([])}
                className="text-xs"
              >
                Clear
              </ActionLink>
            </div>
            
            <div className="bg-black bg-opacity-30 rounded-lg p-3 max-h-48 overflow-y-auto">
              <div className="font-mono text-xs space-y-1">
                {testResults.map((result, index) => (
                  <div key={index} className="text-white text-opacity-80">
                    {result}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </InfoCard>
      )}
    </div>
  );
}
