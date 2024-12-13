import { Portfolio } from '../portfolio/portfolio.entity';

export class User {
  private _id: number;
  private _email: string;
  private _accountNumber: string;
  private _porfolio: Portfolio;

  constructor(userData) {
    Object.assign(this, { ...userData });
  }

  // Getter and Setter methods
  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get email(): string {
    return this._email;
  }

  get portfolio(): Portfolio {
    return this._porfolio;
  }

  set portfolio(value: Portfolio) {
    this._porfolio = value;
  }

  get accountNumber(): string {
    return this._accountNumber;
  }

  set accountNumber(value: string) {
    this._accountNumber = value;
  }
}
