document.addEventListener('DOMContentLoaded', function () {

    document.body.classList.add('listo');

    // Navbar: fondo suave al hacer scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const actualizarNavbar = () => {
            navbar.classList.toggle('con-scroll', window.scrollY > 20);
        };
        window.addEventListener('scroll', actualizarNavbar, { passive: true });
        actualizarNavbar();
    }


    const menuHamburguesa = document.getElementById('menuHamburguesa');
    const menuDesplegable = document.getElementById('menuDesplegable');
    const enlaces = menuDesplegable ? menuDesplegable.querySelectorAll('a') : [];

    function bloquearScroll(bloquear) {
        document.body.style.overflow = bloquear ? 'hidden' : '';
    }

    function cerrarMenu() {
        menuHamburguesa.classList.remove('activo');
        menuDesplegable.classList.remove('activo');
        bloquearScroll(false);
    }

    if (menuHamburguesa && menuDesplegable) {
        menuHamburguesa.addEventListener('click', function () {
            const estaActivo = menuHamburguesa.classList.toggle('activo');
            menuDesplegable.classList.toggle('activo');
                bloquearScroll(estaActivo);
        });

        enlaces.forEach(function (enlace) {
            enlace.addEventListener('click', function (e) {
                // Solo en mobile (menos de 768px)
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const destino = enlace.href;
                    // Precargar la página y recién ahí deslizar el menú
                    const link = document.createElement('link');
                    link.rel = 'prefetch';
                    link.href = destino;
                    document.head.appendChild(link);
                    // Esperar un momento para que empiece a cargar, luego animar
                    setTimeout(function () {
                        menuDesplegable.style.transition = 'transform 0.35s ease';
                        menuDesplegable.style.transform = 'translateX(-100%)';
                        setTimeout(function () {
                            window.location.href = destino;
                        }, 360);
                    }, 80);
                } else {
                    cerrarMenu();
                }
            });
        });

        document.addEventListener('click', function (evento) {
            const dentroMenu = menuDesplegable.contains(evento.target);
            const dentroHamburguesa = menuHamburguesa.contains(evento.target);
            if (!dentroMenu && !dentroHamburguesa && menuDesplegable.classList.contains('activo')) {
                cerrarMenu();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menuDesplegable.classList.contains('activo')) {
                cerrarMenu();
            }
        });
    }

    // ACORDEONES
    document.querySelectorAll('.mes-header').forEach(header => {
        header.addEventListener('click', () => {
            const acordeon = header.parentElement;
            const estaAbierto = acordeon.classList.contains('abierto');
            document.querySelectorAll('.mes-acordeon').forEach(a => a.classList.remove('abierto'));
            if (!estaAbierto) acordeon.classList.add('abierto');
        });
    });

    // PAUSA OTROS AUDIOS al reproducir uno
    document.querySelectorAll('.ep-audio').forEach(audio => {
        audio.addEventListener('play', () => {
            document.querySelectorAll('.ep-audio').forEach(other => {
                if (other !== audio) other.pause();
            });
        });
    });

    // SVG animado
    const svgMovil = document.querySelector('.svg-movil');
    if (svgMovil) {
        let posicionX = -100;
        const velocidad = 1;
        function moverSVG() {
            posicionX += velocidad;
            if (posicionX > window.innerWidth) posicionX = -100;
            svgMovil.style.left = posicionX + 'px';
            requestAnimationFrame(moverSVG);
        }
        moverSVG();
    }

});