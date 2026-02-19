document.addEventListener('DOMContentLoaded', function () {

    // ✅ Mostrar el body recién cuando el DOM esté listo (evita flash de contenido)
    document.body.classList.add('listo');

    const menuHamburguesa = document.getElementById('menuHamburguesa');
    const menuDesplegable = document.getElementById('menuDesplegable');
    const enlaces = menuDesplegable ? menuDesplegable.querySelectorAll('a') : [];

    // ✅ Bloquear scroll del body cuando el menú está abierto (fix mobile)
    function bloquearScroll(bloquear) {
        document.body.style.overflow = bloquear ? 'hidden' : '';
    }

    if (menuHamburguesa && menuDesplegable) {
        menuHamburguesa.addEventListener('click', function () {
            const estaActivo = menuHamburguesa.classList.toggle('activo');
            menuDesplegable.classList.toggle('activo');
            bloquearScroll(estaActivo);
        });

        enlaces.forEach(function (enlace) {
            enlace.addEventListener('click', function () {
                menuHamburguesa.classList.remove('activo');
                menuDesplegable.classList.remove('activo');
                bloquearScroll(false);
            });
        });

        document.addEventListener('click', function (evento) {
            const dentroMenu = menuDesplegable.contains(evento.target);
            const dentroHamburguesa = menuHamburguesa.contains(evento.target);

            if (!dentroMenu && !dentroHamburguesa && menuDesplegable.classList.contains('activo')) {
                menuHamburguesa.classList.remove('activo');
                menuDesplegable.classList.remove('activo');
                bloquearScroll(false);
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menuDesplegable.classList.contains('activo')) {
                menuHamburguesa.classList.remove('activo');
                menuDesplegable.classList.remove('activo');
                bloquearScroll(false);
            }
        });
    }

    // ACORDEONES
    document.querySelectorAll('.mes-header').forEach(header => {
        header.addEventListener('click', () => {
            const acordeon = header.parentElement;
            const estaAbierto = acordeon.classList.contains('abierto');
            // Primero guardar estado, LUEGO cerrar todos
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
            if (posicionX > window.innerWidth) {
                posicionX = -100;
            }
            svgMovil.style.left = posicionX + 'px';
            requestAnimationFrame(moverSVG);
        }

        moverSVG();
    }
});