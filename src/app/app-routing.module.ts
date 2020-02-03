import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountsListComponent } from './accounts-list/accounts-list.component';
import { AccountDetailsComponent } from './account-details/account-details.component';


const routes: Routes = [
  { path: '', component: AccountsListComponent },
  { path: 'accounts/:accountId', component: AccountDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
