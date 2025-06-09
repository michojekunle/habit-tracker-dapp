import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { HabitDashboard } from "../components/HabitDashboard";
import { Plus, Target, TrendingUp, Award } from "lucide-react";

const client = createThirdwebClient({
  clientId: "31cc371dbd8eae466df41db7f2c964a4",
});

export const rootstockTestnet = defineChain({
  id: 31,
  name: "Rootstock Testnet",
  rpc: "https://public-node.testnet.rsk.co",
  nativeCurrency: {
    name: "tRBTC",
    symbol: "tRBTC",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "RSK Testnet Explorer",
      url: "https://explorer.testnet.rootstock.io/",
    },
    {
      name: "Blockscout Testnet Explorer",
      url: "https://rootstock-testnet.blockscout.com/",
    },
  ],
  testnet: true,
});

const Index = () => {
  const account = useActiveAccount();

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-8 shadow-lg">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              HabitTracker
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Stake your commitment, track your progress, and earn rewards for
              building life-changing habits.
            </p>

            {/* Connect Wallet Button */}
            <div className="mb-12">
              <ConnectButton
                client={client}
                chain={rootstockTestnet}
                connectButton={{
                  label: "Connect Wallet to Start",
                  style: {
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    fontSize: "18px",
                    padding: "16px 32px",
                    borderRadius: "12px",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "600",
                    boxShadow: "0 10px 25px rgba(102, 126, 234, 0.3)",
                    transition: "all 0.3s ease",
                  },
                }}
              />
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Stake & Commit
              </h3>
              <p className="text-gray-600">
                Put your money where your motivation is. Stake tRBTC to create
                accountability for your habits.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Track Progress
              </h3>
              <p className="text-gray-600">
                Daily check-ins, streak tracking, and beautiful progress
                visualization keep you motivated.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Earn Rewards
              </h3>
              <p className="text-gray-600">
                Complete 80% of your habit and get your stake back, plus bonus
                rewards for streaks!
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-bold text-purple-600">7-365</div>
                <div className="text-gray-600">Days Range</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">80%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-indigo-600">
                  0.001 tRBTC
                </div>
                <div className="text-gray-600">Streak Bonus</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">∞</div>
                <div className="text-gray-600">Possibilities</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <HabitDashboard client={client} chain={rootstockTestnet} />;
};

export default Index;
