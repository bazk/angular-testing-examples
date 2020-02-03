import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

import { Account } from './account';

@Injectable({
  providedIn: "root"
})
export class AccountsService {
  constructor(
    private http: HttpClient
  ) {}

  list() {
    return this.http.get<Account[]>('http://5e384984aad2220014961d26.mockapi.io/accounts');
  }

  get(id: string) {
    return this.http.get<Account>(`http://5e384984aad2220014961d26.mockapi.io/accounts/${id}`);
  }
}
