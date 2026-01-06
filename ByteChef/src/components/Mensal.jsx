import { useEffect, useState } from "react";

const formatDate = (dateStr) => {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

function Mensal() {
  const [dailySales, setDailySales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMonthlySales() {
      try {
        const res = await fetch("http://localhost:3001/sales/monthly");
        if (!res.ok) throw new Error("Erro ao buscar vendas mensais");

        const data = await res.json();

        setDailySales(
          data.map((sale) => ({
            date: sale.date.split("T")[0],
            total: sale.total,
          }))
        );
      } catch (err) {
        console.error("Erro mensal:", err);
        setDailySales([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMonthlySales();
  }, []);

  const totalMensal = dailySales.reduce(
    (acc, sale) => acc + sale.total,
    0
  );

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Carregando resumo mensal...
      </p>
    );
  }

  return (
    <div className="mt-20 px-4 py-8 max-w-4xl mx-auto bg-gray-50 rounded-xl border">
      <h1 className="text-2xl font-semibold text-center mb-8">
        Resumo Mensal
      </h1>

      {/* TOTAL DO MÊS */}
      <div className="bg-white p-6 rounded-lg shadow mb-10 border">
        <h2 className="font-semibold mb-4 text-gray-700">
          💰 Total do mês
        </h2>

        <p className="text-green-600 font-semibold text-xl">
          R$ {totalMensal.toFixed(2)}
        </p>
      </div>

      {/* TOTAIS POR DIA */}
      <div className="space-y-4">
        <h2 className="font-semibold text-gray-700">
          📅 Totais por dia
        </h2>

        {dailySales.length === 0 && (
          <p className="text-gray-500">Nenhuma venda registrada.</p>
        )}

        {dailySales.map((sale, index) => (
          <div
            key={index}
            className="flex justify-between bg-white p-4 rounded-lg shadow-sm border"
          >
            <span>{formatDate(sale.date)}</span>
            <span className="text-green-600 font-semibold">
              R$ {sale.total.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Mensal;
