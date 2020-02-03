import {
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync
} from "@angular/core/testing";
import { AccountsListComponent } from "./accounts-list.component";
import { RouterTestingModule } from "@angular/router/testing";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";
import { defer } from "rxjs";

import { AccountsService } from "../accounts.service";
import { Account } from "../account";

// Dados de teste (mock)
const testData: Account[] = [
  {
    id: "1",
    createdAt: new Date("2020-02-02T16:44:16.222Z"),
    name: "Checking Account",
    currency: "KZT"
  },
  {
    id: "2",
    createdAt: new Date("2020-02-03T11:11:40.816Z"),
    name: "Investment Account",
    currency: "SOS"
  }
];

describe("AccountsListComponent", () => {
  let component: AccountsListComponent;
  let fixture: ComponentFixture<AccountsListComponent>;

  beforeEach(async () => {
    // Cria spies para interceptar as chamadas aos serviços, retornando os dados mockados
    const accountsServiceSpy = jasmine.createSpyObj("AccountsService", [
      "list"
    ]);
    accountsServiceSpy.list.and.returnValue(
      defer(() => Promise.resolve(testData)) // defer é necessário para "fingir" que é um Observable
    );

    // Configura o TestBed para importar os módulos necessários e os Spies construídos acima
    TestBed.configureTestingModule({
      declarations: [AccountsListComponent],

      // Temos que importar todos os módulos que nossa aplicação depende
      imports: [RouterTestingModule, MatToolbarModule, MatListModule],

      // Força o Angular a importar os spies ao invés dos serviços de verdade
      providers: [{ provide: AccountsService, useValue: accountsServiceSpy }]
    }).compileComponents();

    // Cria o componente
    fixture = TestBed.createComponent(AccountsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // fakeAsync cria um "ambiente" assíncrono que podemos controlar
  //                                        \/
  it("should render a list of accounts", fakeAsync(() => {
    // inicialmente, esperamos que a lista esteja vazia, sem nenhum dado
    expect(
      fixture.nativeElement.querySelectorAll(".mat-list-item").length
    ).toEqual(0);

    // Com ajuda do fakeAsync, o tick() faz o "tempo passar".
    // Simula o tempo que leva para o request HTTP demoraria para ser executado
    // e os dados serem retornados no observable
    tick();
    fixture.detectChanges();

    // Agora nossa lista deve conter dados, vamos testar isso
    expect(
      fixture.nativeElement.querySelectorAll(".mat-list-item").length
    ).toEqual(testData.length);
    expect(
      fixture.nativeElement.querySelector(".mat-list-item").textContent
    ).toContain(testData[0].name);
  }));
});
