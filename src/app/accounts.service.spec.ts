import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";

import { AccountsService } from "./accounts.service";
import { Account } from "./account";

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

describe("AccountsService", () => {
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Configura o Angular para usar o HttpClient de testes
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    // Guarda o HttpTestingController para usarmos dentros dos testes
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it("should be created", () => {
    const service: AccountsService = TestBed.get(AccountsService);
    expect(service).toBeTruthy();
  });

  it("should call the API to list accounts", () => {
    // Primeiro instanciamos o serviço
    const service: AccountsService = TestBed.get(AccountsService);

    // Chamamos o método list() do serviço.
    // É retornado um Observable, por isso precisamos de um subscribe().
    // Então basicamente estamos dizendo:
    //   "quando esse observable retornar algum resultado, queremos
    //     que seja igual aos dados mockados de teste"
    service.list().subscribe(data => expect(data).toEqual(testData));

    // Agora vamos informar ao httpTestingController que esperamos que
    // uma chamada tenha sido feita em uma determinada URL
    const req = httpTestingController.expectOne(
      "http://5e384984aad2220014961d26.mockapi.io/accounts"
    );
    // Esperamos que seja um GET
    // Aqui poderíamos verificar também os parâmetros de um POST, Headers, etc.
    expect(req.request.method).toEqual("GET");

    // E finalmente nós fazemos com que o httpTestingController envie os
    // dados mockados para quem fez a requisição.
    // Nesse momento, o observable vai se resolver e o teste lá no subscribe
    // vai acontencer.
    req.flush(testData);
  });

  // Ao final de cada teste, precisamos esperar que todas as requisições HTTP
  // tenham finalizado, por isso esse trecho de código.
  // É muito importante isso, não remova!
  afterEach(() => {
    httpTestingController.verify();
  });
});
