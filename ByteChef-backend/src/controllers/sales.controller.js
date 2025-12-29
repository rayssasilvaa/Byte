import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Abre uma nova venda (sem pagamento ainda)
export async function openSale(req, res) {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Nenhum item enviado" });
    }

    // Descobre quantas vendas já existem hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const salesToday = await prisma.sale.count({
      where: {
        date: {
          gte: today,
        },
      },
    });

    const saleNumber = salesToday + 1;

    // Cria a venda
    const sale = await prisma.sale.create({
      data: {
        saleNumber,
        status: "open",
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });

    res.json(sale);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao abrir venda" });
  }
}
