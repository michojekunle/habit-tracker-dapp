# 🚀 Habit Tracker DApp

Track your daily habits and build consistency with smart contract-enforced accountability using RBTC. Built with React, TypeScript, TailwindCSS, and Solidity, this decentralized app ensures commitment and transparency through blockchain technology.

![habit-tracker-banner](/client/public/banner.png)

---

## 📦 Features

* 📅 Create habits with custom durations and daily stakes (in tRBTC)
* ⏰ Track active and completed habits
* 🧠 Smart contracts enforce habit completion and staking logic
* 🌐 Built on the Rootstock testnet
* 🔐 Wallet connection with Thirdweb
* ✨ Stylish UI with Tailwind CSS and Shadcn UI components

---

## 🧰 Tech Stack

* **Frontend:** React, TypeScript, TailwindCSS, Shadcn/UI
* **Blockchain:** Solidity, Hardhat
* **Chain:** Rootstock Testnet

---

## 📂 Folder Structure

```
habit-tracker-dapp/
├── client/            # Frontend code (React, TS, Tailwind)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   └── App.tsx
├── smart-contract/         # Solidity smart contracts
└── README.md
```

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/michojekunle/habit-tracker-dapp.git
cd habit-tracker-dapp
```

---

### 2. Setup Smart Contract (Backend)

```bash
cd smart-contract
npm install
```

#### Compile Contracts

```bash
npx hardhat compile
```


#### Deploy to Local or Testnet (Rootstock Testnet)

Update `.env` with your private key and RPC URL:

```env
WALLET_KEY=your_private_key
ROOTSTOCK_TESTNET_RPC_URL=rootstock-testnet-rpc-url
```

Then deploy:

```bash
npx hardhat ignition deploy ./ignition/modules/HabitTracker.js --network rootstock --verify
```

---

### 3. Setup Frontend (Client)

```bash
cd client
npm install
```

---

### 4. Start the Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the app live.

---

## 💡 Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b feat/new-feature`
3. Commit changes: `git commit -m "feat: added new feature"`
4. Push to the branch: `git push origin feat/new-feature`
5. Open a Pull Request 🚀

---

## ❓ FAQ

**Q: I get a "JSX not allowed" error.**
A: Ensure your `tsconfig.json` includes:

```json
"compilerOptions": {
  "jsx": "react-jsx"
}
```

---

## 📃 License

MIT © 2025 [Michael](https://github.com/michojekunle)

---

## 🙌 Acknowledgements

* [Rootstock](https://www.rootstock.io/)
* [Shadcn UI](https://ui.shadcn.com/)
* [Thirdweb](https://thirdweb.com/)
* [Hardhat](https://hardhat.org/)
