# Poker_Ledger
A ledger for poker home games.

# Poker Ledger

A Node.js application for tracking poker games, player buy-ins, cash-outs, and generating a leaderboard based on net profit. 
The app is built with **Express** for server-side logic, **EJS** for templating views, and **TypeScript** for static typing.

## Features

- Add players with buy-in and cash-out amounts.
- Automatically update the leaderboard based on net profits.
- View a list of players and their game statistics.
- Calculate payments for balancing cash flow among players.
- Reset player data and the ledger as needed.

## Tech Stack

- **Node.js**
- **Express**: Web framework for Node.js.
- **EJS**: Embedded JavaScript templating.
- **TypeScript**: Superset of JavaScript that adds static typing.
- **HTML/CSS**: For the front-end views.
  
## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/poker-ledger.git
    cd poker-ledger
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Compile the TypeScript files:

    ```bash
    npm run build
    ```

4. Start the application:

    ```bash
    npm start
    ```

   By default, the server will start on `http://localhost:3000`.

### Usage

Once the application is running:

1. Navigate to `http://localhost:3000` in your browser.
2. Add player data by entering a name, buy-in amount, and cash-out amount.
3. View the **leaderboard** or **calculate payments**.
4. You can reset the ledger to start a new game session.

### Scripts

- **npm run build**: Compiles TypeScript files into JavaScript.
- **npm start**: Starts the application using the compiled files.
- **npm run dev**: Starts the application in development mode (you may need to set this up in the future using something like `nodemon`).


## Known Issues

- Ensure you have installed `@types/express` and `@types/node` for TypeScript to recognize the Node.js and Express modules.
  
### To install these:

```bash
npm install --save-dev @types/express @types/node
