import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const PORT = 3001;

/* =========================
   FUNÇÃO AUXILIAR DE DATA
========================= */
function startOfDay(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/* =========================
   LISTAR PRODUTOS
========================= */
app.get("/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

/* =========================
   ABRIR VENDA
========================= */
app.post("/sales/open", async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Nenhum item enviado" });
    }

    const today = startOfDay();

    const salesToday = await prisma.sale.count({
      where: { date: { gte: today } },
    });

    const saleNumber = salesToday + 1;

    const sale = await prisma.sale.create({
      data: {
        saleNumber,
        status: "OPEN",
        items: {
          create: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.price,
          })),
        },
      },
      include: { items: true },
    });

    res.json(sale);
  } catch (err) {
    console.error("Erro ao abrir venda:", err);
    res.status(500).json({ error: "Erro ao abrir venda" });
  }
});

/* =========================
   FECHAR VENDA
========================= */
app.post("/sales/:id/close", async (req, res) => {
  try {
    const { id } = req.params;
    const { payments } = req.body;

    if (!payments || Object.keys(payments).length === 0) {
      return res.status(400).json({ error: "Nenhum pagamento informado" });
    }

    const saleId = Number(id);

    const paymentEntries = Object.entries(payments)
      .filter(([_, amount]) => Number(amount) > 0)
      .map(([method, amount]) => ({
        saleId,
        method,
        amount: Number(amount),
      }));

    await prisma.salePayment.createMany({
      data: paymentEntries,
    });

    const total = paymentEntries.reduce(
      (acc, p) => acc + p.amount,
      0
    );

    const sale = await prisma.sale.update({
      where: { id: saleId },
      data: {
        total,
        status: "CLOSED",
      },
      include: {
        items: true,
        payments: true,
      },
    });

    res.json(sale);
  } catch (err) {
    console.error("Erro ao fechar venda:", err);
    res.status(500).json({ error: "Erro ao fechar venda" });
  }
});


/* =========================
   VENDAS DIÁRIAS
========================= */
app.get("/sales/daily", async (req, res) => {
  try {
    const today = startOfDay();

    const sales = await prisma.sale.findMany({
      where: { date: { gte: today } },
      include: {
        items: { include: { product: true } },
        payments: true,
      },
      orderBy: { date: "asc" },
    });

    res.json(sales);
  } catch (err) {
    console.error("Erro vendas diárias:", err);
    res.status(500).json({ error: "Erro ao buscar vendas diárias" });
  }
});

/* =========================
   ENVIAR TOTAL DO DIA → MENSAL
========================= */
app.post("/sales/daily/sendToMonthly", async (req, res) => {
  try {
    const today = startOfDay();

    const salesToday = await prisma.sale.findMany({
      where: {
        date: { gte: today },
        status: "CLOSED",
      },
      select: { total: true },
    });

    if (salesToday.length === 0) {
      return res.json({ message: "Nenhuma venda fechada hoje." });
    }

    const totalAmount = salesToday.reduce(
      (acc, sale) => acc + sale.total,
      0
    );

    const monthly = await prisma.monthlySale.upsert({
      where: { date: today },
      update: { total: { increment: totalAmount } },
      create: { date: today, total: totalAmount },
    });

    res.json({
      message: "Total diário enviado para o mensal.",
      totalAmount,
      monthly,
    });
  } catch (err) {
    console.error("Erro enviar para mensal:", err);
    res.status(500).json({ error: "Erro ao enviar para o mensal" });
  }
});

/* =========================
   LIMPAR VENDAS DO DIA
========================= */
app.delete("/sales/daily", async (req, res) => {
  try {
    const today = startOfDay();

    const salesToday = await prisma.sale.findMany({
      where: { date: { gte: today } },
      select: { id: true },
    });

    const saleIds = salesToday.map((s) => s.id);

    await prisma.salePayment.deleteMany({
      where: { saleId: { in: saleIds } },
    });

    await prisma.saleItem.deleteMany({
      where: { saleId: { in: saleIds } },
    });

    await prisma.sale.deleteMany({
      where: { id: { in: saleIds } },
    });

    res.json({ message: "Vendas do dia apagadas com sucesso." });
  } catch (err) {
    console.error("Erro limpar vendas:", err);
    res.status(500).json({ error: "Erro ao limpar vendas do dia" });
  }
});

/* =========================
   VENDAS MENSAIS
========================= */
app.get("/sales/monthly", async (req, res) => {
  try {
    const monthlySales = await prisma.monthlySale.findMany({
      orderBy: { date: "asc" },
    });

    res.json(monthlySales);
  } catch (err) {
    console.error("Erro vendas mensais:", err);
    res.status(500).json({ error: "Erro ao buscar vendas mensais" });
  }
});

/* =========================
   INICIAR SERVIDOR
========================= */
app.listen(PORT, () => {
  console.log(`✅ Backend rodando em http://localhost:${PORT}`);
});
