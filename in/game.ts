import express, { Request, Response } from 'express';
import path from 'path';

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

app.use(express.urlencoded({ extended: true }));

type Player = { name: string; money_in: number; money_out: number };
type LedgerEntry = { from: string; to: string; amount: number };
type LeaderboardPlayer = { 
  name: string; 
  totalGames: number; 
  totalBoughtIn: number; 
  totalCashedOut: number; 
  netProfit: number 
};

let players: Player[] = [];
let ledger: LedgerEntry[] = [];
let leaderboard: LeaderboardPlayer[] = [];

// Helper function to validate player name
const validatePlayerName = (name: string) => {
  return name && typeof name === 'string' && name.trim() !== '';
};

// Helper function to validate money input
const validateMoney = (amount: number) => {
  return !isNaN(amount) && amount >= 0;
};

// Helper function to render error message
const renderError = (res: Response, view: string, players: Player[], errorMessage: string) => {
  return res.status(400).render(view, { players, error: errorMessage });
};

const formatCurrency = (value: number): string => {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

app.get('/', (req: Request, res: Response) => {
  res.render('index', { players });
});

app.post('/', (req: Request, res: Response) => {
  const { name, money_in, money_out } = req.body;
  const parsedMoneyIn = parseFloat(money_in);
  const parsedMoneyOut = parseFloat(money_out);

  // Validate player name and money inputs
  if (!validatePlayerName(name)) {
    return renderError(res, 'index', players, 'Invalid name. Please provide a valid name.');
  }

  if (!validateMoney(parsedMoneyIn)) {
    return renderError(res, 'index', players, 'Invalid "Bought In" amount. Please provide a non-negative number.');
  }

  if (!validateMoney(parsedMoneyOut)) {
    return renderError(res, 'index', players, 'Invalid "Cashed Out" amount. Please provide a non-negative number.');
  }

  players.push({
    name: name.trim(),
    money_in: parsedMoneyIn,
    money_out: parsedMoneyOut,
  });

  updateLeaderboard(name.trim(), parsedMoneyIn, parsedMoneyOut);
  res.redirect('/');
});

app.get('/calculate', (req: Request, res: Response) => {
  const networth = calculate(players);
  const [newLedger, finalBalances] = payments(networth);
  ledger = newLedger;

  const table_data = players.map((player) => {
    const netProfitLoss = player.money_out - player.money_in;
    const formattedNetProfitLoss = netProfitLoss > 0 
        ? `+${formatCurrency(netProfitLoss)}` 
        : formatCurrency(netProfitLoss);

    return {
      name: player.name,
      bought_in: formatCurrency(player.money_in),
      cashed_out: formatCurrency(player.money_out),
      net_profit_loss: formattedNetProfitLoss,
    };
  });

  res.render('calculate', { table_data, ledger, formatCurrency });
});

app.post('/reset', (req: Request, res: Response) => {
  players = [];
  ledger = [];
  res.redirect('/');
});

app.get('/leaderboard', (req: Request, res: Response) => {
    // Check if leaderboard exists and has data; if not, display a default message
    res.render('leaderboard', { 
      leaderboard: leaderboard.length > 0 ? leaderboard : [], 
      message: leaderboard.length === 0 ? "No player data available. Add players to populate the leaderboard." : null,
      formatCurrency 
    });
});


function updateLeaderboard(name: string, moneyIn: number, moneyOut: number) {
  const existingPlayer = leaderboard.find(p => p.name === name);
  if (existingPlayer) {
    existingPlayer.totalGames++;
    existingPlayer.totalBoughtIn += moneyIn;
    existingPlayer.totalCashedOut += moneyOut;
    existingPlayer.netProfit += (moneyOut - moneyIn);
  } else {
    leaderboard.push({
      name,
      totalGames: 1,
      totalBoughtIn: moneyIn,
      totalCashedOut: moneyOut,
      netProfit: moneyOut - moneyIn
    });
  }
  // Sort leaderboard by net profit
  leaderboard.sort((a, b) => b.netProfit - a.netProfit);
}

function resetLeaderboard() {
    leaderboard = []; // Clears the leaderboard array
}

function calculate(transactions: Player[]): { [name: string]: number } {
  const networth: { [name: string]: number } = {};
  transactions.forEach((transaction) => {
    networth[transaction.name] = transaction.money_out - transaction.money_in;
  });
  return networth;
}

function payments(networth: { [name: string]: number }): [LedgerEntry[], { [name: string]: number }] {
  const ledger: LedgerEntry[] = [];
  const finalBalances: { [name: string]: number } = {};

  const debtors = Object.keys(networth).filter((name) => networth[name] < 0);
  const creditors = Object.keys(networth).filter((name) => networth[name] > 0);

  for (const debtor of debtors) {
    for (const creditor of creditors) {
      if (networth[debtor] === 0 || networth[creditor] === 0) continue;

      const paymentAmount = Math.min(-networth[debtor], networth[creditor]);

      ledger.push({
        from: debtor,
        to: creditor,
        amount: paymentAmount,
      });

      networth[debtor] += paymentAmount;
      networth[creditor] -= paymentAmount;
    }
  }

  Object.keys(networth).forEach((name) => {
    finalBalances[name] = networth[name];
  });

  return [ledger, finalBalances];
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// resetLeaderboard(); // Call this function when you want to clear the leaderboard
