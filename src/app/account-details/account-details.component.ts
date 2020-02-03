import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { Account } from '../account';
import { Transaction } from '../transaction';
import { TransactionsService } from '../transactions.service';
import { AccountsService } from '../accounts.service';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent implements OnInit {
  accountName: string;
  accountCurrency: string;
  transactions: Observable<Transaction[]>;

  constructor(
    private route: ActivatedRoute,
    private accountsService: AccountsService,
    private transactionsService: TransactionsService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.accountsService.get(params.get('accountId')).subscribe(account => {
        this.accountName = account.name;
        this.accountCurrency = account.currency;
      });

      this.transactions = this.transactionsService.list(params.get('accountId'));
    });
  }

}
