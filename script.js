// --- INICIALIZACIÓN ---
window.addEventListener('load', () => {
    crearJardinRosas();
});

// --- EVENTO DEL BOTÓN ---
document.getElementById('boton-corazon').addEventListener('click', function() {
    const btn = this;
    const audio = document.getElementById('player');
    const introScreen = document.getElementById('intro-screen');
    const mainContent = document.getElementById('main-content');
    
    audio.play().catch(e => console.warn("Audio bloqueado por navegador hasta interacción"));
    btn.classList.add('romper');

    setTimeout(() => {
        introScreen.style.opacity = '0'; 
        
        setTimeout(() => {
            introScreen.style.display = 'none'; 
            mainContent.classList.remove('oculto'); 
            
            // --- CONTROL DEL CIELO SEGÚN DISPOSITIVO ---
            const cielo = document.getElementById('cielo-nocturno');
            if (window.innerWidth > 768) {
                // Es PC: Encendemos el cielo suavemente
                if(cielo) cielo.style.opacity = '1';
            } else {
                // Es MÓVIL: Destruimos el cielo para cero lag
                if(cielo) cielo.remove(); 
            }
            
            // Efecto Cascada
            const elementosAparecer = document.querySelectorAll('.elemento-fade');
            elementosAparecer.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('aparecer');
                }, 600 * (index + 1));
            });
            
            iniciarLluviaGirasoles();
        }, 500);
    }, 500);
});

/* --- LÓGICA DE ROSAS 3D --- */
function crearJardinRosas() {
    const contenedor = document.getElementById('jardin-rosas');
    const esMovil = window.innerWidth < 768;
    
    // Cantidad de rosas
    const cantidad = esMovil ? 25 : 45; 

    for(let i=0; i<cantidad; i++) {
        const rosa = document.createElement('div');
        
        // CÁLCULO DE TAMAÑO CORRECTO: 
        // Móvil = rosas chiquitas y sutiles (0.2 a 0.35) | PC = rosas grandes (0.3 a 0.8)
        const tamaño = esMovil ? (Math.random() * 0.15 + 0.2) : (Math.random() * 0.5 + 0.3); 
        
        rosa.style.position = 'absolute';
        rosa.style.zIndex = 1;

        // Establecemos la variable de escala para que la animación CSS la lea correctamente
        rosa.style.setProperty('--escala-base', tamaño);
        rosa.style.animation = `flotarRosa ${Math.random() * 3 + 3}s infinite ease-in-out`;

        // Posiciones máximas al 90% para que nunca empujen la pantalla
        rosa.style.left = (Math.random() * 90) + '%';
        rosa.style.top = (Math.random() * 90) + '%';

        construirRosaProcedural(rosa);
        contenedor.appendChild(rosa);
    }
}

function construirRosaProcedural(elemento) {
    // Restaurados tus 25 pétalos perfectos. El lag ya no existe gracias al control del fondo.
    let totalPetalos = 25; 
    for (let i = 0; i < totalPetalos; i++) {
        const petalo = document.createElement('div');
        const angulo = i * 137.5; 
        const radio = 3 + (i * 1.8); 
        const opacidad = 0.85 - (i * 0.015);
        const colorBase = i % 2 === 0 ? '220, 20, 60' : '180, 0, 40'; 
        
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

/* --- LÓGICA DE LLUVIA DE GIRASOLES --- */
function iniciarLluviaGirasoles() {
    setInterval(() => {
        const girasol = document.createElement('div');
        girasol.style.position = 'absolute';
        // Máximo 90vw para que NO toque el borde derecho de la pantalla y no cause scroll
        girasol.style.left = Math.random() * 90 + 'vw';
        girasol.style.top = '-60px'; 
        girasol.style.zIndex = 2;
        
        crearCabezaGirasol(girasol);
        
        const duracion = Math.random() * 6 + 6; 
        girasol.style.transition = `top ${duracion}s linear, transform ${duracion}s linear`;
        
        document.getElementById('cielo-girasoles').appendChild(girasol);

        setTimeout(() => {
            girasol.style.top = '110vh'; 
            girasol.style.transform = `rotate(${Math.random() * 360 + 180}deg)`; 
        }, 50);

        setTimeout(() => { girasol.remove() }, duracion * 1000);
    }, 1200);
}

function crearCabezaGirasol(padre) {
    const escala = Math.random() * 0.4 + 0.6;
    padre.style.transform = `scale(${escala})`;
    padre.style.width = '50px'; padre.style.height = '50px';

    const centro = document.createElement('div');
    centro.style.cssText = `width: 22px; height: 22px; background: #4a3020; border-radius: 50%; position: absolute; top: 14px; left: 14px; z-index: 3; box-shadow: inset 0 0 5px #2a1a10;`;
    padre.appendChild(centro);

    for(let i=0; i<10; i++) {
        const petalo = document.createElement('div');
        petalo.style.cssText = `width: 12px; height: 30px; background: linear-gradient(to bottom, #ffdb4d, #ffcc00); border-radius: 50% 50% 20% 20%; position: absolute; top: 10px; left: 19px; transform-origin: center 20px; transform: rotate(${i * 36}deg) translateY(-18px); box-shadow: 1px 1px 2px rgba(0,0,0,0.2);`;
        padre.appendChild(petalo);
    }
}
