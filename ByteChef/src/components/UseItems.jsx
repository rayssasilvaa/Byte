import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UseItems = (addedProducts, total) => {
  const navigate = useNavigate();

  // Lógica do pedido
  const [selectedDate, setSelectedDate] = useState(''); // Data selecionada para o pedido
  const [deliveryCount, setDeliveryCount] = useState(0); // Quantidade de entregas

  const deliveryTotal = deliveryCount * 3; // Cálculo da taxa de entrega (R$3 por entrega)
  const finalTotal = total + deliveryTotal; // Cálculo do total final (produto + entrega)

  // Funções para manipular a quantidade de entregas
  const increaseDelivery = () => setDeliveryCount(prev => prev + 1); // Incrementa a quantidade de entregas
  const decreaseDelivery = () => setDeliveryCount(prev => (prev > 0 ? prev - 1 : 0)); // Decrementa a quantidade de entregas

  return {
    deliveryCount,
    selectedDate,
    setSelectedDate,
    deliveryTotal,
    finalTotal,
    handleSend,
    increaseDelivery,
    decreaseDelivery,
  };
};

export default UseItems;
