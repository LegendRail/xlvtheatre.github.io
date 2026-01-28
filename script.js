document.addEventListener('DOMContentLoaded', function() {
    
    // === 1. LOADING SCREEN LOGIC ===
    window.addEventListener('load', function() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
            document.body.classList.remove('no-scroll');
        }, 1000);
    });

    // === GLOBAL STATE ===
    let currentCity = "BANDUNG"; 
    let selectedMovieData = null;
    let activeFilter = "all";

    // === DATA CINEMA (TYPES ADDED FOR FILTER) ===
    const cinemaDatabase = {
        "BANDUNG": [
            { name: "EMPIRE XLV BANDUNG", dist: "1.8 km", types: ["XLV", "2D"] },
            { name: "CIWALK XLV", dist: "6.3 km", types: ["XLV", "Premiere", "4DX", "2D", "3D"] },
            { name: "BRAGA XLV", dist: "2.0 km", types: ["XLV", "2D"] },
            { name: "TRANS STUDIO MALL XLV", dist: "3.2 km", types: ["XLV", "4DX", "2D"] },
            { name: "D'BOTANICA XLV", dist: "6.0 km", types: ["XLV", "2D"] },
            { name: "FESTIVAL CITYLINK XLV", dist: "6.1 km", types: ["XLV", "2D"] },
            { name: "TENTH AVENUE", dist: "6.1 km", types: ["XLV", "2D"] },
            { name: "TRANSMART BUAH BATU XLV", dist: "7.2 km", types: ["XLV", "2D"] },
            { name: "UBERTOS XLV", dist: "10.1 km", types: ["XLV", "2D"] },
            { name: "SUMMARECON MALL BANDUNG XLV", dist: "13.5 km", types: ["XLV", "Premiere", "IMAX", "4DX", "2D", "3D"] },
            { name: "JATOS XLV", dist: "20.4 km", types: ["XLV", "2D"] },
            { name: "THEE MATIC MALL XLV", dist: "23.9 km", types: ["XLV", "2D"] }
        ],
        "GARUT": [
            { name: "GARUT XLV", dist: "0.50 km", types: ["XLV", "4DX", "2D"] },
            { name: "CITIMALL GARUT XLV", dist: "2.7 km", types: ["XLV", "2D"] }
        ],
        "SUBANG": [
            { name: "XLV AVENUE STUDIO", dist: "1.2 km", types: ["XLV", "Premiere", "IMAX", "2D", "3D"] },
            { name: "PLANET WATERBOOM XLV", dist: "3.5 km", types: ["XLV", "2D"] }
        ],
        "CIREBON": [
            { name: "CSB XLV", dist: "2.1 km", types: ["XLV", "Premiere", "2D"] },
            { name: "GRAGE XLV", dist: "2.8 km", types: ["XLV", "2D"] },
            { name: "RAMAYANA CIREBON XLV", dist: "8.1 km", types: ["XLV", "2D"] }
        ]
    };
    const movieTimeData = ["12:00", "13:30", "14:40", "16:15", "19:00", "21:30"];

    // === DATA FILM HERO ===
    const heroMovies = [
        { 
            title: "AVATAR: FIRE AND ASH", 
            rate: "R13+", dur: "3h 15m", 
            genre: "Action / Sci-Fi / Adventure",
            synopsis: "Jake and Neytiri's family grapples with grief, encountering a new, aggressive Na'vi tribe, the Ash People, who are led by the fiery Varang, as the conflict on Pandora escalates.",
            img: "avatarheader.jpg",
            poster: "avatar.jpeg",
            trailer: "https://geo.dailymotion.com/player.html?video=x9ynuco"
        },
        { 
            title: "FIVE NIGHTS AT FREDDY'S 2", 
            rate: "R13+", dur: "1h 44m", 
            genre: "Horror / Mystery / Thriller",
            synopsis: "One year after the supernatural nightmare at Freddy Fazbear's Pizza, Abby runs away to reconnect with her animatronic friends, uncovering dark secrets about the true origins of Freddy's.",
            img: "fnaf2header.png",
            poster: "fnaf2.jpg",
            trailer: "https://geo.dailymotion.com/player.html?video=x9ynuw8"
        },
        { 
            title: "AGAK LAEN: MENYALA PANTIKU!", 
            rate: "R13+", dur: "1h 59m", 
            genre: "Comedy / Horror",
            synopsis: "After repeatedly failing to carry out their missions, Detectives Bene, Boris, Jegel, and Oki are given one last chance to infiltrate a nursing home.",
            img: "agaklaenheader.jpg",
            poster: "agaklaen.jpg",
            trailer: "https://geo.dailymotion.com/player.html?video=x9ynv2a"
        },
        { 
            title: "ZOOTOPIA 2", 
            rate: "SU", dur: "1h 50m", 
            genre: "Animation / Adventure / Comedy",
            synopsis: "Brave rabbit cop Judy Hopps and her friend, the fox Nick Wilde, team up again to crack a new case, the most perilous and intricate of their careers.",
            img: "zootopia2header.jpg",
            poster: "zootopia2.jpg",
            trailer: "https://geo.dailymotion.com/player.html?video=x9ynv8c"
        },
        { 
            title: "CHAINSAW MAN THE MOVIE: REZE ARC", 
            rate: "D17+", dur: "1h 41m", 
            genre: "Anime / Action / Dark Fantasy",
            synopsis: "A direct sequel to the first season. Denji encounters a new romantic interest, but will his involvement place them both in danger?",
            img: "chainsawmanheader.jpg",
            poster: "chainsawman.jpg",
            trailer: "https://geo.dailymotion.com/player.html?video=x9ynw9e"
        },
        { 
            title: "TRON: ARES", 
            rate: "R13+", dur: "1h 59m", 
            genre: "Sci-Fi / Action",
            synopsis: "A highly sophisticated program, Ares, is sent from the digital world into the real world on a dangerous mission.",
            img: "tronaresheader.jpg",
            poster: "tronares.jpg",
            trailer: "https://geo.dailymotion.com/player.html?video=x9ynxfo"
        },
        { 
            title: "ELEMENTAL", 
            rate: "SU", dur: "1h 49m", 
            genre: "Animation / Adventure",
            synopsis: "Follow Ember and Wade, in a city where fire, water, earth and air live together.",
            img: "elementalheader.jpg",
            poster: "elemental.jpg",
            trailer: "https://geo.dailymotion.com/player.html?video=x9ynxkk"
        },
        { 
            title: "SORE: A WIFE FROM THE FUTURE", 
            rate: "R13+", dur: "1h 59m", 
            genre: "Drama / Romance",
            synopsis: "What would happen if your partner came from the future and wanted to change your life for the better?",
            img: "soreheader.jpg",
            poster: "sore.jpg",
            trailer: "https://geo.dailymotion.com/player.html?video=x9ynxbq"
        },
        { 
            title: "RETURN TO SILENT HILL", 
            rate: "D17+", dur: "1h 46m", 
            genre: "Horror / Mystery",
            synopsis: "When a man receives a mysterious letter from his lost love, he is drawn to Silent Hill.",
            img: "silenthillheader.jpg",
            poster: "silenthill.jpg",
            trailer: "https://geo.dailymotion.com/player.html?video=x9yny68"
        },
        { 
            title: "CORALINE (3D)", 
            rate: "SU", dur: "1h 40m", 
            genre: "Animation / Fantasy",
            synopsis: "A young girl discovers a hidden door to a strangely idealized version of her life that seems too good to be true.",
            img: "coralineheader.jpg",
            poster: "coraline.jpg",
            trailer: "https://geo.dailymotion.com/player.html?video=x9ynybk"
        }
    ];

    // === DATA FILM LENGKAP ===
    const ticketMovies = heroMovies.map(m => ({
        ...m,
        isGreen: m.rate.includes("SU"),
        isRed: m.rate.includes("D17")
    }));

    // === CLOCK ===
    function updateClock() {
        const el = document.getElementById('jakartaClock');
        if(el) el.innerText = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Jakarta' }) + " WIB";
    }
    setInterval(updateClock, 1000); updateClock();

    // === LOGIC HERO SLIDER ===
    let heroIndex = 0;
    const heroDuration = 6000;
    let heroInterval;
    let heroIsPaused = false;

    function initHeroSlider() {
        const bgContainer = document.getElementById('heroBgContainer');
        const dotsContainer = document.getElementById('heroDots');
        
        bgContainer.innerHTML = '';
        dotsContainer.innerHTML = '';
        
        heroMovies.forEach((movie, index) => {
            const bgDiv = document.createElement('div');
            bgDiv.className = 'hero-bg-slide';
            if(index === 0) bgDiv.classList.add('active');
            bgDiv.style.backgroundImage = `url('${movie.img}')`;
            bgContainer.appendChild(bgDiv);

            const dot = document.createElement('div');
            dot.className = 'dot';
            if(index === 0) dot.classList.add('active');
            dot.onclick = () => {
                if(!heroIsPaused) {
                     changeHeroSlide(index);
                     resetHeroInterval();
                }
            };
            dotsContainer.appendChild(dot);
        });

        updateHeroText(0);
        startHeroInterval();
    }

    function updateHeroText(index) {
        const movie = heroMovies[index];
        const titleEl = document.getElementById('heroTitle');
        const rateEl = document.getElementById('heroRating');
        const durEl = document.getElementById('heroDur');
        const synEl = document.getElementById('heroSynopsis');
        const genreEl = document.getElementById('heroGenre');
        const contentBox = document.getElementById('heroContentText');
        const buyBtn = document.getElementById('heroBuyBtn');
        const trailerBtn = document.getElementById('heroTrailerBtn');

        contentBox.classList.add('fade-text');
        
        setTimeout(() => {
            titleEl.innerText = movie.title;
            rateEl.innerText = movie.rate;
            durEl.innerText = movie.dur;
            synEl.innerText = movie.synopsis;
            genreEl.innerText = movie.genre || "Genre Not Available";
            
            rateEl.className = 'tag-box';
            if(movie.rate.includes('SU')) rateEl.classList.add('success');
            else if(movie.rate.includes('D17')) rateEl.classList.add('danger');
            else rateEl.classList.add('warning');

            buyBtn.onclick = () => {
                stopHeroInterval(); 
                window.openTicketModalWithMovie(movie.title);
            };
            
            trailerBtn.onclick = () => {
                stopHeroInterval(); 
                openTrailerModal(movie.trailer);
            };

            contentBox.classList.remove('fade-text');
        }, 500);
    }

    function changeHeroSlide(index) {
        const slides = document.querySelectorAll('.hero-bg-slide');
        const dots = document.querySelectorAll('.dot');
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        heroIndex = index;
        updateHeroText(index);
    }

    function startHeroInterval() {
        stopHeroInterval();
        heroIsPaused = false;
        heroInterval = setInterval(() => {
            let nextIndex = heroIndex + 1;
            if(nextIndex >= heroMovies.length) nextIndex = 0;
            changeHeroSlide(nextIndex);
        }, heroDuration);
    }

    function stopHeroInterval() {
        clearInterval(heroInterval);
        heroIsPaused = true;
    }

    function resetHeroInterval() {
        startHeroInterval();
    }
    
    initHeroSlider();

    // === TRAILER MODAL LOGIC (YOUTUBE EMBED) ===
    const trailerModal = document.getElementById('trailerModal');
    const trailerIframe = document.getElementById('trailerIframe');
    const closeTrailer = document.getElementById('closeTrailer');

    window.openTrailerModal = function(embedUrl) {
        if(!embedUrl) {
            alert("Trailer belum tersedia untuk film ini.");
            return;
        }
        const finalUrl = embedUrl.includes("?") ? `${embedUrl}&autoplay=1` : `${embedUrl}?autoplay=1`;
        
        trailerIframe.src = finalUrl;
        trailerModal.classList.add('show');
        document.getElementById('modalOverlay').classList.add('show');
        document.body.classList.add('no-scroll'); 
    };

    closeTrailer.addEventListener('click', () => {
        trailerModal.classList.remove('show');
        document.getElementById('modalOverlay').classList.remove('show');
        document.body.classList.remove('no-scroll');
        trailerIframe.src = ""; 
    });

    // === LOGIC PROMO SLIDER ===
    const promoData = [
        { img: "lebihasikxlv.png" },
        { img: "jjkxlv.png" },
        { img: "banneravatar.jpg" },
        { img: "halalxlv.png" },
        { img: "xlvcatering.png" }
    ];

    function renderPromo() {
        const track = document.getElementById('promoTrack');
        if(!track) return; track.innerHTML = '';
        const loopData = [];
        for(let i=0; i<10; i++) loopData.push(...promoData);

        loopData.forEach(p => {
            const div = document.createElement('div'); div.className = 'promo-card';
            div.innerHTML = `<img src="${p.img}" class="promo-img">`; 
            track.appendChild(div);
        });
    }
    renderPromo();

    // === NEW LOGIC: NOW PLAYING CAROUSEL 3D ===
    let carouselIndex = 0;
    const carouselTrack = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevSlideBtn');
    const nextBtn = document.getElementById('nextSlideBtn');

    function initCarousel() {
        if(!carouselTrack) return;
        carouselTrack.innerHTML = '';

        ticketMovies.forEach((m, i) => {
            const el = document.createElement('div');
            el.className = 'carousel-item';
            el.innerHTML = `<img src="${m.poster}" class="poster-img" alt="${m.title}">`;
            el.onclick = () => {
                if(i === carouselIndex) {
                    window.openTicketModalWithMovie(m.title);
                } else {
                    carouselIndex = i;
                    updateCarousel();
                }
            };
            carouselTrack.appendChild(el);
        });
        updateCarousel();
    }

    function updateCarousel() {
        const items = document.querySelectorAll('.carousel-item');
        const count = items.length;

        items.forEach((item, i) => {
            let offset = i - carouselIndex;
            if (offset > count / 2) offset -= count;
            if (offset < -count / 2) offset += count;

            let zIndex = 1; let scale = 0.6; let opacity = 0.3; let translateX = offset * 180;

            if (offset === 0) {
                zIndex = 10; scale = 1.1; opacity = 1; translateX = 0;
            } else if (Math.abs(offset) === 1) {
                zIndex = 5; scale = 0.85; opacity = 0.7; translateX = offset * 220;
            } else if (Math.abs(offset) === 2) {
                 zIndex = 2; scale = 0.7; opacity = 0.5; translateX = offset * 180; 
            } else {
                opacity = 0;
            }

            item.style.transform = `translateX(${translateX}px) scale(${scale})`;
            item.style.zIndex = zIndex;
            item.style.opacity = opacity;
            item.style.pointerEvents = opacity > 0 ? 'auto' : 'none';
        });
    }

    if(prevBtn) prevBtn.addEventListener('click', () => { carouselIndex = (carouselIndex - 1 + ticketMovies.length) % ticketMovies.length; updateCarousel(); });
    if(nextBtn) nextBtn.addEventListener('click', () => { carouselIndex = (carouselIndex + 1) % ticketMovies.length; updateCarousel(); });

    initCarousel();

    // === CINEMA MODAL LOGIC ===
    function renderCinemaList(filterText = "") {
        const container = document.getElementById('cinemaListContainer');
        const title = document.getElementById('cinemaModalTitle');
        if(!container) return;
        
        title.innerText = `XLV Cinema (${currentCity})`; 
        container.innerHTML = '';
        
        const list = cinemaDatabase[currentCity] || [];
        const filteredList = list.filter(c => c.name.toLowerCase().includes(filterText.toLowerCase()));

        if(filteredList.length === 0) {
            container.innerHTML = `<div style="padding:20px; text-align:center; color:#888;">Cinema not found in ${currentCity}</div>`;
            return;
        }

        filteredList.forEach(c => {
            const item = document.createElement('div'); item.className = 'cinema-list-item';
            
            let logosHTML = '';
            c.types.forEach(t => {
                if(t === 'XLV') logosHTML += `<img src="XLV2.png" alt="XLV" class="cinema-feature-logo">`;
                if(t === 'Premiere') logosHTML += `<img src="cinemapremiere.png" alt="Premiere" class="cinema-feature-logo">`;
                if(t === 'IMAX') logosHTML += `<img src="IMAXICONWHITE.png" alt="IMAX" class="cinema-feature-logo">`;
                if(t === '4DX') logosHTML += `<img src="4dx.png" alt="4DX" class="cinema-feature-logo">`;
            });

            item.innerHTML = `
                <div class="left-info">
                    <span class="cinema-name">${c.name} <span class="cinema-dist">(${c.dist})</span></span>
                    <div class="cinema-logos">${logosHTML}</div>
                </div>
                <i class="fa-solid fa-chevron-right right-arrow"></i>`;
            
            item.onclick = () => {
                document.getElementById('cinemaModal').classList.remove('show');
                renderTicketStep1();
                document.getElementById('ticketStep1').classList.remove('hidden');
                document.getElementById('ticketStep2').classList.add('hidden');
                document.getElementById('ticketModal').classList.add('show');
                document.body.classList.add('no-scroll');
            };

            container.appendChild(item);
        });
    }

    const cinemaSearchInput = document.getElementById('cinemaSearchInput');
    if(cinemaSearchInput) {
        cinemaSearchInput.addEventListener('input', (e) => {
            renderCinemaList(e.target.value);
        });
    }

    // === TICKET MODAL LOGIC ===
    function renderTicketStep1() {
        const container = document.getElementById('ticketMovieList'); container.innerHTML = '';
        ticketMovies.forEach(m => {
            const el = document.createElement('div'); el.className = 'movie-select-item';
            let tagClass = m.isGreen ? 'su' : (m.isRed ? 'dang' : 'warn');
            el.innerHTML = `
                <span class="ms-title">${m.title}</span>
                <div class="ms-tags"><span class="tag-pill ${tagClass}">${m.rate}</span><span class="tag-pill">${m.dur}</span></div>`;
            el.onclick = () => selectMovieForTicket(m);
            container.appendChild(el);
        });
    }

    function selectMovieForTicket(movie) {
        selectedMovieData = movie;
        document.getElementById('ticketStep1').classList.add('hidden');
        document.getElementById('ticketStep2').classList.remove('hidden');
        document.getElementById('ticketBreadcrumb').innerText = movie.title;
        
        document.getElementById('tmHeaderContainer').style.backgroundImage = `url('${movie.img}')`;
        document.getElementById('tmPoster').src = movie.poster;
        document.getElementById('tmTitle').innerText = movie.title;
        document.getElementById('tmRate').innerText = movie.rate;
        document.getElementById('tmDur').innerText = movie.dur;
        document.getElementById('tmGenre').innerText = movie.genre || "";
        document.getElementById('tmSynopsis').innerText = movie.synopsis || "No synopsis available.";
        
        const tmRate = document.getElementById('tmRate');
        tmRate.className = 'tag-box';
        if(movie.rate.includes('SU')) tmRate.classList.add('success');
        else if(movie.rate.includes('D17')) tmRate.classList.add('danger');
        else tmRate.classList.add('warning');

        document.getElementById('tmTrailerBtn').onclick = () => openTrailerModal(movie.trailer);

        renderTicketCinemaList();
    }

    // 5. FILTER LOGIC & RENDER CINEMAS (UPDATED FOR COMBINATIONS)
    function renderTicketCinemaList() {
        const container = document.getElementById('ticketCinemaList'); container.innerHTML = '';
        const list = cinemaDatabase[currentCity] || [];
        
        // --- NEW FILTER LOGIC START ---
        const filteredList = list.filter(c => {
            if (activeFilter === 'all') return true;
            
            // Cek apakah filter mengandung koma (kombinasi)
            if (activeFilter.includes(',')) {
                const requiredTypes = activeFilter.split(','); // Contoh: ["XLV", "IMAX"]
                // Cek apakah cinema punya SEMUA tipe yang diminta
                return requiredTypes.every(reqType => c.types.includes(reqType));
            } else {
                // Single filter
                return c.types.includes(activeFilter);
            }
        });
        // --- NEW FILTER LOGIC END ---

        if(filteredList.length === 0) {
            let msg = activeFilter.includes(',') ? activeFilter.replace(',', ' & ') : activeFilter;
            container.innerHTML = `<div style="padding:40px; text-align:center; color:#666;">No cinemas available for <strong>${msg}</strong> format in ${currentCity}.</div>`;
            return;
        }

        filteredList.forEach(c => {
            const wrapper = document.createElement('div'); wrapper.className = 'accordion-cinema';
            
            // Tampilan label showtime menyesuaikan filter
            let showtimeLabel = "REGULAR";
            if(activeFilter !== 'all') {
                showtimeLabel = activeFilter.includes(',') ? activeFilter.replace(',', ' & ') : activeFilter;
            }

            wrapper.innerHTML = `
                <div class="accordion-header" onclick="this.parentElement.classList.toggle('open')">
                     <div class="left-info"><span class="cinema-name" style="font-size:14px;">${c.name}</span><span class="cinema-dist">${c.dist}</span></div>
                    <i class="fa-solid fa-chevron-right right-arrow"></i>
                </div>
                <div class="time-grid-container"><span style="font-size:12px; color:#aaa; margin-top:10px; display:block;">SHOWTIMES (${showtimeLabel})</span>
                    <div class="time-grid">${movieTimeData.map(t => `<button class="time-btn">${t}</button>`).join('')}</div>
                </div>`;
            container.appendChild(wrapper);
        });
    }

    // Filter Button Event Listeners
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            activeFilter = this.getAttribute('data-filter');
            renderTicketCinemaList();
        });
    });

    window.openTicketModalWithMovie = function(title) {
        const movie = ticketMovies.find(m => m.title.trim().toLowerCase() === title.trim().toLowerCase());
        
        if (movie) {
            renderTicketStep1(); 
            document.getElementById('menuTicket').click(); 
            selectMovieForTicket(movie);
        } else {
            renderTicketStep1(); 
            document.getElementById('menuTicket').click();
        }
    };

    // === VALIDATION HELPERS ===
    function enforceNumberOnly(event, max) {
        event.target.value = event.target.value.replace(/[^0-9]/g, '');
        if (event.target.value.length > max) {
            event.target.value = event.target.value.slice(0, max);
        }
    }

    document.getElementById('registerPhone').addEventListener('input', (e) => enforceNumberOnly(e, 16));
    document.getElementById('loginPhone').addEventListener('input', (e) => enforceNumberOnly(e, 16));
    document.getElementById('loginPinInput').addEventListener('input', (e) => enforceNumberOnly(e, 6));
    
    // NEW: Register PIN input logic
    document.getElementById('registerPin').addEventListener('input', (e) => enforceNumberOnly(e, 6));

    // NEW: DOB Formatting Logic (DD/MM/YYYY)
    const dobInput = document.getElementById('registerDob');
    dobInput.addEventListener('input', function(e) {
        let v = e.target.value.replace(/\D/g, ''); // Hapus non-angka
        if (v.length > 8) v = v.slice(0, 8); // Max 8 digit (ddmmyyyy)
        
        // Add Slashes
        if (v.length > 4) {
            e.target.value = `${v.slice(0,2)}/${v.slice(2,4)}/${v.slice(4)}`;
        } else if (v.length > 2) {
            e.target.value = `${v.slice(0,2)}/${v.slice(2)}`;
        } else {
            e.target.value = v;
        }
    });

    document.getElementById('btnRegisterAction').addEventListener('click', function() {
        const email = document.getElementById('registerEmail').value;
        const phone = document.getElementById('registerPhone').value;
        const dob = document.getElementById('registerDob').value;
        const pin = document.getElementById('registerPin').value; // New PIN check

        if(!email.endsWith('@gmail.com')) { alert("Email Not Valid."); return; }
        if(phone.length < 10) { alert("Phone Number Not Valid."); return; }
        if(pin.length !== 6) { alert("PIN must be 6 digits."); return; }

        // === VALIDASI TANGGAL LAHIR KETAT ===
        if(!dob || dob.length !== 10) { alert("Date of Birth Incomplete (DD/MM/YYYY)."); return; }
        
        const parts = dob.split('/');
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);

        if(day < 1 || day > 31) { alert("Invalid Day (1-31)."); return; }
        if(month < 1 || month > 12) { alert("Invalid Month (1-12)."); return; }
        if(year > 2026) { alert("Year cannot be in the future (Max 2026)."); return; }
        if(year < 1900) { alert("Year Invalid."); return; }

        alert("Register Succesfully, you can continue!");
    });

    document.getElementById('btnLoginAction').addEventListener('click', function() {
        const pin = document.getElementById('loginPinInput').value;
        if(pin.length !== 6) { alert("PIN Must 6 number."); return; }
        alert("Login Success, Welcome Back!");
    });

    // === PROMO CODE LOGIC ===
    const promoTrigger = document.getElementById('btnPromoTrigger');
    const promoModal = document.getElementById('promoModal');
    const closePromo = document.getElementById('closePromo');
    const btnRedeem = document.getElementById('btnRedeemPromo');
    const overlay = document.getElementById('modalOverlay');

    promoTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        promoModal.classList.add('show');
        overlay.classList.add('show');
        document.body.classList.add('no-scroll');
    });
    
    closePromo.addEventListener('click', closeModal);

    btnRedeem.addEventListener('click', function() {
        const code = document.getElementById('promoCodeInput').value;
        if(code === "adminganteng") {
            alert("Selamat! Kode Promo Berhasil Digunakan!");
            closeModal();
        } else {
            alert("Kode Promo Salah atau Tidak Valid.");
        }
    });

    // === MODAL HANDLERS ===
    function closeModal() {
        const iframe = document.getElementById('trailerIframe');
        if(iframe) iframe.src = "";

        document.querySelectorAll('.glass-panel-modal, .modal-center, .cinema-modal, .ticket-modal').forEach(m => m.classList.remove('show'));
        overlay.classList.remove('show'); 
        document.body.classList.remove('no-scroll');
        
        if(heroIsPaused) resetHeroInterval();
    }
    if(overlay) overlay.addEventListener('click', closeModal);
    ['closeRegister', 'closeCinema', 'closeLocation'].forEach(id => document.getElementById(id).addEventListener('click', closeModal));
    
    document.getElementById('closeTicket').addEventListener('click', () => {
        if(!document.getElementById('ticketStep2').classList.contains('hidden')) {
            document.getElementById('ticketStep2').classList.add('hidden');
            document.getElementById('ticketStep1').classList.remove('hidden');
            document.getElementById('ticketBreadcrumb').innerText = "Tickets";
            
            activeFilter = "all";
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
        } else closeModal();
    });

    const triggers = { 'btnLoginTrigger': 'loginModal', 'btnRegisterTrigger': 'registerModal', 'menuCinema': 'cinemaModal', 'menuTicket': 'ticketModal' };
    for(const [id, modalId] of Object.entries(triggers)) {
        document.getElementById(id).addEventListener('click', (e) => {
            e.preventDefault();
            if(modalId === 'cinemaModal') {
                document.getElementById('cinemaSearchInput').value = "";
                renderCinemaList();
            }
            if(modalId === 'ticketModal') { 
                renderTicketStep1(); 
                document.getElementById('ticketStep1').classList.remove('hidden'); 
                document.getElementById('ticketStep2').classList.add('hidden'); 
                document.getElementById('ticketBreadcrumb').innerText = "Tickets"; 
            }
            document.querySelectorAll('.modal-center, .cinema-modal, .ticket-modal').forEach(m => m.classList.remove('show'));
            document.getElementById(modalId).classList.add('show'); 
            overlay.classList.add('show'); 
            document.body.classList.add('no-scroll');
        });
    }

    window.selectCity = function(city, btn) {
        currentCity = city; document.getElementById('currentCity').innerText = city;
        document.querySelectorAll('.city-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active');
        closeModal(); 
    };
    
    document.getElementById('linkToRegister').addEventListener('click', (e) => { e.preventDefault(); document.getElementById('loginModal').classList.remove('show'); setTimeout(() => document.getElementById('registerModal').classList.add('show'), 100); });
    document.getElementById('toggleLoginPin').addEventListener('click', function() {
        const input = document.getElementById('loginPinInput');
        if(input.type === 'password') { input.type = 'text'; this.classList.replace('fa-eye-slash', 'fa-eye'); } else { input.type = 'password'; this.classList.replace('fa-eye', 'fa-eye-slash'); }
    });
    document.getElementById('locationBtn').addEventListener('click', () => { document.getElementById('locationModal').classList.add('show'); overlay.classList.add('show'); document.body.classList.add('no-scroll'); });
    
    window.addEventListener('scroll', () => { 
        const nav = document.getElementById('navbar'); 
        if(window.scrollY > 50) nav.classList.add('scrolled'); 
        else nav.classList.remove('scrolled'); 
    });
});