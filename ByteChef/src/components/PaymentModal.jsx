import { useState } from "react";
import { FaPix, FaMoneyBillWave, FaCcVisa, FaCcMastercard } from "react-icons/fa6";

function PaymentModal({ total, onClose, onConfirm }) {
  const [payments, setPayments] = useState({
    dinheiro: 0,
    pix: 0,
    debito: 0,
    credito: 0,
  });

  const [sending, setSending] = useState(false); // Indica envio em progresso

  const methods = [
    { key: "pix", label: "Pix", icon: <FaPix className="text-green-400" /> },
    { key: "credito", label: "Crédito", icon: <FaCcVisa className="text-blue-400" /> },
    { key: "dinheiro", label: "Dinheiro", icon: <FaMoneyBillWave className="text-yellow-400" /> },
    { key: "debito", label: "Débito", icon: <FaCcMastercard className="text-red-400" /> },
  ];

  const handleChange = (key, value) => {
    const number = parseFloat(value.replace(/[^0-9.]/g, "")) || 0;
    setPayments(prev => ({ ...prev, [key]: Math.round(number * 100) / 100 }));
  };

  const handleSelectMethod = (key) => {
    const paidTotal = Object.values(payments).reduce((acc, v) => acc + v, 0);
    const remaining = total - paidTotal;

    if (remaining > 0) {
      setPayments({ dinheiro: 0, pix: 0, debito: 0, credito: 0, [key]: Math.round(remaining * 100) / 100 });
    }
  };

  const paidTotal = Object.values(payments).reduce((acc, v) => acc + v, 0);
  const remaining = total - paidTotal;

  const handleConfirmClick = async () => {
    if (paidTotal <= 0 || sending) return;

    setSending(true); // muda botão para "Enviando..."
    try {
      await onConfirm(payments); // envia para backend
    } finally {
      setSending(false); // volta ao estado normal após envio
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white/20 backdrop-blur-md w-[28rem] md:w-[32rem] lg:w-[36rem] rounded-2xl shadow-2xl p-6 space-y-6 border border-white/30 animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-white drop-shadow">Pagamento</h2>

        <p className="text-center text-white/80 text-lg">
          Total da venda: <span className="font-semibold text-white">R${total.toFixed(2)}</span>
        </p>

        <div className="grid grid-cols-2 gap-4">
          {methods.map(m => (
            <div
              key={m.key}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                payments[m.key] > 0 ? "bg-white/40 shadow-lg" : "bg-white/10 hover:bg-white/20 shadow-sm"
              }`}
            >
              <span onClick={() => handleSelectMethod(m.key)} className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-3xl">{m.icon}</span>
                <span className="text-base font-medium w-15 text-black/70">{m.label}</span>
              </span>

              <div className="flex items-center border-l border-white/30 pl-3 flex-grow">
                <input
                  type="number"
                  value={payments[m.key] === 0 ? "" : payments[m.key]}
                  onChange={e => handleChange(m.key, e.target.value)}
                  placeholder="0"
                  className="w-full bg-transparent outline-none text-black placeholder-white/50 text-sm md:text-base transition-all duration-200 focus:scale-105"
                />
                <span className="ml-2 font-semibold text-sm md:text-base text-black/70">R$</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-right text-lg font-medium text-white/90">
          Restante: <span className={remaining > 0 ? "text-red-400" : "text-green-400"}>R${remaining.toFixed(2)}</span>
        </p>

        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-red-400 cursor-pointer hover:bg-white/30 text-white transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={handleConfirmClick}
            disabled={paidTotal <= 0 || sending}
            className={`px-6 py-2 rounded-lg text-white transition-all ${
              paidTotal > 0 && !sending ? "bg-blue-500 hover:bg-blue-600 shadow-md hover:shadow-lg cursor-pointer" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {sending ? "Enviando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;
