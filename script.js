/* K.C fafas*/

(function () {
    'use strict';

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    function onScroll() {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    //mobile menu
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('open');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('open');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });


    const revealEls = document.querySelectorAll(
        '.section-head, .plan-card, .contact-card, .coverage-text, .coverage-map, .footer-inner'
    );
    revealEls.forEach((el) => el.classList.add('reveal'));

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );
        revealEls.forEach((el) => observer.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add('visible'));
    }

    //Mapa interativo
    const mapEl = document.getElementById('coverageMap');
    if (mapEl && typeof L !== 'undefined') {
        const map = L.map('coverageMap', {
            center: [-1.05, -48.47],
            zoom: 10,
            scrollWheelZoom: false,
            zoomControl: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        
        const coverageStyle = {
            color: '#D4AF37',
            weight: 2.5,
            fillColor: '#1e3f83',
            fillOpacity: 0.35,
        };

        
        function popupHTML(name, isMain) {
            const badge = isMain ? 'Sede administrativa' : 'Atendimento';
            return `
                <div class="popup-premium">
                    <div class="popup-badge">${badge}</div>
                    <div class="popup-title">${name}</div>
                    <ul class="popup-list">
                        <li><span class="dot"></span>Cobertura disponível</li>
                        <li><span class="dot"></span>Fibra óptica</li>
                        <li><span class="dot"></span>Plano 1 Giga — <strong>R$ 149,90</strong>/mês</li>
                    </ul>
                    <a href="#contato" class="popup-cta">Ver planos</a>
                </div>
            `;
        }

        const popupOpts = { maxWidth: 280, className: 'premium-popup', minWidth: 260 };

        
        const polygons = [
            {
                name: 'Ilha de Mosqueiro',
                isMain: true, // Matriz
                ring: [
                    [-1.054, -48.426], [-1.062, -48.448], [-1.084, -48.470], [-1.108, -48.490],
                    [-1.135, -48.503], [-1.165, -48.510], [-1.198, -48.504], [-1.220, -48.490],
                    [-1.225, -48.470], [-1.218, -48.448], [-1.200, -48.430], [-1.175, -48.420],
                    [-1.150, -48.418], [-1.120, -48.420], [-1.090, -48.418], [-1.054, -48.426]
                ],
            },
            {
                name: 'Ilha de Santa Bárbara do Pará',
                isMain: false,
                ring: [
                    [-1.180, -48.500], [-1.200, -48.522], [-1.225, -48.535], [-1.250, -48.530],
                    [-1.262, -48.510], [-1.255, -48.492], [-1.235, -48.480], [-1.210, -48.482],
                    [-1.188, -48.490], [-1.180, -48.500]
                ],
            },
            {
                name: 'Ilha de Outeiro',
                isMain: false,
                ring: [
                    [-1.030, -48.460], [-1.042, -48.478], [-1.058, -48.485], [-1.075, -48.480],
                    [-1.082, -48.465], [-1.075, -48.450], [-1.058, -48.442], [-1.040, -48.448],
                    [-1.030, -48.460]
                ],
            },
        ];

        polygons.forEach((p) => {
            const layer = L.geoJSON(
                { type: 'Feature', geometry: { type: 'Polygon', coordinates: [p.ring] }, properties: {} },
                { style: coverageStyle }
            ).addTo(map);

            layer.bindPopup(popupHTML(p.name, p.isMain), popupOpts);
        });

    
        const locations = [
            { name: 'Mosqueiro',              role: 'matriz', coords: [-1.1140, -48.4720], addr: 'Av Beira Mar, nº 05 · Farol' },
            { name: 'Santa Bárbara do Pará',  role: 'sede',   coords: [-1.2239, -48.4944], addr: 'R. Carvalho Braga, nº 159 · Centro' },
            { name: 'Salvaterra',             role: 'normal', coords: [-0.7531, -48.5167], addr: 'Rua Cearense, nº 159 · Centro' },
            { name: 'Soure',                  role: 'normal', coords: [-0.7167, -48.5239], addr: 'Rua Quinta, nº 1595 · Centro' },
            { name: 'Marajó',                  role: 'normal', coords: [-1.9639, -48.1961], addr: 'Tv. Itapecuru, S/N · Alegria' },
        ];

       
        const matrizIcon = L.divIcon({
            className: 'ilhas-marker-ilhasnet',
            html: '<div class="marker-ilhasnet marker-ilhasnet--matriz"><span></span></div>',
            iconSize: [38, 38],
            iconAnchor: [19, 19],
        });

       
        const sedeIcon = L.divIcon({
            className: 'ilhas-marker-ilhasnet',
            html: '<div class="marker-ilhasnet marker-ilhasnet--featured"><span></span></div>',
            iconSize: [28, 28],
            iconAnchor: [14, 14],
        });

        // Marcador padrão
        const navyIcon = L.divIcon({
            className: 'ilhas-marker-ilhasnet',
            html: '<div class="marker-ilhasnet"><span></span></div>',
            iconSize: [22, 22],
            iconAnchor: [11, 11],
        });

        const iconByRole = { matriz: matrizIcon, sede: sedeIcon, normal: navyIcon };
        const popupTitleByRole = { matriz: 'Mosqueiro', sede: 'Santa Bárbara do Pará' };

        locations.forEach((loc) => {
            const marker = L.marker(loc.coords, { icon: iconByRole[loc.role] }).addTo(map);


            const isMain = loc.role === 'matriz';
            const popupName = popupTitleByRole[loc.role] || loc.name;

            marker.bindPopup(popupHTML(popupName, isMain), popupOpts);
        });

        // ---- Centralizar o mapa
        const allPoints = [
            ...polygons.flatMap((p) => p.ring),
            ...locations.map((l) => l.coords),
        ];
        map.fitBounds(L.latLngBounds(allPoints), { padding: [50, 50], maxZoom: 11 });

     
        map.once('click', () => { map.scrollWheelZoom.enable(); });
    }
})();
