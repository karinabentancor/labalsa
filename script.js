document.addEventListener('DOMContentLoaded', function () {

    document.body.classList.add('listo');

    // ── EmailJS ──────────────────────────────────────────────
    emailjs.init('lF8jWDUR0JrnWpPR2');

    const EMAILJS_SERVICE  = 'service_sljumx8';
    const EMAILJS_TEMPLATE = 'template_jzi9p1j';
    // ─────────────────────────────────────────────────────────

    const logosPorPagina = {
        'radio.html':   'media/balsaC2.svg',
        'revista.html': 'media/balsaC2.svg',
    };

    fetch('menu.html')
        .then(r => r.text())
        .then(html => {
            const menuGlobal = document.getElementById('menu-global');
            if (menuGlobal) {
                menuGlobal.innerHTML = html;
            }

            const pagina = window.location.pathname.split('/').pop();
            const logoSrc = logosPorPagina[pagina];
            if (logoSrc) {
                const logoImg = document.querySelector('.navbar .logo');
                if (logoImg) logoImg.src = logoSrc;
            }

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
                        if (window.innerWidth <= 768) {
                            e.preventDefault();
                            const destino = enlace.href;
                            const link = document.createElement('link');
                            link.rel = 'prefetch';
                            link.href = destino;
                            document.head.appendChild(link);
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
        });

    document.querySelectorAll('.mes-header').forEach(header => {
        header.addEventListener('click', () => {
            const acordeon = header.parentElement;
            const estaAbierto = acordeon.classList.contains('abierto');
            document.querySelectorAll('.mes-acordeon').forEach(a => a.classList.remove('abierto'));
            if (!estaAbierto) acordeon.classList.add('abierto');
        });
    });

    document.querySelectorAll('.ep-audio').forEach(audio => {
        audio.addEventListener('play', () => {
            document.querySelectorAll('.ep-audio').forEach(other => {
                if (other !== audio) other.pause();
            });
        });
    });

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

    // ── Modal ─────────────────────────────────────────────────
    const btnAbrir  = document.getElementById('btnAbrirModal');
    const modal     = document.getElementById('modalSuscripcion');
    const btnCerrar = document.getElementById('modalCerrar');
    const form      = modal ? modal.querySelector('.suscripcion-form') : null;
    const btnSubmit = form  ? form.querySelector('.btn-modal-submit') : null;

    function abrirModal() {
        modal.classList.add('activa');
        document.body.style.overflow = 'hidden';
    }

    function cerrarModal() {
        modal.classList.remove('activa');
        document.body.style.overflow = '';
    }

    if (btnAbrir && modal) {
        btnAbrir.addEventListener('click', abrirModal);
        btnCerrar.addEventListener('click', cerrarModal);

        modal.addEventListener('click', function (e) {
            if (e.target === modal) cerrarModal();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('activa')) cerrarModal();
        });
    }

    // ── Envío del formulario con EmailJS ──────────────────────
    if (form && btnSubmit) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const nombre    = document.getElementById('sub-nombre').value.trim();
            const email     = document.getElementById('sub-email').value.trim();
            const celular   = document.getElementById('sub-cel').value.trim();
            const direccion = document.getElementById('sub-direccion').value.trim();
            const tipoEl    = form.querySelector('input[name="sub-tipo"]:checked');
            const tipo      = tipoEl ? tipoEl.value : '';

            // Validación básica
            if (!nombre || !email || !celular || !direccion) {
                mostrarMensaje('Por favor completá todos los campos.', 'error');
                return;
            }

            // Estado de carga
            btnSubmit.disabled   = true;
            btnSubmit.textContent = 'Enviando...';

            const templateParams = {
                nombre:    nombre,
                tipo:      tipo === 'anual' ? 'Suscripción anual' : 'Por número',
                email:     email,
                celular:   celular,
                direccion: direccion,
            };

            emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, templateParams)
                .then(function () {
                    mostrarMensaje('¡Suscripción enviada! Te contactamos pronto.', 'ok');
                    form.reset();
                    setTimeout(cerrarModal, 2800);
                })
                .catch(function (err) {
                    console.error('EmailJS error:', err);
                    mostrarMensaje('Hubo un problema. Intentá de nuevo.', 'error');
                })
                .finally(function () {
                    btnSubmit.disabled   = false;
                    btnSubmit.textContent = 'Confirmar suscripción';
                });
        });
    }

    // ── Helper: mensaje inline en el modal ───────────────────
    function mostrarMensaje(texto, tipo) {
        let msg = form.querySelector('.form-mensaje');
        if (!msg) {
            msg = document.createElement('p');
            msg.className = 'form-mensaje';
            msg.style.cssText = [
                'font-family:"JetBrains Mono",monospace',
                'font-size:12px',
                'letter-spacing:0.5px',
                'border-radius:6px',
                'padding:10px 14px',
                'margin-top:4px',
                'text-align:center',
            ].join(';');
            btnSubmit.insertAdjacentElement('afterend', msg);
        }
        msg.textContent = texto;
        msg.style.background = tipo === 'ok' ? '#e6f4ea' : '#fdecea';
        msg.style.color       = tipo === 'ok' ? '#1a7340' : '#b91c1c';
        if (tipo === 'ok') {
            setTimeout(() => msg.remove(), 3000);
        }
    }

});