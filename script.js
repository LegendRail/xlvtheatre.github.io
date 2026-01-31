document.addEventListener('DOMContentLoaded', function() {
    
    // === 1. LOADING SCREEN LOGIC (WAIT FOR WINDOW LOAD) ===
    window.addEventListener('load', function() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        
        // Memastikan animasi loading terlihat minimal 1.5 detik agar user bisa menikmati animasi "Fade In Image -> Logo -> Dots"
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
            document.body.classList.remove('no-scroll');
        }, 1500); 
    });

    // === GLOBAL STATE ===
    let currentCity = "BANDUNG"; 
    let selectedMovieData = null;
    let activeFilter = "2D"; // Default filter placeholder
    let ticketSearchQuery = "";
    let ticketTab = "now"; // 'now' or 'adv'
    let selectedDate = new Date(); // Default today

    // STATE KURSI
    let selectedSeats = new Set();
    let currentPricePerSeat = 0;

    // === DATA CINEMA ===
    const cinemaDatabase = {
        "BANDUNG": [
            { name: "EMPIRE XLV BANDUNG", dist: "1.8 km", types: ["XLV", "2D", "3D"] },
            { name: "CIWALK XLV", dist: "6.3 km", types: ["XLV", "Premiere", "4DX", "2D", "3D"] },
            { name: "BRAGA XLV", dist: "2.0 km", types: ["XLV", "2D", "3D"] },
            { name: "TRANS STUDIO MALL XLV", dist: "3.2 km", types: ["XLV", "4DX", "2D", "3D"] },
            { name: "D'BOTANICA XLV", dist: "6.0 km", types: ["XLV", "2D", "3D"] },
            { name: "FESTIVAL CITYLINK XLV", dist: "6.1 km", types: ["XLV", "2D", "3D"] },
            { name: "TENTH AVENUE", dist: "6.1 km", types: ["XLV", "2D", "3D"] },
            { name: "TRANSMART BUAH BATU XLV", dist: "7.2 km", types: ["XLV", "2D", "3D"] },
            { name: "UBERTOS XLV", dist: "10.1 km", types: ["XLV", "2D", "3D"] },
            { name: "SUMMARECON MALL BANDUNG XLV", dist: "13.5 km", types: ["XLV", "Premiere", "IMAX", "4DX", "2D", "3D"] },
            { name: "JATOS XLV", dist: "20.4 km", types: ["XLV", "2D", "3D"] },
            { name: "THEE MATIC MALL XLV", dist: "23.9 km", types: ["XLV", "2D", "3D"] }
        ],
        "GARUT": [
            { name: "GARUT XLV", dist: "0.50 km", types: ["XLV", "4DX", "2D", "3D"] },
            { name: "CITIMALL GARUT XLV", dist: "2.7 km", types: ["XLV", "2D", "3D"] }
        ],
        "SUBANG": [
            { name: "XLV AVENUE STUDIO", dist: "1.2 km", types: ["XLV", "Premiere", "IMAX", "2D", "3D"] },
            { name: "PLANET WATERBOOM XLV", dist: "3.5 km", types: ["XLV", "2D", "3D"] }
        ],
        "CIREBON": [
            { name: "CSB XLV", dist: "2.1 km", types: ["XLV", "Premiere", "2D", "3D"] },
            { name: "GRAGE XLV", dist: "2.8 km", types: ["XLV", "2D", "3D"] },
            { name: "RAMAYANA CIREBON XLV", dist: "8.1 km", types: ["XLV", "2D", "3D"] }
        ]
    };

    // === DATA FILM HERO & NOW PLAYING ===
    const heroMovies = [
        { 
            title: "AVATAR: FIRE AND ASH", 
            rate: "R13+", dur: "3h 15m", 
            genre: "Action / Sci-Fi",
            synopsis: "Jake and Neytiri's family grapples with grief, encountering a new, aggressive Na'vi tribe, the Ash People, who are led by the fiery Varang.",
            img: "avatarheader.jpg",
            poster: "avatar.jpeg",
            trailer: "https://geo.dailymotion.com/player.html?video=x9ynuco",
            formats: ["2D", "3D", "IMAX", "4DX", "Premiere"]
        },
        { 
            title: "FIVE NIGHTS AT FREDDY'S 2", 
            rate: "R13+", dur: "1h 44m", 
            genre: "Mystery / Thriller",
            synopsis: "One year after the supernatural nightmare at Freddy Fazbear's Pizza, Abby runs away to reconnect with her animatronic friends.",
            img: "fnaf2header.jpg",
            poster: "fnaf2.jpg",
            trailer: "https://geo.dailymotion.com/player.html?video=x9ynuw8",
            formats: ["2D"]
        },
        { 
            title: "AGAK LAEN: MENYALA PANTIKU!", 
            rate: "R13+", dur: "1h 59m", 
            genre: "Comedy / Horror",
            synopsis: "After repeatedly failing to carry out their missions, Detectives Bene, Boris, Jegel, and Oki are given one last chance.",
            img: "agaklaenheader.jpg",
            poster: "agaklaen.jpg",
            trailer: "https://geo.dailymotion.com/player.html?video=x9ynv2a",
            formats: ["2D", "Premiere"]
        },
        { 
            title: "ZOOTOPIA 2", 
            rate: "SU", dur: "1h 50m", 
            genre: "Animation / Adventure",
            synopsis: "Brave rabbit cop Judy Hopps and her friend, the fox Nick Wilde, team up again to crack a new case.",
            img: "zootopia2header.jpg",
            poster: "zootopia2.jpg",
            trailer: "https://geo.dailymotion.com/player.html?video=x9ynv8c",
            formats: ["2D", "3D", "IMAX", "4DX"]
        },
        { 
            title: "CHAINSAW MAN THE MOVIE: REZE ARC", 
            rate: "D17+", dur: "1h 41m", 
            genre: "Anime / Action",
            synopsis: "A direct sequel to the first season. Denji encounters a new romantic interest.",
            img: "chainsawmanheader.jpg",
            poster: "chainsawman.jpg",
            trailer: "https://geo.dailymotion.com/player.html?video=x9ynw9e",
            formats: ["2D", "IMAX"]
        },
        { 
            title: "TRON: ARES", 
            rate: "R13+", dur: "1h 59m", 
            genre: "Sci-Fi / Action",
            synopsis: "A highly sophisticated program, Ares, is sent from the digital world into the real world.",
            img: "tronaresheader.jpg",
            poster: "tronares.jpg",
            trailer: "https://geo.dailymotion.com/player.html?video=x9ynxfo",
            formats: ["2D", "3D", "IMAX", "4DX"]
        },
        { 
            title: "ELEMENTAL", 
            rate: "SU", dur: "1h 49m", 
            genre: "Animation / Adventure",
            synopsis: "Follow Ember and Wade, in a city where fire, water, earth and air live together.",
            img: "elementalheader.jpg",
            poster: "elemental.jpg",
            trailer: "https://geo.dailymotion.com/player.html?video=x9ynxkk",
            formats: ["2D", "Premiere"]
        },
        { 
            title: "SORE: A WIFE FROM THE FUTURE", 
            rate: "R13+", dur: "1h 59m", 
            genre: "Drama / Romance",
            synopsis: "What would happen if your partner came from the future and wanted to change your life for the better?",
            img: "soreheader.jpg",
            poster: "sore.jpg",
            trailer: "https://geo.dailymotion.com/player.html?video=x9ynxbq",
            formats: ["2D"]
        },
        { 
            title: "JUJUTSU KAISEN: EXECUTION", 
            rate: "R13+", dur: "1h 27m", 
            genre: "Anime / Action",
            synopsis: "A veil abruptly descends over the busy Shibuya area amid the bustling Halloween crowds, trapping countless civilians inside. In the aftermath, ten colonies across Japan are transformed into dens of curses.",
            img: "jujutsukaisenheader.jpg",
            poster: "jujutsukaisen.jpg",
            trailer: "https://geo.dailymotion.com/player.html?video=x9yxbsc",
            formats: ["2D", "IMAX", "4DX"]
        },
        { 
            title: "CORALINE (3D)", 
            rate: "SU", dur: "1h 40m", 
            genre: "Animation / Fantasy",
            synopsis: "A young girl discovers a hidden door to a strangely idealized version of her life that seems too good to be true.",
            img: "coralineheader.jpg",
            poster: "coraline.jpg",
            trailer: "https://geo.dailymotion.com/player.html?video=x9ynybk",
            formats: ["2D", "3D"]
        }
    ];

    // === DATA ADVANCE TICKET SALES (5 MOVIES) ===
    const advanceMovies = [
        { 
            title: "ESOK TANPA IBU", rate: "R13+", dur: "1h 47m", genre: "Sci-Fi / Drama",
            synopsis: "Rama, a 16-year-old teenager, experiences a tragic accident that leaves his mother in a coma. With the help of Artificial Intelligence (AI), Rama and his father try to face their new reality.",
            img: "esoktanpaibuheader.jpg", poster: "esoktanpaibu.jpg", trailer: "https://geo.dailymotion.com/player.html?video=x9yoma0", formats: ["2D", "Premiere"]
        },
        { 
            title: "PAPA ZOLA THE MOVIE", rate: "SU", dur: "1h 51m", genre: "Animation / Action",
            synopsis: "Papa Zola, a schoolteacher, and his gifted daughter Pipi go on small adventures that often escalate. Their escapades showcase their loving relationship and Pipi's intelligence, as they navigate whimsical situations together.",
            img: "papazolamovieheader.jpg", poster: "papazolamovie.jpg", trailer: "https://geo.dailymotion.com/player.html?video=x9yon0o", formats: ["2D"]
        },
        { 
            title: "5 CENTIMETERS PER SECOND (ANIMATION)", rate: "R13+", dur: "1h 03m", genre: "Anime / Romance",
            synopsis: "Told in three interconnected segments, Takaki tells the story of his life as cruel winters, cold technology, and finally, adult obligations and responsibility converge to test the delicate petals of love.",
            img: "5cpsheader.png", poster: "5cps.jpg", trailer: "https://geo.dailymotion.com/player.html?video=x9ysyqw", formats: ["2D"]
        },
        { 
            title: "MERAH PUTIH: ONE FOR ALL", rate: "SU", dur: "1h 10m", genre: "Animation / Adventure",
            synopsis: "Eight diverse kids form Tim Merah Putih to guard Indonesia's flag for Independence Day. When it goes missing, they unite on a mission to retrieve it, learning teamwork, patriotism, and the power of unity in diversity.",
            img: "mpheader.jpg", poster: "mp.jpg", trailer: "https://geo.dailymotion.com/player.html?video=x9ysyvw", formats: ["2D"]
        },
        { 
            title: "CROWS ZERO", rate: "D17+", dur: "2h 10m", genre: "Action / Crime",
            synopsis: "A transfer student attempts to take over the most violent high school in the country, whose students form factions and battle each other for power.",
            img: "crowsheader.jpg", poster: "crows.jpg", trailer: "https://geo.dailymotion.com/player.html?video=x9yszxi", formats: ["2D"]
        }
    ];

    // === DATA COMING SOON (10 MOVIES) ===
    const comingSoonMovies = [
        { title: "THE ODYSSEY", rate: "D17+", dur: "2h 40m", genre: "Action / Adventure", poster: "odyssey.jpg", img: "odysseyheader.jpg", trailer: "", synopsis: "After the Trojan War, Odysseus faces a dangerous voyage back to Ithaca, meeting creatures like the Cyclops Polyphemus, Sirens, and Circe along the way.", releaseDate: "17 July 2026" },
        { title: "SPIDER-MAN: BRAND NEW DAY", rate: "R13+", dur: "TBC", genre: "Action / Superhero", poster: "spidermanbnd.jpg", img: "spidermanbndheader.jpg", trailer: "https://geo.dailymotion.com/player.html?video=x9yx48y", synopsis: "Peter Parker tries to focus on college and leave Spider-Man behind. But when a new threat endangers his friends, he must break his promise and suit up again, teaming with an unexpected ally to protect those he loves.", releaseDate: "31 July 2026" },
        { title: "GOAT", rate: "SU", dur: "1h 40m", genre: "Animation / Sport", poster: "goat.jpg", img: "goatheader.jpg", trailer: "https://geo.dailymotion.com/player.html?video=x9yx4l0", synopsis: "A small goat with big dreams gets a once-in-a-lifetime shot to join the pros and play roarball, a high-intensity, co-ed, full-contact sport dominated by the fastest, fiercest animals in the world.", releaseDate: "13 Feb 2026" },
        { title: "MOANA", rate: "SU", dur: "TBC", genre: "Adventure / Family", poster: "moana.jpg", img: "moanaheader.jpg", trailer: "", synopsis: "Live-action adaptation of the 2016 Disney animated film Moana.", releaseDate: "10 July 2026" },
        { title: "AVENGERS: DOOMSDAY", rate: "R13+", dur: "3h 45m", genre: "Action / Superhero", poster: "doomsday.jpg", img: "doomsdayheader.jpg", trailer: "https://geo.dailymotion.com/player.html?video=x9yx3o2", synopsis: "Plot under wraps.", releaseDate: "18 December 2026" },
        { title: "STAR WARS: THE MANDALORIAN AND GROGU", rate: "R13+", dur: "TBC", genre: "Action / Sci-Fi", poster: "themandalorian.jpg", img: "themandalorianheader.jpg", trailer: "https://geo.dailymotion.com/player.html?video=x9yx5is", synopsis: "Once a lone bounty hunter, Mandalorian Din Djarin and his apprentice Grogu embark on an exciting new Star Wars adventure.", releaseDate: "22 May 2026" },
        { title: "MASTERS OF THE UNIVERSE", rate: "R13+", dur: "TBC", genre: "Sci-Fi / Superhero", poster: "mou.jpg", img: "mouheader.jpg", trailer: "https://geo.dailymotion.com/player.html?video=x9yx8tc", synopsis: "A young man on Earth discovers a fabulous secret legacy as the prince of an alien planet, and must recover a magic sword and return home to protect his kingdom.", releaseDate: "05 Jun 2026" },
        { title: "THE SUPER MARIO GALAXY MOVIE", rate: "SU", dur: "TBC", genre: "Animation / Adventure", poster: "thesupermariogalaxy.jpg", img: "thesupermariogalaxyheader.jpg", trailer: "", synopsis: "Mario ventures into space, exploring cosmic worlds and tackling galactic challenges far from the familiar Mushroom Kingdom.", releaseDate: "01 April 2026" },
        { title: "HOPPERS", rate: "SU", dur: "1h 45m", genre: "Animation / Comedy", poster: "hoppers.jpg", img: "hoppersheader.jpg", trailer: "https://geo.dailymotion.com/player.html?video=x9yxai0", synopsis: "A 19-year-old animal lover uses technology that places her consciousness into a robotic beaver to uncover mysteries within the animal world beyond her imagination.", releaseDate: "06 March 2026" },
        { title: "TOY STORY 5", rate: "SU", dur: "TBC", genre: "Animation / Adventure", poster: "toystory5.jpg", img: "toystory5header.jpg", trailer: "https://geo.dailymotion.com/player.html?video=x9yxahy", synopsis: "Woody, Buzz, Jessie and the rest of the gang's jobs are challenged when they're introduced to electronics, a new threat to playtime.", releaseDate: "19 June 2026" }
    ];

    // Helper to add formatting flags
    const processMovies = (list) => list.map(m => ({ ...m, isGreen: m.rate.includes("SU"), isRed: m.rate.includes("D17") }));
    const ticketMovies = processMovies(heroMovies);
    const ticketAdvanceMovies = processMovies(advanceMovies);
    const ticketComingSoonMovies = processMovies(comingSoonMovies);

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
        
        // ONLY SHOW HERO MOVIES (NOW PLAYING)
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

    // === TRAILER MODAL LOGIC ===
    const trailerModal = document.getElementById('trailerModal');
    const trailerIframe = document.getElementById('trailerIframe');
    const closeTrailer = document.getElementById('closeTrailer');

    window.openTrailerModal = function(embedUrl) {
        if(!embedUrl) {
            alert("Trailer still not unavailable.");
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
        if(!document.getElementById('ticketModal').classList.contains('show')) {
            document.getElementById('modalOverlay').classList.remove('show');
            document.body.classList.remove('no-scroll');
        }
        trailerIframe.src = "";
        resetHeroInterval();
    });

    // === PROMO SLIDER ===
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

    // === REUSABLE 3D CAROUSEL LOGIC ===
    class Carousel3D {
        constructor(trackId, prevBtnId, nextBtnId, moviesData, clickAction) {
            this.track = document.getElementById(trackId);
            this.prevBtn = document.getElementById(prevBtnId);
            this.nextBtn = document.getElementById(nextBtnId);
            this.movies = moviesData;
            this.clickAction = clickAction; 
            this.index = 0;
            this.init();
        }

        init() {
            if(!this.track) return;
            this.track.innerHTML = '';
            this.movies.forEach((m, i) => {
                const el = document.createElement('div');
                el.className = 'carousel-item';
                el.innerHTML = `<img src="${m.poster}" class="poster-img" alt="${m.title}">`;
                
                el.onclick = () => {
                    if(i === this.index) {
                        if(this.clickAction) {
                            this.clickAction(m);
                        } else {
                            window.openTicketModalWithMovie(m.title);
                        }
                    } else {
                        this.index = i;
                        this.update();
                    }
                };
                this.track.appendChild(el);
            });
            this.update();

            if(this.prevBtn) this.prevBtn.addEventListener('click', () => { 
                this.index = (this.index - 1 + this.movies.length) % this.movies.length; 
                this.update(); 
            });
            if(this.nextBtn) this.nextBtn.addEventListener('click', () => { 
                this.index = (this.index + 1) % this.movies.length; 
                this.update(); 
            });
        }

        update() {
            const items = this.track.querySelectorAll('.carousel-item');
            const count = items.length;

            items.forEach((item, i) => {
                let offset = i - this.index;
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
    }

    // === INITIALIZE CAROUSELS ===
    new Carousel3D('carouselTrack', 'prevSlideBtn', 'nextSlideBtn', ticketMovies, (m) => window.openTicketModalWithMovie(m.title));
    new Carousel3D('carouselTrackAdv', 'prevSlideBtnAdv', 'nextSlideBtnAdv', ticketAdvanceMovies, (m) => window.openTicketModalWithMovie(m.title));
    new Carousel3D('carouselTrackComing', 'prevSlideBtnComing', 'nextSlideBtnComing', ticketComingSoonMovies, (m) => window.openComingSoonModal(m));

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

    // === TICKET SEARCH & TAB LOGIC ===
    const movieSearchInput = document.getElementById('movieSearchInput');
    const tabNowPlaying = document.getElementById('tabNowPlaying');
    const tabAdvance = document.getElementById('tabAdvance');

    if(movieSearchInput) {
        movieSearchInput.addEventListener('input', (e) => {
            ticketSearchQuery = e.target.value;
            renderTicketStep1();
        });
    }

    if(tabNowPlaying && tabAdvance) {
        tabNowPlaying.addEventListener('click', () => {
            ticketTab = 'now';
            tabNowPlaying.classList.add('active');
            tabAdvance.classList.remove('active');
            renderTicketStep1();
        });
        tabAdvance.addEventListener('click', () => {
            ticketTab = 'adv';
            tabAdvance.classList.add('active');
            tabNowPlaying.classList.remove('active');
            renderTicketStep1();
        });
    }

    function renderTicketStep1() {
        const container = document.getElementById('ticketMovieList'); container.innerHTML = '';
        
        let moviesToRender = [];
        if(ticketTab === 'now') moviesToRender = ticketMovies;
        else moviesToRender = ticketAdvanceMovies;

        // Filter by search query
        const filtered = moviesToRender.filter(m => m.title.toLowerCase().includes(ticketSearchQuery.toLowerCase()));

        if(filtered.length === 0) {
            container.innerHTML = `<div style="padding:30px; text-align:center; color:#666;">No movies found.</div>`;
            return;
        }

        filtered.forEach(m => {
            const el = document.createElement('div'); el.className = 'movie-select-item';
            let tagClass = m.isGreen ? 'su' : (m.isRed ? 'dang' : 'warn');
            el.innerHTML = `
                <span class="ms-title">${m.title}</span>
                <div class="ms-tags"><span class="tag-pill ${tagClass}">${m.rate}</span><span class="tag-pill">${m.dur}</span></div>`;
            el.onclick = () => selectMovieForTicket(m);
            container.appendChild(el);
        });
    }

    // === GENERATE DYNAMIC DATES (7 DAYS) ===
    function generateDates() {
        const container = document.getElementById('dateSelectionContainer');
        if(!container) return;
        container.innerHTML = '';

        const today = new Date();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        for(let i=0; i<7; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            
            const dayName = i === 0 ? "TODAY" : days[d.getDay()];
            const dateNum = d.getDate();
            const monthShort = d.toLocaleString('default', { month: 'short' });

            const btn = document.createElement('div');
            btn.className = 'date-btn';
            if(i === 0) btn.classList.add('active');

            btn.innerHTML = `<span class="d-day">${dayName}</span><span class="d-num">${dateNum} ${monthShort}</span>`;
            
            btn.onclick = function() {
                document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                selectedDate = d;
                renderTicketCinemaList(); // Re-render schedules when date changes
            };
            
            container.appendChild(btn);
        }
    }

    // === GENERATE DYNAMIC SHOWTIMES ===
    function generateShowtimes(movieDurationStr) {
        let durationMinutes = 120; // Default fallback
        if(movieDurationStr) {
            const hMatch = movieDurationStr.match(/(\d+)h/);
            const mMatch = movieDurationStr.match(/(\d+)m/);
            let h = hMatch ? parseInt(hMatch[1]) : 0;
            let m = mMatch ? parseInt(mMatch[1]) : 0;
            if(h > 0 || m > 0) durationMinutes = (h * 60) + m;
        }

        let gap = Math.max(120, durationMinutes + 15); 
        let startTime = 10 * 60; // 10:00 AM
        const endTimeLimit = 22 * 60; // 10:00 PM

        let times = [];
        let currentTime = startTime;

        while(currentTime <= endTimeLimit) {
            let hh = Math.floor(currentTime / 60);
            let mm = currentTime % 60;
            let timeStr = `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;
            times.push(timeStr);
            currentTime += gap;
        }
        return times;
    }

    function selectMovieForTicket(movie) {
        selectedMovieData = movie;
        document.getElementById('ticketStep1').classList.add('hidden');
        document.getElementById('ticketStep2').classList.remove('hidden');
        document.getElementById('ticketStep3').classList.add('hidden'); // Reset Step 3
        document.getElementById('ticketBreadcrumb').innerText = movie.title;
        
        document.getElementById('ticketFilterBar').style.display = 'flex';
        document.getElementById('ticketCinemaList').style.display = 'block';
        document.getElementById('comingSoonMessage').classList.add('hidden');

        updateModalContent(movie);
        generateDates(); 

        // === FILTER BUTTONS ===
        const filterBar = document.getElementById('ticketFilterBar');
        filterBar.innerHTML = '<span class="filter-label">Filter:</span>'; 
        
        const formats = movie.formats || ["2D"];
        activeFilter = formats[0]; 

        formats.forEach(f => {
            if(f !== 'XLV') { 
                const btn = document.createElement('button');
                btn.className = 'filter-btn';
                if(f === activeFilter) btn.classList.add('active');

                if(f === 'IMAX') btn.innerHTML = `<img src="IMAXICONWHITE.png" alt="IMAX">`;
                else if (f === '4DX') btn.innerHTML = `<img src="4dx.png" alt="4DX">`;
                else if (f === 'Premiere') btn.innerHTML = `<img src="cinemapremiere.png" alt="Premiere">`;
                else btn.innerText = f;
                
                btn.setAttribute('data-filter', f);
                btn.onclick = function() {
                    setFilter(this, f);
                };
                filterBar.appendChild(btn);
            }
        });

        renderTicketCinemaList();
    }

    // === NEW FUNCTION: OPEN COMING SOON MODAL (INFO ONLY) ===
    window.openComingSoonModal = function(movie) {
        document.getElementById('menuTicket').click(); 
        document.getElementById('ticketStep1').classList.add('hidden');
        document.getElementById('ticketStep2').classList.remove('hidden');
        document.getElementById('ticketStep3').classList.add('hidden');
        document.getElementById('ticketBreadcrumb').innerText = movie.title;
        
        document.getElementById('ticketFilterBar').style.display = 'none';
        document.getElementById('ticketCinemaList').style.display = 'none';
        document.getElementById('dateSelectionContainer').innerHTML = ''; // Clear dates
        document.getElementById('comingSoonMessage').classList.remove('hidden');

        updateModalContent(movie);
    };

    function updateModalContent(movie) {
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

        const releaseEl = document.getElementById('tmRelease');
        if (movie.releaseDate) {
             releaseEl.innerText = "" + movie.releaseDate;
             releaseEl.classList.remove('hidden');
        } else {
             releaseEl.classList.add('hidden');
        }

        document.getElementById('tmTrailerBtn').onclick = () => openTrailerModal(movie.trailer);
    }

    function setFilter(btn, filter) {
        const allBtns = document.getElementById('ticketFilterBar').querySelectorAll('.filter-btn');
        allBtns.forEach(b => b.classList.remove('active'));
        
        btn.classList.add('active');
        activeFilter = filter;
        renderTicketCinemaList();
    }

    function renderTicketCinemaList() {
        const container = document.getElementById('ticketCinemaList'); container.innerHTML = '';
        const list = cinemaDatabase[currentCity] || [];
        
        const filteredList = list.filter(c => {
             return c.types.includes(activeFilter);
        });

        if(filteredList.length === 0) {
            container.innerHTML = `<div style="padding:40px; text-align:center; color:#666;">No cinemas available for <strong>${activeFilter}</strong> format in ${currentCity} for this movie.</div>`;
            return;
        }

        const dynamicTimes = generateShowtimes(selectedMovieData ? selectedMovieData.dur : "2h 00m");

        filteredList.forEach(c => {
            const wrapper = document.createElement('div'); wrapper.className = 'accordion-cinema';
            const labelShowtime = activeFilter;

            wrapper.innerHTML = `
                <div class="accordion-header" onclick="this.parentElement.classList.toggle('open')">
                     <div class="left-info"><span class="cinema-name" style="font-size:14px;">${c.name}</span><span class="cinema-dist">${c.dist}</span></div>
                    <i class="fa-solid fa-chevron-right right-arrow"></i>
                </div>
                <div class="time-grid-container">
                    <span style="font-size:12px; color:#aaa; margin-top:10px; display:block;">SHOWTIMES (${labelShowtime})</span>
                    <div class="time-grid"></div>
                </div>`;
            
            const timeGrid = wrapper.querySelector('.time-grid');
            dynamicTimes.forEach(t => {
                const timeBtn = document.createElement('button');
                timeBtn.className = 'time-btn';
                timeBtn.innerText = t;
                // PASS CINEMA NAME AND TIME
                timeBtn.onclick = function(e) {
                    e.stopPropagation(); // Mencegah accordion toggle
                    openSeatSelection(t, c.name);
                };
                timeGrid.appendChild(timeBtn);
            });

            container.appendChild(wrapper);
        });
    }

    // ==========================================
    // === STEP 3: SEAT SELECTION LOGIC ===
    // ==========================================
    
    // UPDATED: Added cinemaName parameter
    function openSeatSelection(time, cinemaName) {
        document.getElementById('ticketStep2').classList.add('hidden');
        document.getElementById('ticketStep3').classList.remove('hidden');
        document.getElementById('ticketBreadcrumb').innerText = "Select Seat";

        // Update Info Bar
        document.getElementById('seatMovieTitle').innerText = selectedMovieData.title;
        document.getElementById('seatMovieRate').innerText = selectedMovieData.rate;
        document.getElementById('seatMovieDur').innerText = selectedMovieData.dur;
        document.getElementById('seatMovieFormat').innerText = activeFilter;

        // --- NEW: Update Cinema Location and Time ---
        document.getElementById('seatCinemaName').innerText = cinemaName;
        document.getElementById('seatShowtime').innerText = time;

        // Tentukan Logo Layar & Harga Dasar
        const logoImg = document.getElementById('screenLogoImg');
        const grid = document.getElementById('seatGrid');
        
        // RESET CLASS GRID
        grid.className = 'seat-grid';

        if (activeFilter === 'IMAX') {
            logoImg.src = "IMAXICONWHITE.png";
            currentPricePerSeat = 45000;
        } else if (activeFilter === '4DX') {
            logoImg.src = "4dx.png";
            currentPricePerSeat = 80000;
        } else if (activeFilter === 'Premiere') {
            logoImg.src = "cinemapremiere.png";
            currentPricePerSeat = 120000;
            // TAMBAHKAN CLASS PREMIERE MODE
            grid.classList.add('premiere-mode');
        } else if (activeFilter === '3D') {
            logoImg.src = "XLV2.png";
            currentPricePerSeat = 35000;
        } else {
            logoImg.src = "XLV2.png"; // Default 2D/XLV
            currentPricePerSeat = 30000;
        }

        renderSeatMap();
    }

    function renderSeatMap() {
        const grid = document.getElementById('seatGrid');
        grid.innerHTML = '';
        selectedSeats.clear();
        updateBookingSummary();

        const isPremiere = activeFilter === 'Premiere';
        
        let rows, cols;
        
        if (isPremiere) {
            // Layout Premiere: 4 Baris, 4 Kolom (2 Pasang)
            rows = ['A', 'B', 'C', 'D'];
            cols = 4;
        } else {
            // Layout Standard: 10 Baris, 20 Kolom
            rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
            cols = 20;
        }

        rows.forEach(row => {
            for (let i = 1; i <= cols; i++) {
                const seatId = `${row}${i}`;
                const seatDiv = document.createElement('div');
                
                seatDiv.className = 'seat-item available';
                seatDiv.title = seatId; 

                // --- CHANGE: NO SOLD SEATS LOGIC HERE ---
                // Semua kursi tersedia (available)

                // Click Event
                seatDiv.onclick = function() {
                    // Logic SOLD check removed as all are available
                    
                    if (selectedSeats.has(seatId)) {
                        selectedSeats.delete(seatId);
                        seatDiv.classList.remove('selected');
                    } else {
                        // Max 10 seats
                        if (selectedSeats.size >= 10) {
                            alert("Max 10 seats per transaction.");
                            return;
                        }
                        selectedSeats.add(seatId);
                        seatDiv.classList.add('selected');
                    }
                    updateBookingSummary();
                };
                
                grid.appendChild(seatDiv);
            }
        });
    }

    function updateBookingSummary() {
        const count = selectedSeats.size;
        const total = count * currentPricePerSeat;
        
        document.getElementById('totalSeats').innerText = count;
        document.getElementById('totalPrice').innerText = "Rp " + total.toLocaleString('id-ID');
        
        const btnCheckout = document.getElementById('btnCheckout');
        if(count > 0) {
            btnCheckout.style.opacity = "1";
            btnCheckout.style.pointerEvents = "auto";
        } else {
            btnCheckout.style.opacity = "0.5";
            btnCheckout.style.pointerEvents = "none";
        }
    }

    document.getElementById('btnCheckout').onclick = function() {
        if(selectedSeats.size === 0) return;
        
        // Ambil data untuk alert
        const seatsArr = Array.from(selectedSeats).sort().join(', ');
        const total = document.getElementById('totalPrice').innerText;
        const cinema = document.getElementById('seatCinemaName').innerText;
        const time = document.getElementById('seatShowtime').innerText;

        // Tampilkan konfirmasi
        alert(`Booking Confirmed!\n\nMovie: ${selectedMovieData.title}\nPlace: ${cinema}\nTime: ${time}\nFormat: ${activeFilter}\nSeats: ${seatsArr}\nTotal: ${total}`);
        
        // === LOGIKA RESET SETELAH CHECKOUT ===
        selectedSeats.clear();     // 1. Kosongkan data kursi yang dipilih
        updateBookingSummary();    // 2. Reset tampilan harga jadi Rp 0 dan disable tombol checkout
        
        // Tutup modal dan kembali ke homepage
        closeModal();
    };


    // =========================================
    
    window.openTicketModalWithMovie = function(title) {
        const allMovies = [...ticketMovies, ...ticketAdvanceMovies];
        const movie = allMovies.find(m => m.title.trim().toLowerCase() === title.trim().toLowerCase());
        
        ticketSearchQuery = "";
        document.getElementById('movieSearchInput').value = "";
        
        if (movie) {
            const isNowPlaying = ticketMovies.some(m => m.title === movie.title);
            if(isNowPlaying) tabNowPlaying.click();
            else tabAdvance.click();
            
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
    document.getElementById('registerPin').addEventListener('input', (e) => enforceNumberOnly(e, 6));

    const dobInput = document.getElementById('registerDob');
    dobInput.addEventListener('input', function(e) {
        let v = e.target.value.replace(/\D/g, ''); 
        if (v.length > 8) v = v.slice(0, 8); 
        
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
        const pin = document.getElementById('registerPin').value;

        if(!email.endsWith('@gmail.com')) { alert("Email Not Valid."); return; }
        if(phone.length < 10) { alert("Phone Number Not Valid."); return; }
        if(pin.length !== 6) { alert("PIN must be 6 digits."); return; }

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
            alert("Code Successfully Redeemed!");
            closeModal();
        } else {
            alert("Incorrect Promo code, Try again.");
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
    
    // === REVISED CLOSE TICKET LOGIC ===
    document.getElementById('closeTicket').addEventListener('click', () => {
        const step3 = document.getElementById('ticketStep3');
        const step2 = document.getElementById('ticketStep2');
        
        if (!step3.classList.contains('hidden')) {
            // Jika di Step 3 (Kursi) -> Kembali ke Step 2 (Detail)
            step3.classList.add('hidden');
            step2.classList.remove('hidden');
            document.getElementById('ticketBreadcrumb').innerText = selectedMovieData.title;
        } else {
            // Jika di Step 2 atau Step 1 -> TUTUP SEMUA (Kembali ke Homepage)
            closeModal();
        }
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
                ticketSearchQuery = "";
                document.getElementById('movieSearchInput').value = "";
                ticketTab = 'now';
                tabNowPlaying.click();

                renderTicketStep1(); 
                document.getElementById('ticketStep1').classList.remove('hidden'); 
                document.getElementById('ticketStep2').classList.add('hidden'); 
                document.getElementById('ticketStep3').classList.add('hidden');
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