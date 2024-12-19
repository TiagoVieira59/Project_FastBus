let quantity = 1;

// Aumentar quantidade
function increaseQuantity() {
  if (quantity < 10) {
    quantity++;
    document.getElementById("quantity").textContent = quantity;
  }
}

// Diminuir quantidade
function decreaseQuantity() {
  if (quantity > 1) {
    quantity--;
    document.getElementById("quantity").textContent = quantity;
  }
}

// Gerar bilhetes
document.getElementById("searchForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Capturar dados do formulário
  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;
  const idaDate = document.getElementById("date").value;
  const includeReturn = document.getElementById("includeReturn").checked;
  const returnDate = includeReturn ? document.getElementById("returnDate").value : null;

  // Gerar bilhetes aleatórios
  const tickets = generateTickets(from, to, idaDate, includeReturn, returnDate);

  // Armazenar bilhetes no localStorage
  localStorage.setItem("tickets", JSON.stringify(tickets));

  // Redirecionar para lista de viagens
  window.location.href = "lista_viagens.html";
});

function generateTickets(from, to, idaDate, includeReturn, returnDate) {
  const tickets = [];

  // Função auxiliar para gerar horários e preços aleatórios
  function getRandomTimeAndPrice() {
    const departureHour = Math.floor(Math.random() * 12) + 5; // Horário de saída entre 5h e 17h
    const travelTime = Math.floor(Math.random() * 3) + 1; // Tempo de viagem entre 1h e 3h
    const arrivalHour = departureHour + travelTime;

    const price = (3.5 + Math.random() * 1.5).toFixed(2); // Preço entre 3.5€ e 5€

    return {
      departure: `${departureHour}:00`,
      arrival: `${arrivalHour}:00`,
      price: price
    };
  }

  // Gerar bilhetes de ida
  for (let i = 0; i < 5; i++) {
    const { departure, arrival, price } = getRandomTimeAndPrice();
    tickets.push({
      from,
      to,
      date: idaDate,
      departure,
      arrival,
      price: `${price}€`,
      type: "Ida",
      availableSeats: Math.floor(Math.random() * 10) + 1 // Lugares disponíveis
    });
  }

  // Gerar bilhetes de volta (se selecionado)
  if (includeReturn && returnDate) {
    for (let i = 0; i < 5; i++) {
      const { departure, arrival, price } = getRandomTimeAndPrice();
      tickets.push({
        from: to,
        to: from,
        date: returnDate,
        departure,
        arrival,
        price: `${price}€`,
        type: "Volta",
        availableSeats: Math.floor(Math.random() * 10) + 1
      });
    }
  }

  return tickets;
}
