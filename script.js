document.addEventListener('DOMContentLoaded', function () {

    document.body.classList.add('listo');

    const EMAILJS_SERVICE  = 'service_sljumx8';
    const EMAILJS_TEMPLATE = 'template_jzi9p1j';

    if (typeof emailjs !== 'undefined') {
        emailjs.init('lF8jWDUR0JrnWpPR2');
    }

    const SUPABASE_URL = 'https://npqxqfxzykvpwwrrrupc.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_djOkmwydtJ-WFW3veBk3RA_-Ryqv6lw';

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

    document.addEventListener('click', function (e) {
        const header = e.target.closest('.mes-header');
        if (!header) return;
        const acordeon = header.parentElement;
        const estaAbierto = acordeon.classList.contains('abierto');
        document.querySelectorAll('.mes-acordeon').forEach(a => a.classList.remove('abierto'));
        if (!estaAbierto) acordeon.classList.add('abierto');
    });

    document.addEventListener('play', function (e) {
        if (!e.target.classList || !e.target.classList.contains('ep-audio')) return;
        document.querySelectorAll('.ep-audio').forEach(other => {
            if (other !== e.target) other.pause();
        });
    }, true);

    function armarReproductorEpisodio(audioEp) {
        const wrap = audioEp.closest('.ep-audio-wrap');
        if (!wrap || wrap.dataset.armado === '1') return;
        wrap.dataset.armado = '1';

        const srcEp = audioEp.getAttribute('src');
        audioEp.removeAttribute('controls');
        audioEp.preload = 'metadata';

        const player = document.createElement('div');
        player.className = 'ep-player';
        player.innerHTML =
            '<button class="ep-play-btn" type="button" aria-label="Reproducir">' +
                '<svg class="ep-icono-play" width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                    '<polygon points="4,2 14,8 4,14" fill="#0077b6"/>' +
                '</svg>' +
                '<svg class="ep-icono-pausa" width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:none">' +
                    '<rect x="3" y="2" width="4" height="12" rx="1" fill="#0077b6"/>' +
                    '<rect x="9" y="2" width="4" height="12" rx="1" fill="#0077b6"/>' +
                '</svg>' +
            '</button>' +
            '<div class="ep-progress-wrap">' +
                '<input type="range" class="ep-progress" min="0" max="100" value="0" step="0.1" aria-label="Progreso de reproducción">' +
                '<div class="ep-time"><span class="ep-time-actual">0:00</span><span class="ep-time-total">--:--</span></div>' +
            '</div>';

        wrap.insertBefore(player, audioEp);
        audioEp.style.display = 'none';

        const btnEp       = player.querySelector('.ep-play-btn');
        const iconEpPlay  = player.querySelector('.ep-icono-play');
        const iconEpPausa = player.querySelector('.ep-icono-pausa');
        const progressEp  = player.querySelector('.ep-progress');
        const tActual     = player.querySelector('.ep-time-actual');
        const tTotal      = player.querySelector('.ep-time-total');
        let arrastrandoEp = false;

        function formatoTiempo(seg) {
            if (!isFinite(seg) || isNaN(seg)) return '--:--';
            const m = Math.floor(seg / 60);
            const s = Math.floor(seg % 60).toString().padStart(2, '0');
            return m + ':' + s;
        }

        btnEp.addEventListener('click', function () {
            if (audioEp.paused) {
                if (!audioEp.src) audioEp.src = srcEp;
                audioEp.play();
            } else {
                audioEp.pause();
            }
        });

        audioEp.addEventListener('play', function () {
            iconEpPlay.style.display  = 'none';
            iconEpPausa.style.display = 'block';
        });

        audioEp.addEventListener('pause', function () {
            iconEpPlay.style.display  = 'block';
            iconEpPausa.style.display = 'none';
        });

        audioEp.addEventListener('loadedmetadata', function () {
            tTotal.textContent = formatoTiempo(audioEp.duration);
            progressEp.max = audioEp.duration || 100;
        });

        audioEp.addEventListener('timeupdate', function () {
            if (!arrastrandoEp) progressEp.value = audioEp.currentTime;
            tActual.textContent = formatoTiempo(audioEp.currentTime);
        });

        audioEp.addEventListener('ended', function () {
            progressEp.value = 0;
            tActual.textContent = '0:00';
        });

        progressEp.addEventListener('input', function () {
            arrastrandoEp = true;
            tActual.textContent = formatoTiempo(parseFloat(progressEp.value));
        });

        progressEp.addEventListener('change', function () {
            if (!audioEp.src) audioEp.src = srcEp;
            audioEp.currentTime = parseFloat(progressEp.value);
            arrastrandoEp = false;
        });
    }

    document.querySelectorAll('.ep-audio-wrap .ep-audio').forEach(armarReproductorEpisodio);

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

    if (form && btnSubmit) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const nombre    = document.getElementById('sub-nombre').value.trim();
            const email     = document.getElementById('sub-email').value.trim();
            const celular   = document.getElementById('sub-cel').value.trim();
            const direccion = document.getElementById('sub-direccion').value.trim();
            const tipoEl    = form.querySelector('input[name="sub-tipo"]:checked');
            const tipo      = tipoEl ? tipoEl.value : '';

            if (!nombre || !email || !celular || !direccion) {
                mostrarMensaje('Por favor completá todos los campos.', 'error');
                return;
            }

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

    let toques = 0;
    let temporizadorToques = null;
    const TIEMPO_MAX_ENTRE_TOQUES = 600;
    const TOQUES_NECESARIOS = 5;

    document.addEventListener('click', function (e) {
        const logoImg = e.target.closest('.navbar .logo, img.logo');
        if (!logoImg) return;

        const link = logoImg.closest('a');
        e.preventDefault();

        toques++;
        clearTimeout(temporizadorToques);

        if (toques >= TOQUES_NECESARIOS) {
            toques = 0;
            window.location.href = 'admin.html';
            return;
        }

        temporizadorToques = setTimeout(function () {
            toques = 0;
            if (link) window.location.href = link.getAttribute('href') || 'index.html';
        }, TIEMPO_MAX_ENTRE_TOQUES);
    });

    const contenedorProgramas = document.getElementById('programas-nuevos');
    if (contenedorProgramas && typeof supabase !== 'undefined') {

        const sbRadio = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        function escapeHtml(str) {
            const d = document.createElement('div');
            d.textContent = str;
            return d.innerHTML;
        }

        sbRadio
            .from('programas')
            .select('*')
            .order('fecha', { ascending: false })
            .then(function (respuesta) {
                const data = respuesta.data;
                const error = respuesta.error;
                if (error || !data || !data.length) return;

                const grupos = {};
                data.forEach(p => {
                    if (!grupos[p.mes_label]) grupos[p.mes_label] = [];
                    grupos[p.mes_label].push(p);
                });

                Object.keys(grupos).forEach(mesLabel => {
                    const acordeon = document.createElement('div');
                    acordeon.className = 'mes-acordeon abierto';
                    acordeon.innerHTML =
                        '<div class="mes-header">' +
                            '<span class="mes-nombre">' + escapeHtml(mesLabel) + '</span>' +
                            '<div class="mes-info"><span class="mes-flecha">+</span></div>' +
                        '</div>' +
                        '<div class="mes-cuerpo"><div class="mes-cuerpo-inner"><div class="ep-lista"></div></div></div>';

                    const lista = acordeon.querySelector('.ep-lista');

                    grupos[mesLabel].forEach(p => {
                        const fila = document.createElement('div');
                        fila.className = 'ep-fila';
                        fila.innerHTML =
                            '<div class="ep-izq">' +
                                '<span class="ep-num">#' + p.numero + '</span>' +
                                '<span class="ep-fecha">' + p.fecha.split('-').reverse().slice(0, 2).join('/') + '</span>' +
                                '<span class="ep-dia">' + escapeHtml(p.dia) + '</span>' +
                            '</div>' +
                            '<p class="ep-desc">' + escapeHtml(p.descripcion).replace(/\n/g, '<br>') + '</p>' +
                            '<div class="ep-audio-wrap"><audio class="ep-audio" src="' + p.audio_url + '"></audio></div>';
                        lista.appendChild(fila);
                    });

                    contenedorProgramas.appendChild(acordeon);
                });

                contenedorProgramas.querySelectorAll('.ep-audio').forEach(armarReproductorEpisodio);
            });
    }

    const revPortadaEl = document.getElementById('revista-portada');
    if (revPortadaEl && typeof supabase !== 'undefined') {

        const sbRevista = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        function escapeHtmlRevista(str) {
            const d = document.createElement('div');
            d.textContent = str;
            return d.innerHTML;
        }

        sbRevista
            .from('revistas')
            .select('*')
            .order('created_at', { ascending: false })
            .then(function (respuesta) {
                const data = respuesta.data;
                const error = respuesta.error;
                if (error || !data || !data.length) return;

                const r = data[0];
                revPortadaEl.src = r.portada_url;

                const btnEl = document.getElementById('revista-btn');
                if (btnEl) {
                    btnEl.href = r.pdf_url;
                    btnEl.textContent = 'Ver edición ' + r.temporada;
                }

                const eyebrowEl = document.getElementById('revista-eyebrow');
                if (eyebrowEl) {
                    eyebrowEl.textContent = 'Presentación La Balsa Revista #' + String(r.numero).padStart(2, '0');
                }

                const temporadaEl = document.getElementById('revista-temporada');
                if (temporadaEl) temporadaEl.textContent = r.temporada;

                const textoEl = document.getElementById('revista-texto');
                if (textoEl) textoEl.textContent = r.texto;

                const anteriores = data.slice(1);
                const seccionAnteriores = document.getElementById('edicionesAnterioresSeccion');
                const gridAnteriores = document.getElementById('edicionesAnterioresGrid');

                if (anteriores.length && seccionAnteriores && gridAnteriores) {
                    anteriores.forEach(edicion => {
                        const card = document.createElement('div');
                        card.className = 'edicion-anterior-card';
                        card.innerHTML =
                            '<img class="edicion-anterior-img" src="' + edicion.portada_url + '" alt="Revista La Balsa N°' + edicion.numero + '">' +
                            '<a class="edicion-anterior-btn" href="' + edicion.pdf_url + '" target="_blank" rel="noopener">Ver edición ' + escapeHtmlRevista(edicion.temporada) + '</a>';
                        gridAnteriores.appendChild(card);
                    });
                    seccionAnteriores.style.display = 'block';
                }
            });
    }

    const gridTripulantes = document.querySelector('.grid-tripulantes');
    if (gridTripulantes && typeof supabase !== 'undefined') {

        const sbTripulantes = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        function escapeHtmlTrip(str) {
            const d = document.createElement('div');
            d.textContent = str;
            return d.innerHTML;
        }

        sbTripulantes
            .from('tripulantes')
            .select('*')
            .order('created_at', { ascending: true })
            .then(function (respuesta) {
                const data = respuesta.data;
                const error = respuesta.error;
                if (error || !data || !data.length) return;

                data.forEach(t => {
                    const card = document.createElement('div');
                    card.className = 'card';
                    card.innerHTML =
                        '<div class="card-foto-wrap">' +
                            '<img src="' + t.foto_url + '" alt="' + escapeHtmlTrip(t.nombre) + '">' +
                        '</div>' +
                        '<div class="card-info">' +
                            '<p class="card-nombre">' + escapeHtmlTrip(t.nombre) + '</p>' +
                            '<p class="card-descripcion">' + escapeHtmlTrip(t.descripcion).replace(/\n/g, '<br>') + '</p>' +
                        '</div>' +
                        '<div class="card-linea"></div>';
                    gridTripulantes.appendChild(card);
                });
            });
    }

});