// --- 1. CONTROL DE TIEMPO Y SINCRONIZACIÓN DE LA INTRO (24 SEGUNDOS) ---
function controlarIntro() {
    const barra = document.getElementById('barra-progreso');
    const introScreen = document.getElementById('intro-screen');
    const introContent = document.querySelector('.intro-content');
    
    const tiempoEstablecido = 24; 
    let tiempoCorriendo = 0;

    // Reloj de alta precisión que actualiza la barra cada 100ms
    const relojCarga = setInterval(() => {
        tiempoCorriendo += 0.1;
        let porcentajeActual = (tiempoCorriendo / tiempoEstablecido) * 100;
        
        if (barra) {
            barra.style.width = `${porcentajeActual}%`;
        }

        // Al cumplir los 24 segundos exactos
        if (tiempoCorriendo >= tiempoEstablecido) {
            clearInterval(relojCarga);
            dispararTransicionApertura();
        }
    }, 100);

    function dispararTransicionApertura() {
        // Fase 1: Desvanecer el video y el texto del centro
        introContent.style.opacity = '0';

        // Fase 2: Las compuertas se parten a la mitad hacia los lados
        setTimeout(() => {
            introScreen.classList.add('abrir');
            
            // Fase 3: Al terminar de abrirse las hojas (1.6s), quitamos el bloque de la intro
            setTimeout(() => {
                introScreen.style.display = 'none';
            }, 1600);

        }, 800);
    }
}

// --- 2. BASE DE DATOS DE PRODUCTOS REALES (SORGO DROPS) ---
const productos = [
    { 
        id: 1, 
        nombre: "Playera Chainsaw Man | Denji & Makima", 
        categoria: "Playeras Premium", 
        precio: 599, 
        imgFrente: "img/chainsaw.jpeg", 
        imgReverso: "img/Chainsaw Reverso.png", 
        esVideo: false 
    },
    { 
        id: 2, 
        nombre: "Playera Jujutsu Kaisen | Satoru Gojo", 
        categoria: "Playeras Premium", 
        precio: 599, 
        imgFrente: "img/Jujutsu K.png", 
        imgReverso: "img/Jujutsu K R.png", 
        esVideo: false 
    },
    { 
        id: 3, 
        nombre: "Playera Invincible | All-Characters Drop", 
        categoria: "Playeras Premium", 
        precio: 649, 
        imgFrente: "img/invencible.jpg", 
        imgReverso: "img/invencible 2.jpg", 
        esVideo: false 
    },
    { 
        id: 4, 
        nombre: "Playera Suicideboys | G59 Skull", 
        categoria: "Streetwear Series", 
        precio: 550, 
        imgFrente: "img/suiceboys.jpg", 
        imgReverso: "img/suiceboys 2.jpg", 
        esVideo: false 
    },
    { 
        id: 5, 
        nombre: "Taza Mágica Sukuna 360°", 
        categoria: "Tazas Mágicas", 
        precio: 190, 
        imgFrente: "img/taza.mp4", 
        imgReverso: "", 
        esVideo: true 
    },
    { 
        id: 6, 
        nombre: "Cuadro Tanjiro HD Eye", 
        categoria: "Marcos Galería", 
        precio: 450, 
        imgFrente: "img/marco.jpg", 
        imgReverso: "img/marco.jpg", 
        esVideo: false 
    }
];

let carrito = [];
const contenedor = document.getElementById('contenedor-productos');

// --- 3. RENDERIZAR EL DROP EN LA TIENDA ---
function mostrarProductos() {
    productos.forEach(p => {
        const div = document.createElement('div');
        div.className = 'producto-card';
        
        let elementoVisual = "";
        if (p.esVideo) {
            // Estructura especial para video continuo de la taza
            elementoVisual = `
                <div class="producto-media-wrapper" onclick="abrirVisor(${p.id})">
                    <video src="${p.imgFrente}" autoplay loop muted playsinline class="producto-media frente"></video>
                </div>`;
        } else {
            // Estructura de doble vista interactiva (Frente/Espalda) para playeras y cuadros
            elementoVisual = `
                <div class="producto-media-wrapper" onclick="abrirVisor(${p.id})">
                    <img src="${p.imgFrente}" class="producto-media frente" alt="${p.nombre} Frente" loading="lazy">
                    <img src="${p.imgReverso}" class="producto-media reverso" alt="${p.nombre} Reverso" loading="lazy">
                </div>`;
        }

        div.innerHTML = `
            ${elementoVisual}
            <p class="categoria-tag">${p.categoria}</p>
            <h3>${p.nombre}</h3>
            <p class="precio">$${p.precio} MXN</p>
            <button class="btn-agregar" onclick="alCarrito(${p.id})">Añadir al Drop</button>
        `;
        contenedor.appendChild(div);
    });
}

// --- 4. VISOR DE ALTA DEFINICIÓN (MODAL EN GRANDE LADO A LADO) ---
window.abrirVisor = (id) => {
    const p = productos.find(prod => prod.id === id);
    const modal = document.getElementById('modal-visor');
    const visorMedia = document.getElementById('visor-media');
    document.getElementById('titulo-visor').innerText = p.nombre;
    
    visorMedia.innerHTML = '';

    if (p.esVideo) {
        visorMedia.innerHTML = `<video src="${p.imgFrente}" autoplay loop controls class="taza-media-grande"></video>`;
    } else {
        // En el visor, abrimos frente y espalda juntos lado a lado
        visorMedia.innerHTML = `
            <div class="visor-imagenes-flex">
                <img src="${p.imgFrente}" class="producto-media-grande">
                <img src="${p.imgReverso}" class="producto-media-grande">
            </div>
        `;
    }
    modal.style.display = "flex";
};

// Cerrar el Visor Grande
document.querySelector('.cerrar-modal').onclick = () => {
    document.getElementById('modal-visor').style.display = "none";
    document.getElementById('visor-media').innerHTML = '';
};

// --- 5. LÓGICA DEL CARRITO DE COMPRAS ---
window.alCarrito = (id) => {
    const item = productos.find(p => p.id === id);
    const enCarrito = carrito.find(p => p.id === id);
    
    enCarrito ? enCarrito.cantidad++ : carrito.push({ ...item, cantidad: 1 });
    actualizarInterfaz();
};

function actualizarInterfaz() {
    const lista = document.getElementById('items-carrito');
    const contador = document.getElementById('contador-carrito');
    lista.innerHTML = '';
    let total = 0;
    
    carrito.forEach(p => {
        total += (p.precio * p.cantidad);
        lista.innerHTML += `
            <div class="item-en-carrito">
                <span>${p.nombre} (x${p.cantidad})</span>
                <span>$${p.precio * p.cantidad}</span>
            </div>`;
    });
    
    document.getElementById('precio-total').innerText = total;
    
    // Animación y conteo del botón superior del carrito
    let totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0);
    contador.innerText = totalItems;
    contador.classList.add('pop-anim');
    setTimeout(() => contador.classList.remove('pop-anim'), 200);
}

// --- 6. SERVICIO PERSONALIZADO ---
window.agregarDisenoPersonalizado = () => {
    const ideaInput = document.getElementById('idea-cliente');
    const idea = ideaInput.value.trim();
    if(!idea) return alert("Escribe tu idea antes de agregar el servicio.");
    
    carrito.push({ id: Date.now(), nombre: `CUSTOM: "${idea}"`, precio: 650, cantidad: 1 });
    actualizarInterfaz();
    ideaInput.value = '';
    alert("¡Pedido especial añadido con éxito!");
};

// --- 7. PASARELA DE PAGO (REDIRECCIÓN) ---
document.getElementById('pagar-btn').addEventListener('click', () => {
    if (carrito.length > 0) {
        let totalCompra = parseFloat(document.getElementById('precio-total').innerText);
        alert(`Redirigiendo a la pasarela segura para pagar $${totalCompra} MXN...`);
        carrito = [];
        actualizarInterfaz();
    } else {
        alert("No tienes artículos en tu orden actual para proceder al pago.");
    }
});

// --- 8. INICIALIZACIÓN AUTOMÁTICA ---
window.addEventListener('DOMContentLoaded', () => {
    controlarIntro();
    mostrarProductos();
});