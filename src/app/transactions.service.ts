import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

import { Transaction } from './transaction';

@Injectable({
  providedIn: "root"
})
export class TransactionsService {
  constructor(
    private http: HttpClient
  ) {}

  list(accountId: string) {
    return this.http.get<Transaction[]>(`http://5e384984aad2220014961d26.mockapi.io/accounts/${accountId}/transactions`);
  }

  get(accountId: string, transactionId: string) {
    return this.http.get<Transaction>(`http://5e384984aad2220014961d26.mockapi.io/accounts/${accountId}/transactions/${transactionId}`);
  }
}
