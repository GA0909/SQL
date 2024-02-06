import sqlite3 from "sqlite3"; //using sql liberies
import fs from "fs"; //file systems
import { resolve } from "path"; // resolving file paths

const sql = sqlite3.verbose(); //using sql to call verbose for debuging

const DB_DIR = resolve(__dirname, `../_db`); // making the directary file path

const path = (prefix: string): string => {
  return `${DB_DIR}/${prefix}-database.sqlite3`;
}; //getting the full path

export class SQLiteWrapper { //making a class
  private pathToFile: string; //storing path to file
  private db: sqlite3.Database; // storing database instance

  constructor(pathToFile: string) { //defining a constructor
    this.pathToFile = pathToFile; //declaring filepath
    this.db = new sql.Database(this.pathToFile); // using sql database call
  }

  async selectSingleRow(query: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(query, (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  async selectMultipleRows(query: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(query, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  async execute(query: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.exec(query, err => {
        if (err) return reject(`Execution failed: ${err} for query "${query}"`);
        resolve();
      });
    });
  }

  async reset(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fs.unlink(this.pathToFile, err => {
        if (err) return reject(err);
        Promise.resolve();
      });
    });
  }

  static async createNew(prefix: string): Promise<SQLiteWrapper> {
    const exists = await new Promise(resolve =>
      fs.exists(DB_DIR, exists => resolve(exists))
    );
    if (!exists) {
      await new Promise((resolve, reject) => {
        fs.mkdir(DB_DIR, err => {
          if (err) return reject(err);
          Promise.resolve();
        });
      });
    }
    return new SQLiteWrapper(path(prefix));
  }

  static async fromExisting(
    sourcePrefix: string,
    targetPrefix: string
  ): Promise<SQLiteWrapper> {
    const sourcePath = path(sourcePrefix);
    const targetPath = path(targetPrefix);
    await new Promise((resolve, reject) => {
      fs.copyFile(sourcePath, targetPath, err => {
        if (err) return reject(err);
        Promise.resolve();
      });
    });
    return new SQLiteWrapper(targetPath);
  }
}
