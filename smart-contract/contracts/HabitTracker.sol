// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract HabitTracker {
    address public admin;

    struct Habit {
        address user;
        string title;
        uint256 startTime;
        uint256 durationDays;
        uint256 dailyStake;
        uint256 checkIns;
        uint256 streak;
        bool active;
        bool isCompleted;
        uint256 lastCheckIn;
        bool success;
        uint256 reward;
        uint256 completedAt;
    }

    mapping(address => Habit[]) public habitsByUser;
    uint256 public totalPool;
    uint256 public constant STREAK_BONUS = 0.001 ether; // Bonus for streaks > 3 days
    uint256 public constant MIN_DURATION = 7;
    uint256 public constant MAX_DURATION = 365;
    uint256 public constant SUCCESS_THRESHOLD = 80; // 80% check-ins required

    event HabitCreated(
        address indexed user,
        string title,
        uint256 habitId,
        uint256 durationDays,
        uint256 dailyStake
    );
    event CheckedIn(
        address indexed user,
        uint256 habitId,
        uint256 day,
        uint256 streak
    );
    event HabitCompleted(
        address indexed user,
        uint256 habitId,
        bool success,
        uint256 reward
    );
    event PoolWithdrawn(address indexed admin, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function createHabit(
        uint256 _durationDays,
        uint256 _dailyStake,
        string memory _title
    ) external payable {
        require(
            _durationDays >= MIN_DURATION && _durationDays <= MAX_DURATION,
            "Duration must be 7-365 days"
        );
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_dailyStake > 0, "Stake must be greater than 0");
        uint256 totalStake = _dailyStake * _durationDays;
        require(msg.value == totalStake, "Incorrect stake amount");

        uint256 habitId = habitsByUser[msg.sender].length;
        habitsByUser[msg.sender].push(
            Habit({
                user: msg.sender,
                title: _title,
                startTime: block.timestamp,
                durationDays: _durationDays,
                dailyStake: _dailyStake,
                checkIns: 0,
                streak: 0,
                active: true,
                isCompleted: false,
                lastCheckIn: 0,
                success: false,
                reward: 0,
                completedAt: 0
            })
        );

        emit HabitCreated(
            msg.sender,
            _title,
            habitId,
            _durationDays,
            _dailyStake
        );
    }

    function checkIn(uint256 _habitId) external {
        Habit storage habit = habitsByUser[msg.sender][_habitId];
        require(habit.active, "Habit not active");
        uint256 day = (block.timestamp - habit.startTime) / 1 days;
        require(day < habit.durationDays, "Habit period ended");
        require(
            block.timestamp > habit.lastCheckIn + 1 days - 2 hours,
            "Already checked in today"
        ); // 2-hour buffer

        habit.checkIns += 1;
        if (block.timestamp <= habit.lastCheckIn + 1 days + 2 hours) {
            habit.streak += 1;
        } else {
            habit.streak = 1;
        }
        habit.lastCheckIn = block.timestamp;
        emit CheckedIn(msg.sender, _habitId, day, habit.streak);
    }

    function finalizeHabit(uint256 _habitId) external {
        Habit storage habit = habitsByUser[msg.sender][_habitId];
        require(habit.active, "Habit not active");
        require(!habit.isCompleted, "Habit already completed");
        require(
            block.timestamp >= habit.startTime + habit.durationDays * 1 days,
            "Habit period not ended"
        );

        habit.active = false;
        habit.isCompleted = true;
        habit.completedAt = block.timestamp;
        uint256 requiredCheckIns = (habit.durationDays * SUCCESS_THRESHOLD) /
            100;
        uint256 totalStake = habit.dailyStake * habit.durationDays;
        uint256 reward = 0;

        if (habit.checkIns >= requiredCheckIns) {
            reward = totalStake;
            if (habit.streak >= 3 && totalPool >= STREAK_BONUS) {
                reward += STREAK_BONUS;
                totalPool -= STREAK_BONUS;
            }
            habit.success = true;
            habit.reward = reward;
            payable(msg.sender).transfer(reward);
            emit HabitCompleted(msg.sender, _habitId, true, reward);
        } else {
            totalPool += totalStake;
            emit HabitCompleted(msg.sender, _habitId, false, 0);
        }
    }

    function withdrawPool(uint256 _amount) external onlyAdmin {
        require(_amount <= totalPool, "Insufficient pool balance");
        totalPool -= _amount;
        payable(admin).transfer(_amount);
        emit PoolWithdrawn(admin, _amount);
    }

    function getHabit(
        address _user,
        uint256 _habitId
    ) external view returns (Habit memory) {
        return habitsByUser[_user][_habitId];
    }

    function getAllHabits(
        address _user
    ) external view returns (Habit[] memory) {
        return habitsByUser[_user];
    }
}
