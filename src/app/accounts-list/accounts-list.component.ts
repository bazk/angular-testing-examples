import { Component, OnInit } from '@angular/core';
import { Account } from '../account';
import { AccountsService } from '../accounts.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-accounts-list',
  templateUrl: './accounts-list.component.html',
  styleUrls: ['./accounts-list.component.scss']
})
export class AccountsListComponent implements OnInit {
  accounts: Observable<Account[]>;

  constructor(
    private accountsService: AccountsService
  ) { }

  ngOnInit() {
    this.accounts = this.accountsService.list();
  }
}
