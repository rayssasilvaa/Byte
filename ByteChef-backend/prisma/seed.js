import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const data = [
  { name: "Marmitex Grande", price: 20 },
  { name: "Marmitex Médio", price: 18 },
  { name: "Refrigerante Lata", price: 4.5 },
];

async function main() {
  await prisma.product.createMany({
    data,
    skipDuplicates: true,
  });

  console.log("Produtos importados com sucesso!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
