import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}
interface CreateTransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const balance = this.transactions.reduce(
      (accumulator, currentValue) => {
        if (currentValue.type === 'income') {
          accumulator.income += currentValue.value;
        } else if (currentValue.type === 'outcome') {
          accumulator.outcome += currentValue.value;
        }

        accumulator.total = accumulator.income - accumulator.outcome;

        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    return balance;
  }

  public create({ title, type, value }: CreateTransaction): Transaction {
    const newTransaction = new Transaction({ title, value, type });

    if (newTransaction.type === 'outcome') {
      const { total } = this.getBalance();

      if (value > total) {
        throw Error('Balance cannot be less than the total');
      }
    }

    this.transactions.push(newTransaction);

    return newTransaction;
  }
}

export default TransactionsRepository;
