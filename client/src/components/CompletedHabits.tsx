import { useState, useEffect } from "react";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, CheckCircle, XCircle } from "lucide-react";

interface CompletedHabitsProps {
  contract: any;
}

interface Habit {
  title: string;
  user: string;
  startTime: bigint;
  durationDays: bigint;
  dailyStake: bigint;
  checkIns: bigint;
  streak: bigint;
  active: boolean;
  lastCheckIn: bigint;
  isCompleted: boolean;
  completedAt: bigint;
}

export const STREAK_REWARD = BigInt(1000000000000000); // 0.001 RBTC in wei --normally we'd use viem or ethers to parse this
export const STREAK_BONUS_THRESHOLD = BigInt(3); // Example threshold for streak bonus

export const CompletedHabits = ({ contract }: CompletedHabitsProps) => {
  const account = useActiveAccount();
  interface HabitWithExtras extends Habit {
    reward: bigint;
    success: boolean;
  }
  const [completedHabits, setCompletedHabits] = useState<HabitWithExtras[]>([]);

  const { data: allHabits, refetch: refetchHabits } = useReadContract({
    contract,
    method:
      "function getAllHabits(address _user) view returns ((address user, bool active, bool isCompleted, string title, uint256 startTime, uint256 durationDays, uint256 dailyStake, uint256 checkIns, uint256 streak, uint256 lastCheckIn, uint256 completedAt)[] memory)",
    params: [account?.address || ""],
  });

  useEffect(() => {
    refetchHabits();

    setCompletedHabits(
      (allHabits || [])
        .filter((habit: Habit) => habit.isCompleted)
        .map((habit: Habit) => {
          const success = habit.checkIns >= Number(habit.durationDays) * 0.8;
          const reward = success
            ? BigInt(habit.dailyStake) * BigInt(habit.durationDays) +
                habit.streak >
              STREAK_BONUS_THRESHOLD
              ? STREAK_REWARD
              : BigInt(0)
            : BigInt(0);
          return {
            ...habit,
            reward,
            success,
          };
        })
    );
  }, [account]);

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp)).toLocaleDateString();
  };

  const getSuccessRate = (checkIns: bigint, duration: bigint) => {
    return (Number(checkIns) / Number(duration)) * 100;
  };

  if (completedHabits.length === 0) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
        <CardContent className="p-8 text-center">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No Completed Habits
          </h3>
          <p className="text-gray-500">
            Complete your first habit to see your achievements here!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {completedHabits.filter((h) => h.success).length}
            </div>
            <div className="text-sm text-gray-600">Successful Habits</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {completedHabits.filter((h) => !h.success).length}
            </div>
            <div className="text-sm text-gray-600">Failed Habits</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {completedHabits.length > 0
                ? (
                    (completedHabits.filter((h) => h.success).length /
                      completedHabits.length) *
                    100
                  ).toFixed(0)
                : 0}
              %
            </div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Completed Habits List */}
      {completedHabits.map((habit, idx) => {
        const successRate = getSuccessRate(habit.checkIns, habit.durationDays);

        return (
          <Card
            key={`${habit.user}_habit_${idx + 1}`}
            className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {habit.success ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    {habit.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Completed {formatDate(habit.completedAt)}
                    </div>
                  </div>
                </div>
                <Badge variant={habit.success ? "default" : "destructive"}>
                  {habit.success ? "Success" : "Failed"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {Number(habit.checkIns)}
                  </div>
                  <div className="text-xs text-gray-600">Check-ins</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-lg font-bold text-orange-600">
                    {Number(habit.streak)}
                  </div>
                  <div className="text-xs text-gray-600">Best Streak</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    {successRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600">Success Rate</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">
                    {(Number(habit.reward) / 1e18).toFixed(3)}
                  </div>
                  <div className="text-xs text-gray-600">Reward (tRBTC)</div>
                </div>
              </div>

              {/* Results */}
              {habit.success ? (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-700">
                    <Trophy className="w-5 h-5" />
                    <span className="font-semibold">Congratulations!</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    You successfully completed this habit and earned{" "}
                    {(Number(habit.reward) / 1e18).toFixed(3)} tRBTC!
                    {Number(habit.streak) >= 3 && " Including streak bonus!"}
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 text-red-700">
                    <XCircle className="w-5 h-5" />
                    <span className="font-semibold">Habit Not Completed</span>
                  </div>
                  <p className="text-sm text-red-600 mt-1">
                    You needed 80% check-ins but only achieved{" "}
                    {successRate.toFixed(1)}%. Your stake was added to the
                    reward pool.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
