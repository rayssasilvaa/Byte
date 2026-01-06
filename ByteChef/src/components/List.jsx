import { FaTrash, FaShoppingCart } from "react-icons/fa";

function List({ addedProducts, total, onRemove }) {
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        Carrinho
        <FaShoppingCart className="inline ml-2" />
      </h2>

      {addedProducts.length === 0 && (
        <p className="text-gray-500">Nenhum item adicionado</p>
      )}

      {/* Itens do carrinho */}
      <div className="space-y-3 mb-4">
        {addedProducts.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center bg-gray-100 rounded-lg p-3 shadow-sm"
          >
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-600">
                {item.quantity}x • R${item.price.toFixed(2)}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-bold text-blue-900">
                R${item.total.toFixed(2)}
              </span>

              <button
                onClick={() => onRemove(item.id)}
                className="text-red-500 hover:text-red-600 transition"
                title="Remover 1 item"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      {addedProducts.length > 0 && (
        <p className="font-semibold text-lg">
          Total:{" "}
          <span className="text-green-600">
            R${total.toFixed(2)}
          </span>
        </p>
      )}
    </div>
  );
}

export default List;
