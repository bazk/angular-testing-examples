import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { defer } from "rxjs";

import { AccountsService } from "../accounts.service";
import { TransactionsService } from "../transactions.service";
import { AccountDetailsComponent } from "./account-details.component";
import { Transaction } from "../transaction";
import { Account } from "../account";

// Dados de teste (mock)
const testAccount: Account = {
  id: "1",
  createdAt: new Date("2020-02-02T16:44:16.222Z"),
  name: "Checking Account",
  currency: "BRL"
};
const testData: Transaction[] = [
  {
    id: "1",
    accountId: "1",
    createdAt: new Date("2020-02-03T07:09:30.500Z"),
    description: "Cotton",
    value: 931.64,
    type: "deposit"
  },
  {
    id: "10",
    accountId: "1",
    createdAt: new Date("2020-02-02T20:58:58.922Z"),
    description: "Usability Chair",
    value: 401.11,
    type: "payment"
  },
  {
    id: "19",
    accountId: "1",
    createdAt: new Date("2020-02-03T12:15:00.507Z"),
    description: "Kansas",
    value: 833.87,
    type: "deposit"
  }
];

describe("AccountDetailsComponent", () => {
  let component: AccountDetailsComponent;
  let fixture: ComponentFixture<AccountDetailsComponent>;

  beforeEach(async () => {
    // Cria spies para interceptar as chamadas aos serviços, retornando os dados mockados
    const accountsServiceSpy = jasmine.createSpyObj("AccountsService", ["get"]);
    const transactionsServiceSpy = jasmine.createSpyObj("TransactionsService", [
      "list"
    ]);
    accountsServiceSpy.get.and.returnValue(
      defer(() => Promise.resolve(testAccount)) // defer é necessário para "fingir" que é um Observable
    );
    transactionsServiceSpy.list.and.returnValue(
      defer(() => Promise.resolve(testData))
    );

    // Configura o TestBed para importar os módulos necessários e os Spies construídos acima
    TestBed.configureTestingModule({
      declarations: [AccountDetailsComponent],

      // Temos que importar todos os módulos que nossa aplicação depende
      imports: [
        RouterTestingModule,
        MatToolbarModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule
      ],

      // Força o Angular a importar os spies ao invés dos serviços de verdade
      providers: [
        { provide: AccountsService, useValue: accountsServiceSpy },
        { provide: TransactionsService, useValue: transactionsServiceSpy }
      ]
    }).compileComponents();

    // Cria o componente
    fixture = TestBed.createComponent(AccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // fakeAsync cria um "ambiente" assíncrono que podemos controlar
  //                                              \/
  it("should render a table of transactions", fakeAsync(() => {
    // inicialmente, esperamos que a tabela esteja vazia, sem nenhum dado
    expect(fixture.nativeElement.querySelectorAll(".mat-row").length).toEqual(
      0
    );

    // Com ajuda do fakeAsync, o tick() faz o "tempo passar".
    // Simula o tempo que leva para o request HTTP demoraria para ser executado
    // e os dados serem retornados no observable
    tick();
    fixture.detectChanges();

    // Agora nossa tabela deve conter dados, vamos testar isso
    expect(fixture.nativeElement.querySelectorAll(".mat-row").length).toEqual(
      testData.length
    );
    expect(
      fixture.nativeElement.querySelector(".mat-row").textContent
    ).toContain(testData[0].description);
  }));
});
