declare namespace NodeJS {
  interface Global {
    testRequest: import("supertest").SuperTest<import("supertest").Test>;
  }
}

// NOTE: na versão atual do node é necessário declarar essa variável
//       e incluir o comentário para o eslint ignorar a declaração
// eslint-disable-next-line no-var
declare var testRequest: import("supertest").SuperTest<
  import("supertest").Test
>;
