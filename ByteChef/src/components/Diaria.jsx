import { useEffect, useState } from "react";

const API_URL = "http://localhost:3001";

function Diaria() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     BUSCAR VENDAS DO DIA
  ========================= */
  useEffect(() => {
    async function fetchDailySales() {
      try {
        const res = await fetch(`${API_URL}/sales/daily`);
        if (!res.ok) throw new Error("Erro ao buscar vendas do dia");

        const data = await res.json();

        // Remove vendas duplicadas pelo ID (segurança)
        const uniqueSales = Array.from(
          new Map(data.map((sale) => [sale.id, sale])).values()
        );

        setSales(uniqueSales);
      } catch (err) {
        console.error("Erro ao buscar vendas diárias:", err);
        setSales([]);
      } finally {
        setLoading(false);
      }
    }

    fetchDailySales();
  }, []);

  /* =========================
     TOTAL DO DIA
  ========================= */
  const totalAmount = sales.reduce(
    (acc, sale) => acc + (sale.total || 0),
    0
  );

  const formatBRL = (value) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  /* =========================
     ENVIAR TOTAL PARA MENSAL
     (mensal só soma os dias)
  ========================= */
  const handleSendToMonthly = async () => {
    if (!window.confirm("Deseja enviar o total diário para o mensal?")) return;

    try {
      const res = await fetch(
        `${API_URL}/sales/daily/sendToMonthly`,
        { method: "POST" }
      );

      if (!res.ok) throw new Error("Erro ao enviar para o mensal");

      alert("Total diário enviado para o mensal com sucesso!");
    } catch (err) {
      console.error("Erro ao enviar para mensal:", err);
      alert(err.message);
    }
  };

  /* =========================
     LIMPAR VENDAS DO DIA
  ========================= */
  const handleClearSales = async () => {
    if (
      !window.confirm(
        "Tem certeza que deseja apagar todas as vendas do dia?"
      )
    )
      return;

    try {
      const res = await fetch(`${API_URL}/sales/daily`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erro ao apagar vendas do dia");

      setSales([]);
      alert("Vendas do dia limpas com sucesso!");
    } catch (err) {
      console.error("Erro ao limpar vendas do dia:", err);
      alert(err.message);
    }
  };

  /* =========================
     ESTADOS DE TELA
  ========================= */
  if (loading) {
    return (
      <p className="text-center mt-6 text-gray-500">
        Carregando vendas do dia...
      </p>
    );
  }

  if (sales.length === 0) {
    return (
      <p className="text-center mt-6 text-gray-500">
        Nenhuma venda registrada hoje.
      </p>
    );
  }

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-900">
        Vendas Diárias
      </h1>

      <p className="text-center mb-6 text-lg text-gray-700">
        Dia:{" "}
        <span className="font-semibold text-gray-900">
          {new Date().toLocaleDateString()}
        </span>
      </p>

      {/* LISTA DE VENDAS */}
      {sales.map((sale) => (
        <div
          key={sale.id}
          className="bg-white rounded-xl shadow-md p-5 mb-5 border border-gray-200"
        >
          <div className="flex justify-between items-center mb-3">
            <p className="font-semibold text-lg text-gray-800">
              Venda #{sale.saleNumber}
            </p>
            <p className="font-bold text-green-600">
              {formatBRL(sale.total || 0)}
            </p>
          </div>

          {/* ITENS */}
          <ul className="mb-3 ml-4 list-disc list-inside text-gray-700">
            {sale.items.map((item) => (
              <li key={item.id}>
                {item.product.name} x {item.quantity} ={" "}
                {formatBRL(item.price * item.quantity)}
              </li>
            ))}
          </ul>

          {/* PAGAMENTOS (mantido) */}
          <p className="font-medium text-gray-800">Pagamentos:</p>
          <ul className="ml-4 list-disc list-inside text-gray-600 text-sm">
            {sale.payments.map((p) => (
              <li key={p.id}>
                {p.method}: {formatBRL(p.amount)}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* RESUMO DO DIA */}
      <div className="flex justify-between items-center mt-6 border-t pt-4">
        <p className="font-medium text-lg text-gray-800">
          Total de vendas:{" "}
          <span className="text-blue-900 font-bold">
            {sales.length}
          </span>{" "}
          | Valor total:{" "}
          <span className="text-green-600 font-bold">
            {formatBRL(totalAmount)}
          </span>
        </p>
      </div>

      {/* AÇÕES */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={handleSendToMonthly}
          className="px-5 py-2 bg-blue-900 text-white rounded-lg cursor-pointer shadow hover:bg-blue-800 transition"
        >
          Enviar para Mensal
        </button>

        <button
          onClick={handleClearSales}
          className="px-5 py-2 bg-red-500 text-white rounded-lg cursor-pointer shadow hover:bg-red-600 transition"
        >
          Limpar Vendas
        </button>
      </div>
    </div>
  );
}

export default Diaria;
