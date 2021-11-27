interface pontos {
  x: number;
  y: number;
  id: number;
}

const objPontos: pontos[] = [];

for (let i = 0; i < 1000000; i++) {
  objPontos.push({
    x: Math.round(Math.random() * 100),
    y: Math.round(Math.random() * 100),
    id: Math.round(Math.random() * 100),
  });
}

console.log("Iniciando comparação...");

console.log("iniciando jeito 1...");
console.time("Filter para agrupar: ");
console.time("Desempenho Filtrar Diferentes: ");
const idsDiferentesV1 = objPontos
  .map((o) => o.id)
  .filter((id, idx, array) => array.indexOf(id) === idx);
console.timeEnd("Desempenho Filtrar Diferentes: ");

const objetosMapeadosV1 = idsDiferentesV1.map((id) => ({
  id: id,
  objetos: objPontos.filter((o) => o.id === id),
}));
console.timeEnd("Filter para agrupar: ");
console.log("finalizado jeito 1...\n\n");

//NOTE: Esse algoritmo de agrupamento é muito melhor
console.log("iniciando jeito 1...");
console.time("Jeito do senior para agrupar: ");
const objetosMapeadosV2: { id: number; pontos: pontos[] }[] = [];

for (const ponto of objPontos) {
  const grupoObjeto = objetosMapeadosV2.find((o) => o.id === ponto.id);
  if (grupoObjeto) {
    grupoObjeto.pontos.push(ponto);
  } else {
    objetosMapeadosV2.push({ id: ponto.id, pontos: [ponto] });
  }
}
console.timeEnd("Jeito do senior para agrupar: ");
console.log("finalizado jeito 1...\n\n");
