import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import CheckCategoryService from './CheckCategoryService';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  /**
   * had to be changed to string to allow importing from csv.
   */
  // type: 'income' | 'outcome';
  type: string;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    if (type === 'outcome') {
      const balance = await transactionsRepository.getBalance();
      if (value > balance.total) {
        throw new AppError('Transaction value exceeds balance.');
      }
    }
    const checkCategoryService = new CheckCategoryService();

    const category_id = await checkCategoryService.execute(category);

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
