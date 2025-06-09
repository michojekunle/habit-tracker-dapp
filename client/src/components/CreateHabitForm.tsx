import { useState } from "react";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { toWei } from "thirdweb/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

interface CreateHabitFormProps {
  contract: any;
}

export const CreateHabitForm = ({ contract }: CreateHabitFormProps) => {
  const [duration, setDuration] = useState("");
  const [dailyStake, setDailyStake] = useState("");
  const [title, setTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const { mutate: sendAndConfirmTransaction, isPending } =
    useSendAndConfirmTransaction();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!duration || !dailyStake || !title) {
      toast.error("Error", {
        description: "Please fill in all fields",
        className: "bg-red-100 text-red-800",
      });
      return;
    }

    const durationDays = parseInt(duration);
    const stakeAmount = parseFloat(dailyStake);

    if (durationDays < 7 || durationDays > 365) {
      toast.error("Error", {
        description: "Duration must be between 7 and 365 days",
        className: "bg-red-100 text-red-800",
      });
      return;
    }

    if (stakeAmount <= 0) {
      toast.error("Error", {
        description: "Daily stake must be greater than 0",
        className: "bg-red-100 text-red-800",
      });
      return;
    }

    setIsCreating(true);

    try {
      const totalStake = stakeAmount * durationDays;

      const transaction = prepareContractCall({
        contract,
        method:
          "function createHabit(uint256 _durationDays, uint256 _dailyStake, string memory _title) external payable",
        params: [BigInt(durationDays), toWei(stakeAmount.toString()), title],
        value: toWei(totalStake.toString()),
      });
      
      // @ts-ignore
      sendAndConfirmTransaction(transaction, {
        onSuccess: () => {
          toast.success("Success!", {
            description: `Habit created! You've staked ${totalStake.toFixed(
              5
            )} tRBTC for ${durationDays} days.`,
          });
          setTitle("");
          setDuration("");
          setDailyStake("");
        },
        onError: (error) => {
          toast.error("Transaction Failed", {
            description: error.message,
            className: "bg-red-100 text-red-800",
          });
        },
      });
    } catch (error) {
      toast.error("Error", {
        description: "Failed to create habit",
        className: "bg-red-100 text-red-800",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const totalStake =
    duration && dailyStake
      ? (parseFloat(dailyStake) * parseInt(duration)).toFixed(4)
      : "0";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="dailyStake">Title</Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Exercise, Praying Daily, Study 1 hour"
          required
          autoFocus
          maxLength={50}
          pattern="^[a-zA-Z0-9\s]+$"
          title="Only letters, numbers, and spaces allowed"
          aria-describedby="titleHelp"
          aria-required="true"
          aria-invalid={!title || title.length < 3}
          aria-errormessage="titleError"
          aria-label="Habit Title"
          className="mt-1 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isCreating || isPending}
        />
      </div>
      <div>
        <Label htmlFor="duration">Duration (days)</Label>
        <Input
          id="duration"
          type="number"
          min="7"
          max="365"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="e.g., 30"
          className="mt-1 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isCreating || isPending}
        />
        <p className="text-sm text-gray-500 mt-1">Between 7 and 365 days</p>
      </div>

      <div>
        <Label htmlFor="dailyStake">Daily Stake (tRBTC)</Label>
        <Input
          id="dailyStake"
          type="number"
          step="0.00001"
          min="0.00001"
          value={dailyStake}
          onChange={(e) => setDailyStake(e.target.value)}
          placeholder="e.g., 0.01"
          className="mt-1 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isCreating || isPending}
          aria-describedby="dailyStakeHelp"
        />
        <p className="text-sm text-gray-500 mt-1">
          Amount you're willing to risk each day
        </p>
      </div>

      {duration && dailyStake && (
        <Card className="bg-gradient-to-r from-purple-100 to-blue-100 border-purple-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Stake Required</p>
              <p className="text-2xl font-bold text-purple-600">
                {totalStake} tRBTC
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Complete 80% to get your stake back + bonuses!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Button
        type="submit"
        disabled={isCreating || isPending || !duration || !dailyStake}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
      >
        {isCreating || isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating Habit...
          </>
        ) : (
          <>
            <Plus className="w-4 h-4 mr-2" />
            Create Habit
          </>
        )}
      </Button>
    </form>
  );
};
