let map;
let miUbicacion = null;
let marcadorUsuario = null;
let controlRuta = null;
let marcadorSimulacion = null;
let vendedorSeleccionado = null;
let marcadoresVendedores = [];

const iconoPersona = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

let vendedores = [
{nombre:"Arepas Doña Marta",categoria:"arepas",coords:[2.4455,-76.6142],producto:"Arepas rellenas",imagenes:["https://i.imgur.com/8Km9tLL.jpg"]},
{nombre:"Helados El Frío",categoria:"helados",coords:[2.4439,-76.6135],producto:"Helados artesanales",imagenes:["https://i.imgur.com/u6dXG9G.jpg"]},
{nombre:"Cholados El Paisa",categoria:"cholados",coords:[2.4462,-76.6128],producto:"Cholados",imagenes:["https://i.imgur.com/4Qy4F8h.jpg"]},
{nombre:"Empanadas Don Luis",categoria:"empanadas",coords:[2.4471,-76.6160],producto:"Empanadas calientes",imagenes:["https://i.imgur.com/9Xn4K2M.jpg"]},
{nombre:"Jugos Naturales Ana",categoria:"jugos",coords:[2.4428,-76.6150],producto:"Jugos naturales",imagenes:["https://i.imgur.com/F6aYbQp.jpg"]},
{nombre:"Salchipapas El Combo",categoria:"rapida",coords:[2.4440,-76.6172],producto:"Salchipapas",imagenes:["https://i.imgur.com/3ZQ3Z6m.jpg"]},
{nombre:"Obleas La Dulzura",categoria:"obleas",coords:[2.4468,-76.6180],producto:"Obleas",imagenes:["https://i.imgur.com/5tj6S7Ol.jpg"]},
{nombre:"Churros Express",categoria:"churros",coords:[2.4430,-76.6118],producto:"Churros",imagenes:["https://i.imgur.com/2vQtZBb.jpg"]},
{nombre:"Tinto Caliente",categoria:"cafe",coords:[2.4480,-76.6130],producto:"Café",imagenes:["https://i.imgur.com/F6aYbQp.jpg"]},
{nombre:"Mazorcadas El Sabor",categoria:"mazorcadas",coords:[2.4415,-76.6125],producto:"Mazorcadas",imagenes:["https://i.imgur.com/3ZQ3Z6m.jpg"]},
{nombre:"Hamburguesas Pop",categoria:"rapida",coords:[2.4490,-76.6155],producto:"Hamburguesas",imagenes:["https://i.imgur.com/2vQtZBb.jpg"]},
{nombre:"Perros Calientes Max",categoria:"rapida",coords:[2.4409,-76.6168],producto:"Perros calientes",imagenes:["https://i.imgur.com/3ZQ3Z6m.jpg"]}
];


function iniciarMapa() {

    map = L.map('map').setView([2.4448, -76.6147], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    mostrarVendedores(vendedores);

    setTimeout(() => map.invalidateSize(), 200);
}

window.onload = iniciarMapa;


function mostrarUbicacion() {

    navigator.geolocation.getCurrentPosition(pos => {

        miUbicacion = [pos.coords.latitude, pos.coords.longitude];

        if (marcadorUsuario) map.removeLayer(marcadorUsuario);

        marcadorUsuario = L.marker(miUbicacion, { icon: iconoPersona })
            .addTo(map)
            .bindPopup("Estás aquí ")
            .openPopup();

        map.setView(miUbicacion, 16);
    });
}


document.getElementById("buscadorCategoria").addEventListener("change", function() {

    let valor = this.value.toLowerCase();

    if (valor === "todos") {
        limpiarMarcadores();
        mostrarVendedores(vendedores);
        return;
    }

    let filtrados = vendedores.filter(v =>
        v.categoria.includes(valor)
    );

    limpiarMarcadores();
    mostrarVendedores(filtrados);
});

function limpiarMarcadores() {
    marcadoresVendedores.forEach(m => map.removeLayer(m));
    marcadoresVendedores = [];
}


function mostrarVendedores(lista) {

    lista.forEach(v => {

        let marker = L.marker(v.coords).addTo(map);
        marcadoresVendedores.push(marker);

        marker.on('click', () => seleccionarVendedor(v));
    });
}


function seleccionarVendedor(v) {

    vendedorSeleccionado = v;

    document.getElementById("panelVendedor").style.display = "block";
    document.getElementById("nombreVendedor").innerText = v.nombre;
    document.getElementById("infoVendedor").innerText = v.producto;
    document.getElementById("imgProducto").src = v.imagenes[0];

    if (!miUbicacion) {
        alert("Primero presiona 'Mi ubicación'");
        return;
    }

    trazarRuta(L.latLng(v.coords[0], v.coords[1]));
}

function trazarRuta(destino) {

    if (controlRuta) map.removeControl(controlRuta);

    controlRuta = L.Routing.control({
        waypoints: [
            L.latLng(miUbicacion[0], miUbicacion[1]),
            destino
        ],
        show: false,

        lineOptions: {
            styles : [
                { color: '#007bff', weight: 8, opacity: 0.95 },
                { color: '#ffffff', weight: 4, opacity: 0.9 }
            ]
        }

    }).addTo(map);

    document.getElementById("btnRecorrido").disabled = false;
}

function iniciarRecorrido() {

    if (!controlRuta) return;

    document.getElementById("panelVendedor").style.display = "none";


    controlRuta.route();

    controlRuta.once('routesfound', e => {
        simularRecorrido(e.routes[0].coordinates);
    });
}


function simularRecorrido(coords) {

    if (marcadorSimulacion) map.removeLayer(marcadorSimulacion);

    let i = 0;

    marcadorSimulacion = L.marker(coords[0], { icon: iconoPersona }).addTo(map);

    let intervalo = setInterval(() => {

        i++;

        if (i >= coords.length) {
            clearInterval(intervalo);
            marcadorSimulacion.bindPopup("Llegaste 🎉").openPopup();
            return;
        }

        marcadorSimulacion.setLatLng(coords[i]);
        map.panTo(coords[i], { animate: true });

    }, 600);
}