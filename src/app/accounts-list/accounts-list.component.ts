import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

import { Account } from "../account";
import { AccountsService } from "../accounts.service";

@Component({
  selector: "app-accounts-list",
  templateUrl: "./accounts-list.component.html",
  styleUrls: ["./accounts-list.component.scss"]
})
export class AccountsListComponent implements OnInit {
  accounts: Observable<Account[]>;

  constructor(
    private router: Router,
    private accountsService: AccountsService
  ) {}

  ngOnInit() {
    this.accounts = this.accountsService.list();
  }

  navigateToDetails(account: Account) {
    this.router.navigateByUrl(`/accounts/${account.id}`);
  }
}
