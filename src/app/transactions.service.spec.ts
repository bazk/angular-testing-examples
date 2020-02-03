import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";

import { TransactionsService } from "./transactions.service";
import { Transaction } from "./transaction";

// Dados de teste (mock)
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

describe("TransactionsService", () => {
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
    const service: TransactionsService = TestBed.get(TransactionsService);
    expect(service).toBeTruthy();
  });

  it("should call the API to list transactions", () => {
    // Primeiro instanciamos o serviço
    const service: TransactionsService = TestBed.get(TransactionsService);

    // Chamamos o método list() do serviço.
    // É retornado um Observable, por isso precisamos de um subscribe().
    // Então basicamente estamos dizendo:
    //   "quando esse observable retornar algum resultado, queremos
    //     que seja igual aos dados mockados de teste"
    service.list("1").subscribe(data => expect(data).toEqual(testData));

    // Agora vamos informar ao httpTestingController que esperamos que
    // uma chamada tenha sido feita em uma determinada URL
    const req = httpTestingController.expectOne(
      "http://5e384984aad2220014961d26.mockapi.io/accounts/1/transactions"
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
