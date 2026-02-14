// --- INICIALIZACIÓN ---
// Generamos las rosas 3D apenas carga la página para que no se vea vacío.
window.addEventListener('load', () => {
    crearJardinRosas();
});

// --- EVENTO DEL BOTÓN ---
document.getElementById('boton-corazon').addEventListener('click', function() {
    const btn = this;
    const audio = document.getElementById('player');
    const introScreen = document.getElementById('intro-screen');
    const mainContent = document.getElementById('main-content');
    
    // 1. Intentar reproducir audio
    audio.play().catch(e => console.warn("Audio bloqueado por navegador hasta interacción"));

    // 2. Romper el botón
    btn.classList.add('romper');

    // 3. Transición de pantallas
    setTimeout(() => {
        introScreen.style.opacity = '0'; // Desvanece el contenedor del botón
        
        setTimeout(() => {
            introScreen.style.display = 'none'; // Lo quita del flujo
            mainContent.classList.remove('oculto'); // Muestra el contenedor principal
            
            // --- NUEVO: MOSTRAR CIELO SOLO EN PC ---
            if (window.innerWidth > 768) {
        const cielo = document.getElementById('cielo-nocturno');
        if (cielo) {
            cielo.style.display = 'block'; // Aseguramos que se vea en PC
            setTimeout(() => {
                cielo.style.opacity = '1';
            }, 10);
        }
    } else {
        // En móvil nos aseguramos que esté muerto
        document.getElementById('cielo-nocturno').style.display = 'none';
        }
            iniciarLluviaGirasoles();
        }, 500);

    }, 500);
});


/* --- MODIFICACIÓN NUEVA --- */
/* --- LÓGICA DE ROSAS 3D (DISTRIBUCIÓN ALEATORIA) --- */
function crearJardinRosas() {
    const contenedor = document.getElementById('jardin-rosas');
    
    // Detectamos si es un dispositivo móvil (pantalla menor a 768px)
    const esMovil = window.innerWidth < 768;

    // Ajustamos la cantidad: Unas pocas más en móvil para compensar el tamaño pequeño, 
    // y mantenemos una buena cantidad en PC.
    const cantidad = esMovil ? 30 : 50; 

    for(let i=0; i<cantidad; i++) {
        const rosa = document.createElement('div');
        
        let tamaño;
        if (esMovil) {
            // --- AJUSTE PARA MÓVIL ---
            // Hacemos las rosas mucho más pequeñas (entre 0.2 y 0.45 de escala)
            // para que no saturen la pantalla pequeña.
            tamaño = Math.random() * 0.25 + 0.2; 
        } else {
            // --- AJUSTE PARA PC (Original) ---
            // Mantenemos el tamaño original que te gusta en pantalla grande.
            tamaño = Math.random() * 0.5 + 0.3; 
        }
        
        rosa.style.position = 'absolute';
        // Aplicamos el tamaño calculado según el dispositivo
        rosa.style.transform = `scale(${tamaño})`;
        rosa.style.zIndex = 1;

        // POSICIONAMIENTO ALEATORIO TOTAL
        // Usamos hasta el 95% y 90% para evitar que se corten demasiado en los bordes.
        const posX = Math.random() * 95; 
        const posY = Math.random() * 90; 

        rosa.style.left = posX + '%';
        rosa.style.top = posY + '%';

        // Animación suave de flotación
        rosa.style.animation = `flotarRosa ${Math.random() * 3 + 3}s infinite ease-in-out`;

        // Generar los pétalos 3D
        construirRosaProcedural(rosa);
        contenedor.appendChild(rosa);
    }
}

function construirRosaProcedural(elemento) {
    // Si es móvil, dibujamos menos pétalos (15 en lugar de 25)
    // Se verá casi igual pero irá 2 veces más rápido
    const esMovil = window.innerWidth < 768;
    let totalPetalos = esMovil ? 15 : 25; 

    for (let i = 0; i < totalPetalos; i++) {
        const petalo = document.createElement('div');
        const angulo = i * 137.5; // Ángulo dorado para espiral natural
        const radio = 3 + (i * 1.8); 
        // Gradiente RGBA para profundidad
        const opacidad = 0.85 - (i * 0.015);
        const colorBase = i % 2 === 0 ? '220, 20, 60' : '180, 0, 40'; // Variación leve de rojo
        
        petalo.style.cssText = `
            position: absolute; top: 0; left: 0;
            width: ${18 + i*0.8}px; height: ${18 + i*0.8}px;
            background: radial-gradient(circle at 30% 30%, rgba(255, 80, 100, ${opacidad}), rgba(${colorBase}, 1));
            border-radius: 50% 0 50% 50%;
            transform: rotate(${angulo}deg) translate(${radio}px) rotate(45deg);
            box-shadow: 2px 2px 5px rgba(0,0,0,0.4);
        `;
        elemento.appendChild(petalo);
    }
}


/* --- LÓGICA DE LLUVIA DE GIRASOLES (CAÍDA) --- */
function iniciarLluviaGirasoles() {
    setInterval(() => {
        const girasol = document.createElement('div');
        girasol.style.position = 'absolute';
        girasol.style.left = Math.random() * 100 + 'vw';
        girasol.style.top = '-60px'; // Empieza fuera de la pantalla arriba
        girasol.style.zIndex = 2;
        
        crearCabezaGirasol(girasol);
        
        // Velocidad de caída aleatoria
        const duracion = Math.random() * 6 + 6; 
        girasol.style.transition = `top ${duracion}s linear, transform ${duracion}s linear`;
        
        document.getElementById('cielo-girasoles').appendChild(girasol);

        // Forzar el inicio de la animación
        setTimeout(() => {
            girasol.style.top = '110vh'; // Cae hasta abajo
            girasol.style.transform = `rotate(${Math.random() * 360 + 180}deg)`; // Rota mientras cae
        }, 50);

        // Eliminar el elemento al terminar para no saturar la memoria
        setTimeout(() => { girasol.remove() }, duracion * 1000);
    }, 1000); // Crea uno nuevo cada segundo
}

function crearCabezaGirasol(padre) {
    // Escala aleatoria para los girasoles
    const escala = Math.random() * 0.5 + 0.6;
    padre.style.transform = `scale(${escala})`;

    padre.style.width = '50px'; height: '50px';
    const centro = document.createElement('div');
    centro.style.cssText = `width: 22px; height: 22px; background: #4a3020; border-radius: 50%; position: absolute; top: 14px; left: 14px; z-index: 3; box-shadow: inset 0 0 5px #2a1a10;`;
    padre.appendChild(centro);

    for(let i=0; i<10; i++) {
        const petalo = document.createElement('div');
        petalo.style.cssText = `width: 12px; height: 30px; background: linear-gradient(to bottom, #ffdb4d, #ffcc00); border-radius: 50% 50% 20% 20%; position: absolute; top: 10px; left: 19px; transform-origin: center 20px; transform: rotate(${i * 36}deg) translateY(-18px); box-shadow: 1px 1px 2px rgba(0,0,0,0.2);`;
        padre.appendChild(petalo);
    }

}

