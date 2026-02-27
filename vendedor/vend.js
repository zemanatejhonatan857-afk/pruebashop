const estadoTexto = document.getElementById("estadoTexto");
const panelVendedor = document.getElementById("panelVendedor");
const btnActivar = document.getElementById("btnActivar");
const btnInactivar = document.getElementById("btnInactivar");
const btnInactivarFloat = document.getElementById("btnInactivarFloat");
const inputImagen = document.getElementById("imagenNegocio");

let marcadorVendedor = null;
let ubicacionActual = null;
let imagenCargada = "";
let horario = { inicio: "", fin: "" };

let map = L.map('map').setView([2.4448, -76.6147], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);


if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(pos => {
    ubicacionActual = [pos.coords.latitude, pos.coords.longitude];
    map.setView(ubicacionActual, 16);
  });
}


inputImagen.addEventListener("change", function() {
  const archivo = this.files[0];
  if (!archivo) return;
  const lector = new FileReader();
  lector.onload = function(e) {
    imagenCargada = e.target.result;
    document.getElementById("previewImagen").src = imagenCargada;
    document.getElementById("previewImagen").style.display = "block";
  };
  lector.readAsDataURL(archivo);
});


btnActivar.onclick = () => {
  const nombre = document.getElementById("nombreNegocio").value.trim();
  const inicio = document.getElementById("horaInicio").value;
  const fin = document.getElementById("horaFin").value;

  if (!nombre) { alert("Ingresa el nombre del negocio"); return; }
  if (!ubicacionActual) { alert("Esperando ubicación..."); return; }
  if (!inicio || !fin) { alert("Ingresa el horario"); return; }

  horario.inicio = inicio;
  horario.fin = fin;

  if (marcadorVendedor) map.removeLayer(marcadorVendedor);

  marcadorVendedor = L.marker(ubicacionActual).addTo(map)
    .bindPopup(`
      <div style="text-align:center; max-width:200px;">
        <b>${nombre}</b><br>
        <small>Horario: ${inicio} - ${fin}</small><br>
        ${imagenCargada ? `<img src="${imagenCargada}" style="width:120px; border-radius:8px; margin-top:6px;">` : ""}
      </div>
    `).openPopup();

  map.setView(ubicacionActual, 16);

  estadoTexto.textContent = "ACTIVO";
  estadoTexto.style.background = "green";

  panelVendedor.classList.add("oculto");
  btnInactivarFloat.classList.remove("oculto");
};


function inactivarVendedor() {
  if (marcadorVendedor) {
    map.removeLayer(marcadorVendedor);
    marcadorVendedor = null;
  }

  estadoTexto.textContent = "INACTIVO";
  estadoTexto.style.background = "rgba(255,255,255,0.25)";

  panelVendedor.classList.remove("oculto");
  btnInactivarFloat.classList.add("oculto");
}

btnInactivar.onclick = inactivarVendedor;
btnInactivarFloat.onclick = inactivarVendedor;