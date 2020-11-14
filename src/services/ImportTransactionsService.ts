/* eslint-disable @typescript-eslint/no-explicit-any */
import csvParse from 'csv-parse';
import path from 'path';
import fs from 'fs';
import uploadConfig from '../config/upload';

// import AppError from '../errors/AppError';

import CreateTransactionService from './CreateTransactionService';
import Transaction from '../models/Transaction';

interface Request {
  csvFileName: string;
}

async function loadCSV(filePath: string): Promise<any> {
  const readCSVStream = fs.createReadStream(filePath);

  const parseStream = csvParse({
    from_line: 2,
    ltrim: true,
    rtrim: true,
  });

  const parseCSV = readCSVStream.pipe(parseStream);

  const lines: string[] = [];

  parseCSV.on('data', line => {
    lines.push(line);
  });

  await new Promise(resolve => {
    parseCSV.on('end', resolve);
  });

  return lines;
}

class ImportTransactionsService {
  async execute(csvFileName: string): Promise<Transaction[]> {
    const csvFilePath = path.resolve(uploadConfig.directory, csvFileName);

    const data = await loadCSV(csvFilePath);

    console.log(data);

    const createTransaction = new CreateTransactionService();

    const createdTransactions = [];

    // eslint-disable-next-line no-restricted-syntax
    for await (const item of data) {
      const transaction = await createTransaction.execute({
        title: item[0],
        // eslint-disable-next-line radix
        value: parseInt(item[2]),
        type: item[1],
        category: item[3],
      });
      createdTransactions.push(transaction);
    }

    console.log('created:', createdTransactions);

    // data.forEach((item) => {
    //   const transaction = await createTransaction.execute({
    //     title: item[0],
    //     value: item[1],
    //     type: item[2],
    //     category: item[3],
    //   });
    // })

    return createdTransactions;
  }
}

export default ImportTransactionsService;
