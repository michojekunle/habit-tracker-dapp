
export const HABIT_TRACKER_ABI = [
  {
    "type": "function",
    "name": "createHabit",
    "stateMutability": "payable",
    "inputs": [
      {"type": "uint256", "name": "_durationDays"},
      {"type": "uint256", "name": "_dailyStake"}
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "checkIn",
    "stateMutability": "nonpayable",
    "inputs": [
      {"type": "uint256", "name": "_habitId"}
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "finalizeHabit",
    "stateMutability": "nonpayable",
    "inputs": [
      {"type": "uint256", "name": "_habitId"}
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "getHabit",
    "stateMutability": "view",
    "inputs": [
      {"type": "address", "name": "_user"},
      {"type": "uint256", "name": "_habitId"}
    ],
    "outputs": [
      {
        "type": "tuple",
        "components": [
          {"type": "address", "name": "user"},
          {"type": "uint256", "name": "startTime"},
          {"type": "uint256", "name": "durationDays"},
          {"type": "uint256", "name": "dailyStake"},
          {"type": "uint256", "name": "checkIns"},
          {"type": "uint256", "name": "streak"},
          {"type": "bool", "name": "active"},
          {"type": "uint256", "name": "lastCheckIn"}
        ]
      }
    ]
  }
] as const;
