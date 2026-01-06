import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import List from "./List";
import PaymentModal from "./PaymentModal";

function Home() {
  // =========================
  // Estados principais
  // =========================
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [addedProducts, setAddedProducts] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // =========================
  // Buscar produtos
  // =========================
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("http://localhost:3001/products");
        if (!res.ok) throw new Error("Erro ao buscar produtos");
        setProducts(await res.json());
      } catch (err) {
        console.error(err);
        setProducts([]);
      }
    }
    fetchProducts();
  }, []);

  // =========================
  // Adicionar produto
  // =========================
  const handleAddProduct = (product) => {
    const existing = addedProducts.find((p) => p.id === product.id);

    if (existing) {
      setAddedProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? {
                ...p,
                quantity: p.quantity + 1,
                total: (p.quantity + 1) * p.price,
              }
            : p
        )
      );
    } else {
      setAddedProducts((prev) => [
        ...prev,
        { ...product, quantity: 1, total: product.price },
      ]);
    }
  };

  // =========================
  // Remover (-1) produto
  // =========================
  const handleRemoveProduct = (productId) => {
    setAddedProducts((prev) =>
      prev
        .map((p) => {
          if (p.id === productId) {
            if (p.quantity > 1) {
              const newQuantity = p.quantity - 1;
              return {
                ...p,
                quantity: newQuantity,
                total: newQuantity * p.price,
              };
            }
            return null;
          }
          return p;
        })
        .filter(Boolean)
    );
  };

  // =========================
  // Total do carrinho
  // =========================
  const total = addedProducts.reduce(
    (acc, item) => acc + item.total,
    0
  );

  // =========================
  // Finalizar venda
  // =========================
  const handleFinishSale = async (payments) => {
    try {
      const resOpen = await fetch("http://localhost:3001/sales/open", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: addedProducts.map((p) => ({
            productId: p.id,
            quantity: p.quantity,
            price: p.price,
          })),
        }),
      });

      if (!resOpen.ok) throw new Error("Erro ao abrir venda");
      const sale = await resOpen.json();

      const resClose = await fetch(
        `http://localhost:3001/sales/${sale.id}/close`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payments }),
        }
      );

      if (!resClose.ok) throw new Error("Erro ao fechar venda");

      setAddedProducts([]);
      setShowPaymentModal(false);
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Erro ao finalizar venda:", err);
    }
  };

  // =========================
  // Filtrar produtos
  // =========================
  const filteredItems = products.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toString().includes(search)
  );

  // =========================
  // Render
  // =========================
  return (
    <main className="p-6 max-w-2xl mx-auto bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Produtos
      </h1>

      {/* Busca */}
      <div className="relative flex items-center mb-6">
        <FaSearch className="absolute left-3 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar item"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-[16px]
                     focus:ring-1 focus:outline-none shadow-sm"
        />
      </div>

      {/* Lista de produtos */}
      <div className="bg-white rounded-xl shadow-md divide-y">
        {search &&
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center py-3 px-4
                         hover:bg-blue-50 transition"
            >
              <span className="text-[16px] text-gray-800 font-medium">
                {item.name}
                <span className="text-gray-500">
                  {" "}
                  — R${item.price.toFixed(2)}
                </span>
              </span>

              <button
                onClick={() => handleAddProduct(item)}
                className="text-blue-900 font-bold text-lg cursor-pointer"
              >
                +
              </button>
            </div>
          ))}

        {!search && (
          <p className="text-center text-gray-400 py-6">
            Digite para buscar produtos
          </p>
        )}
      </div>

      <hr className="my-8 border-gray-300" />

      {/* Carrinho */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <List
          addedProducts={addedProducts}
          total={total}
          onRemove={handleRemoveProduct}
        />
      </div>

      {/* Finalizar */}
      {addedProducts.length > 0 && (
        <button
          onClick={() => setShowPaymentModal(true)}
          className="mt-6 w-full bg-blue-900 cursor-pointer hover:bg-blue-800
                     text-white py-4 rounded-xl font-semibold
                     shadow-lg transition"
        >
          Finalizar Venda
        </button>
      )}

      {/* Modal pagamento */}
      {showPaymentModal && (
        <PaymentModal
          total={total}
          onClose={() => setShowPaymentModal(false)}
          onConfirm={handleFinishSale}
        />
      )}

      {/* Modal sucesso */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white/20 backdrop-blur-md w-80 p-6 rounded-2xl
                          shadow-2xl text-center space-y-4 border border-white/30">
            <h2 className="text-2xl font-bold text-white">
              Sucesso!
            </h2>
            <p className="text-white/80">
              Venda enviada com sucesso!
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-6 py-2 rounded-lg bg-blue-500 cursor-pointer hover:bg-blue-600
                         text-white font-semibold transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Home;
