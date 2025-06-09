
import { useState } from 'react';
import { ConnectButton } from "thirdweb/react";
import { getContract } from "thirdweb";
import { CreateHabitForm } from './CreateHabitForm';
import { ActiveHabits } from './ActiveHabits';
import { CompletedHabits } from './CompletedHabits';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Plus, Clock, Trophy } from 'lucide-react';

const CONTRACT_ADDRESS = "0x41B276f514B04a6C39b692AA3531f98d3904e37D"; 

interface HabitDashboardProps {
  client: any;
  chain: any;
}

export const HabitDashboard = ({ client, chain }: HabitDashboardProps) => {
  const [activeTab, setActiveTab] = useState("active");

  const contract = getContract({
    client,
    chain,
    address: CONTRACT_ADDRESS,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-8">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                My Habits
              </h1>
              <p className="text-gray-600">Track your progress and build consistency</p>
            </div>
          </div>
          <ConnectButton client={client} theme={"light"}/>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Create Habit Form */}
          <div className="lg:col-span-1">
            <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Plus className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-semibold">Create New Habit</h2>
                </div>
                <CreateHabitForm contract={contract} />
              </CardContent>
            </Card>
          </div>

          {/* Habits Tabs */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/50 backdrop-blur-sm">
                <TabsTrigger value="active" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Active Habits
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Completed
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="mt-6">
                <ActiveHabits contract={contract} />
              </TabsContent>
              
              <TabsContent value="completed" className="mt-6">
                <CompletedHabits contract={contract} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
