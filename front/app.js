const API_URL = "http://localhost:5500/api";

const formulario = document.querySelector("#form-reserva");
const comboCanchas = document.querySelector("#cancha");
const listaReservas = document.querySelector("#lista-reservas");
const tablaRecaudacion = document.querySelector("#tabla-recaudacion");
const mensaje = document.querySelector("#mensaje");

const formatearPrecio = (valor) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS"
  }).format(valor);

async function cargarCanchas() {
  try {
    const response = await fetch(`${API_URL}/canchas`);
    if (!response.ok) throw new Error("Error al cargar las canchas");
    const canchas = await response.json();
    comboCanchas.innerHTML = `<option value="">Seleccione una cancha</option>` + canchas
      .map(
        (cancha) =>
          `<option value="${cancha.IdCancha}">${cancha.Nombre} - ${formatearPrecio(cancha.PrecioPorHora)}</option>`
      )
      .join("");
  } catch (error) {
    console.error(error);
    mensaje.textContent = "Error al cargar las canchas.";
  }
}

async function cargarReservas() {
  try {
    const response = await fetch(`${API_URL}/reservas`);
    if (!response.ok) throw new Error("Error al cargar las reservas");
    const reservas = await response.json();
    listaReservas.innerHTML = reservas
      .map(
        (reserva) => `
          <tr>
            <td>${reserva.Cliente}</td>
            <td>${reserva.NombreCancha}</td>
            <td>${reserva.Fecha}</td>
            <td>${reserva.Hora}</td>
            <td>${formatearPrecio(reserva.PrecioPorHora)}</td>
            <td>${reserva.Pagada ? "Sí" : "No"}</td>
            <td>
              ${
                !reserva.Pagada
                  ? `<button class="btn-pagar" data-id="${reserva.IdReserva}">Registrar Pago</button>`
                  : ""
              }
            </td>
          </tr>
        `
      )
      .join("");
  } catch (error) {
    console.error(error);
    mensaje.textContent = "Error al cargar las reservas.";
  }
}

async function cargarRecaudacionPorCancha() {
  try {
  
    const response = await fetch(`${API_URL}/reportes/recaudacion`);
    if (!response.ok) throw new Error("Error al cargar la recaudación");
    const recaudacion = await response.json();
    
    tablaRecaudacion.innerHTML = recaudacion
      .map(
        (item) => `
          <tr>
            <td>${item.NombreCancha}</td>
            <td>${item.CantidadReservas}</td>
            <td>${formatearPrecio(item.TotalCobrado)}</td>
            <td>${formatearPrecio(item.TotalPendiente)}</td>
          </tr>
        `
      )
      .join("");
  } catch (error) {
    console.error(error);
    mensaje.textContent = "Error al cargar la recaudación.";
  }
}

async function CrearReserva(event) {
  event.preventDefault();
  const formData = new FormData(formulario);
  
 
  const reservaData = {
    Cliente: formData.get("nombre"),
    IdCancha: formData.get("cancha"),
    Fecha: formData.get("fecha"),
    Hora: formData.get("hora")
  };

  try {
    const response = await fetch(`${API_URL}/reservas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reservaData)
    });

    const resultado = await response.json();

    if (!response.ok) {
      throw new Error(resultado.mensaje || "Error al registrar la reserva");
    }

    mensaje.textContent = "Reserva registrada con éxito.";
    formulario.reset();
    cargarReservas();
    cargarRecaudacionPorCancha();
  } catch (error) {
    console.error(error);
    mensaje.textContent = error.message;
  }
}

async function registrarPago(id) {
  try {
    const response = await fetch(`${API_URL}/reservas/${id}/pago`, {
      method: "PUT"
    });

    const resultado = await response.json();

    if (!response.ok) {
      throw new Error(resultado.mensaje || "Error al registrar el pago");
    }

    mensaje.textContent = "Pago registrado con éxito.";
    cargarReservas();
    cargarRecaudacionPorCancha();
  } catch (error) {
    console.error(error);
    mensaje.textContent = error.message;
  }
}

formulario.addEventListener("submit", CrearReserva);

listaReservas.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-pagar")) {
    const reservaId = event.target.dataset.id;
    registrarPago(reservaId);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  cargarCanchas();
  cargarReservas();
  cargarRecaudacionPorCancha();
});