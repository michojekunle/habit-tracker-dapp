import { useState, useEffect } from "react";
import {
  useActiveAccount,
  useReadContract,
  useSendAndConfirmTransaction,
} from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Flame, Target, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ActiveHabitsProps {
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
  // Additional fields for completed habits
  success: boolean;
  reward: bigint;
  completedAt: bigint;
}

export const ActiveHabits = ({ contract }: ActiveHabitsProps) => {
  const account = useActiveAccount();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checkedInToday, setCheckedInToday] = useState<{
    [key: number]: boolean;
  }>({});
  const [currentlyCheckingIn, setCurrentlyCheckingIn] = useState<number | null>(
    null
  );

  const { mutate: sendAndConfirmTransaction, isPending } =
    useSendAndConfirmTransaction();

  const { data: allHabits, refetch: refetchHabits } = useReadContract({
    contract,
    method:
      "function getAllHabits(address _user) view returns ((address user, bool active, bool isCompleted, string title, uint256 startTime, uint256 durationDays, uint256 dailyStake, uint256 checkIns, uint256 streak, uint256 lastCheckIn, uint256 completedAt)[] memory)",
    params: [account?.address || ""],
  });

  useEffect(() => {
    setHabits((allHabits as unknown as Habit[]) || []);
    console.log("Fetched Habits:", allHabits);
  }, [account, allHabits]);

  const handleCheckIn = async (habitId: number) => {
    try {
      setCurrentlyCheckingIn(habitId);
      const transaction = prepareContractCall({
        contract,
        method: "function checkIn(uint256 _habitId) external",
        params: [BigInt(habitId)],
      });

      sendAndConfirmTransaction(transaction, {
        onSuccess: () => {
          toast({
            title: "Success!",
            description: "Daily check-in completed! Keep up the great work!",
          });
          setCheckedInToday((prev) => ({ ...prev, [habitId]: true }));
          setCurrentlyCheckingIn(null);
        },
        onError: (error) => {
          toast({
            title: "Check-in Failed",
            description: error.message,
            variant: "destructive",
          });
          setCurrentlyCheckingIn(null);
        },
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check in",
        variant: "destructive",
      });
      setCurrentlyCheckingIn(null);
    }
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  };

  const getDaysRemaining = (startTime: bigint, duration: bigint) => {
    const startMs = Number(startTime) * 1000;
    const endMs = startMs + Number(duration) * 24 * 60 * 60 * 1000;
    const remainingMs = endMs - Date.now();
    return Math.max(0, Math.ceil(remainingMs / (24 * 60 * 60 * 1000)));
  };

  const getProgress = (checkIns: bigint, duration: bigint) => {
    return (Number(checkIns) / Number(duration)) * 100;
  };

  const canCheckInToday = (lastCheckIn: bigint) => {
    const lastCheckInMs = Number(lastCheckIn) * 1000;
    const oneDayMs = 24 * 60 * 60 * 1000;
    return Date.now() - lastCheckInMs >= oneDayMs - 2 * 60 * 60 * 1000; // 2-hour buffer
  };

  if (habits.length === 0) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
        <CardContent className="p-8 text-center">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No Active Habits
          </h3>
          <p className="text-gray-500">
            Create your first habit to get started on your journey!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {habits.map((habit, index) => {
        if (!habit.active) return null; // Skip inactive habits
        const progress = getProgress(habit.checkIns, habit.durationDays);
        const daysRemaining = getDaysRemaining(
          habit.startTime,
          habit.durationDays
        );
        const canCheckIn =
          canCheckInToday(habit.lastCheckIn) && !checkedInToday[index];
        const successThreshold = 80;
        const isOnTrack =
          progress >=
          successThreshold * (1 - daysRemaining / Number(habit.durationDays));

        return (
          <Card
            key={index}
            className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                    {habit.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {Number(habit.durationDays)} days
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {daysRemaining} left
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={isOnTrack ? "default" : "destructive"}
                    className="flex items-center gap-1"
                  >
                    <Target className="w-3 h-3" />
                    {isOnTrack ? "On Track" : "Behind"}
                  </Badge>
                  {Number(habit.streak) >= 3 && (
                    <Badge className="bg-gradient-to-r from-orange-400 to-red-500 flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      {Number(habit.streak)} streak
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>
                    {Number(habit.checkIns)}/{Number(habit.durationDays)} days (
                    {progress.toFixed(1)}%)
                  </span>
                </div>
                <Progress value={progress} className="h-3" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{progress.toFixed(1)}%</span>
                  <span className="text-purple-600">80% needed</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <div className="text-2xl font-bold text-blue-600">
                    {Number(habit.checkIns)}
                  </div>
                  <div className="text-xs text-gray-600">Check-ins</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-100">
                  <div className="text-2xl font-bold text-orange-600">
                    {Number(habit.streak)}
                  </div>
                  <div className="text-xs text-gray-600">Current Streak</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100 col-span-2 sm:col-span-1">
                  <div className="text-2xl font-bold text-green-600">
                    {(Number(habit.dailyStake) / 1e18).toFixed(5)}
                  </div>
                  <div className="text-xs text-gray-600">
                    Daily Stake (tRBTC)
                  </div>
                </div>
              </div>

              {/* Check-in Button */}
              <Button
                onClick={() => handleCheckIn(index)}
                disabled={
                  !canCheckIn ||
                  (currentlyCheckingIn !== null && currentlyCheckingIn == index)
                }
                className={`w-full ${
                  canCheckIn
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    : "bg-gray-300"
                }`}
              >
                {checkedInToday[index] ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Checked in today!
                  </>
                ) : checkedInToday[index] === undefined &&
                  currentlyCheckingIn !== null &&
                  currentlyCheckingIn == index ? (
                  <>
                    <Clock className="w-4 h-4 mr-2" />
                    Checking in...
                  </>
                ) : canCheckIn ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Check In Now
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 mr-2" />
                    Already checked in
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
