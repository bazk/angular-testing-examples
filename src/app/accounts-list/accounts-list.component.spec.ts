import {
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync
} from "@angular/core/testing";
import { AccountsListComponent } from "./accounts-list.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";
import { Router } from "@angular/router";
import { defer } from "rxjs";

import { AccountsService } from "../accounts.service";
import { Account } from "../account";
import { By } from "@angular/platform-browser";

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
  let router: Router;

  beforeEach(async () => {
    // Cria spies para interceptar as chamadas aos serviços, retornando os dados mockados
    const accountsServiceSpy = jasmine.createSpyObj("AccountsService", [
      "list"
    ]);
    accountsServiceSpy.list.and.returnValue(
      defer(() => Promise.resolve(testData)) // defer é necessário para "fingir" que é um Observable
    );

    router = jasmine.createSpyObj("Router", ["navigateByUrl"]);

    // Configura o TestBed para importar os módulos necessários e os Spies construídos acima
    TestBed.configureTestingModule({
      declarations: [AccountsListComponent],

      // Temos que importar todos os módulos que nossa aplicação depende
      imports: [MatToolbarModule, MatListModule],

      // Força o Angular a importar os spies ao invés dos serviços de verdade
      providers: [
        { provide: AccountsService, useValue: accountsServiceSpy },
        { provide: Router, useValue: router }
      ]
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

  it("should navigate to the details page on click", fakeAsync(() => {
    // Espera a chamada HTTP mockada resolver
    tick();
    fixture.detectChanges();

    // Simula o click em um item da lista
    const item = fixture.debugElement.query(By.css(".mat-list-item"));
    item.triggerEventHandler("click", {});
    tick();
    fixture.detectChanges();

    // Testa se depois do click foi chamada a função de navegar para a URL correta
    const spy = router.navigateByUrl as jasmine.Spy;
    expect(spy.calls.count()).toEqual(1);
    expect(spy.calls.first().args[0]).toBe("/accounts/1");
  }));
});
