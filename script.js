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
        imgFrente: "img/Chainsaw Frente.png", 
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
        imgFrente: "img/Invincible frente.png", 
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
    },
    { 
        id: 7, 
        nombre: "Playera DANDADAN | All-Characthers Drop ", 
        categoria: "Playeras premium", 
        precio: 599, 
        imgFrente: "img/Dandan frente.png", 
        imgReverso: "img/Dadan Reverso.png", 
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

    // --- CORRECCIÓN INTEGRADA PARA PAYPAL ---
    // Si hay productos en el carrito y todavía existe el botón verde viejo, lo cambiamos por el de PayPal
    if (carrito.length > 0 && document.getElementById('pagar-btn')) {
        inicializarBotonesPayPal();
    }
}

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

// --- 7. INTEGRACIÓN DE PASARELA DE PAGO REAL CON PAYPAL ---

// Esta función se encarga de pintar los botones oficiales de PayPal adentro del carrito
function inicializarBotonesPayPal() {
    // Limpiamos el contenedor del botón por si acaso para que no se duplique
    const contenedorBoton = document.getElementById('pagar-btn');
    if (!contenedorBoton) return;

    // Cambiamos el botón viejo por el contenedor oficial de PayPal
    contenedorBoton.outerHTML = `<div id="paypal-button-container" style="margin-top: 15px; z-index: 10;"></div>`;

    paypal.Buttons({
        // Configuración del diseño del botón para que combine con la estética de SORGO
        style: {
            layout: 'vertical',
            color:  'black', // Negro premium para mantener la vibra oscura
            shape:  'rect',
            label:  'paypal'
        },

        // 1. Se ejecuta cuando el cliente le da clic al botón de PayPal
        createOrder: function(data, actions) {
            let totalCompra = parseFloat(document.getElementById('precio-total').innerText);
            
            if (totalCompra <= 0 || carrito.length === 0) {
                alert("No tienes artículos en tu pedido para proceder al pago.");
                return false;
            }

            // Le pasamos el total exacto del carrito a la ventanita de PayPal
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        currency_code: 'MXN',
                        value: totalCompra.toString()
                    },
                    description: "Drop Lab Clothes - SORGO.LAB"
                }]
            });
        },

        // 2. Se ejecuta en automático cuando el banco autoriza el pago del cliente
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(detalles) {
                // Generamos el código de orden interno único al azar para tu control
                const numeroAleatorio = Math.floor(1000 + Math.random() * 9000);
                const codigoOrden = `SRG-${numeroAleatorio}`;
                
                // Obtenemos el nombre del comprador que tiene registrado en su PayPal
                const nombreComprador = detalles.payer.name.given_name;

                // Mostramos el ticket de éxito con su código único en la pantalla
                alert(`¡PAGO PROCESADO CON ÉXITO, ${nombreComprador.toUpperCase()}! ⚡\n\nTu orden ha sido registrada.\nCódigo de Pedido: #${codigoOrden}\n\nGuardaremos tu diseño y productos en nuestro sistema. ¡Gracias por confiar en SORGO.LAB!`);

                // Vaciamos el carrito de la tienda y cerramos el panel en el cel si estaba abierto
                carrito = [];
                actualizarInterfaz();
                
                if (window.innerWidth <= 768) {
                    toggleCarrito();
                }
            });
        },

        // En caso de que ocurra un error con la tarjeta o fondos del cliente
        onError: function(err) {
            console.error("Error en la pasarela de PayPal:", err);
            alert("Hubo un problema al procesar tu pago con PayPal. Verifica tus datos e intenta de nuevo.");
        }
    }).render('#paypal-button-container');
}

// Modificamos ligeramente la actualización de la interfaz para que vigile los botones
const funcionActualizarInterfazVieja = actualizarInterfaz;
actualizarInterfaz = function() {
    funcionActualizarInterfazVieja();
    // Si el usuario añade cosas y no se han creado los botones, los inicializamos
    if (!document.getElementById('paypal-button-container') && carrito.length > 0) {
        inicializarBotonesPayPal();
    }
};

// --- 8. FUNCIÓN PARA ABRIR/CERRAR EL CARRITO EN CELULAR ---
window.toggleCarrito = () => {
    const carritoPanel = document.getElementById('carrito-panel');
    if (carritoPanel) {
        carritoPanel.classList.toggle('activo');
    }
};

// --- 9. OPTIMIZACIÓN DE TOQUE (TOUCH) PARA CELULARES ---
function habilitarTouchParaCelular() {
    const wrappers = document.querySelectorAll('.producto-media-wrapper');
    
    wrappers.forEach(wrapper => {
        wrapper.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-agregar')) return;

            if (window.innerWidth <= 768) {
                const frente = wrapper.querySelector('.producto-media.frente');
                const reverso = wrapper.querySelector('.producto-media.reverso');
                
                if (reverso && reverso.style.opacity === "1") {
                    frente.style.opacity = "1";
                    reverso.style.opacity = "0";
                } else if (reverso) {
                    frente.style.opacity = "0";
                    reverso.style.opacity = "1";
                }
            }
        });
    });
}

// --- 10. UNICA INICIALIZACIÓN AUTOMÁTICA ---
window.addEventListener('DOMContentLoaded', () => {
    controlarIntro();
    mostrarProductos();
    habilitarTouchParaCelular();
});