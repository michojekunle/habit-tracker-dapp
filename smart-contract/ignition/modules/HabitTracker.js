const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("HabitTrackerModule", (m) => {
  const HabitTracker = m.contract("HabitTracker");

  return { HabitTracker };
});