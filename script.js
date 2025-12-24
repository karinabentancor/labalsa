const menuHamburguesa = document.getElementById('menuHamburguesa');
const menuDesplegable = document.getElementById('menuDesplegable');
const enlaces = menuDesplegable.querySelectorAll('a');

menuHamburguesa.addEventListener('click', function() {
    menuHamburguesa.classList.toggle('activo');
    menuDesplegable.classList.toggle('activo');
});

enlaces.forEach(function(enlace) {
    enlace.addEventListener('click', function() {
        menuHamburguesa.classList.remove('activo');
        menuDesplegable.classList.remove('activo');
    });
});

document.addEventListener('click', function(evento) {
    const dentroMenu = menuDesplegable.contains(evento.target);
    const dentroHamburguesa = menuHamburguesa.contains(evento.target);
    
    if (!dentroMenu && !dentroHamburguesa && menuDesplegable.classList.contains('activo')) {
        menuHamburguesa.classList.remove('activo');
        menuDesplegable.classList.remove('activo');
    }
});

const svgMovil = document.querySelector('.svg-movil');
let posicionX = -100;
const velocidad = 1;

function moverSVG() {
    posicionX += velocidad;
    
    if (posicionX > window.innerWidth) {
        posicionX = -100;
    }
    
    svgMovil.style.left = posicionX + 'px';
    requestAnimationFrame(moverSVG);
}

moverSVG();