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