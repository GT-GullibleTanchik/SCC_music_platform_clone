// 1. База даних наших треків (Масив об'єктів)
const tracksData = [
    {
        title: "Starboy",
        artist: "The Weeknd",
        cover: "https://i.pinimg.com/1200x/7f/e7/d2/7fe7d2f30825da56a0cc6b5bf4bb32b4.jpg", // Можеш замінити на своє посилання
        url: "https://meloua.com/stream/the-weeknd-daft-punk-starboy" // Посилання на аудіофайл 1
    },
    {
        title: "Slimshady",
        artist: "Eminem",
        cover: "https://i.pinimg.com/736x/60/b8/d2/60b8d2607801c438d779ffe15967fecd.jpg", // Твоя обкладинка Емінема
        url: "https://meloua.com/stream/eminem-the-real-slim-shady"// Посилання на аудіофайл 2
    },
    {
        title: "Smells Like Teen Spirit",
        artist: "Nirvana",
        cover: "https://i.pinimg.com/736x/a0/32/e3/a032e35a3611e225ab8c365dcd9c89f7.jpg", // Твоя обкладинка Нірвани
        url: "https://meloua.com/stream/nirvana-smells-like-teen-spirit" // Посилання на аудіофайл 3
    }
];

let currentAudio = new Audio();
let isPlaying = false;
let currentTrackIndex = null;

// Знаходимо елементи нижнього плеєра
const bottomPlayBtn = document.querySelector('.btn-main-play');
const bottomCover = document.querySelector('.track-cover-mini');
const bottomTitle = document.querySelector('.current-track-details h4');
const bottomArtist = document.querySelector('.current-track-details p');
const bannerPlayBtn = document.querySelector('.btn-banner-play');
const bannerCover = document.querySelector('.banner-cover');
const bannerTitles = document.querySelector('.banner-titles');
const bannerNextBtn = document.querySelector('.btn-banner-next');
const bannerPrevBtn = document.querySelector('.btn-banner-prev');
const waveformBars = document.querySelectorAll('.waveform-bars .bar');
const bannerWaveformContainer = document.querySelector('.banner-waveform-container');
// Знаходимо абсолютно всі кнопки "Play" на картках треків
const allPlayButtons = document.querySelectorAll('.btn-play-track');
//
if (bannerPlayBtn){
    bannerPlayBtn.addEventListener('click', () => {
        const targetIndex = (currentTrackIndex === null) ? 0 : currentTrackIndex;
        playTrack(targetIndex);
    });
}

// Альтернативний і надійний спосіб: вішаємо подію прямо на кнопки
allPlayButtons.forEach((button, index) => {
    button.addEventListener('click', (event) => {
        // Зупиняємо стандартну поведінку, якщо це раптом було посилання
        event.preventDefault();
        console.log(`Натиснуто кнопку треку з індексом: ${index}`);
        playTrack(index);
    });
});

function playTrack(index) {
    const banner = document.querySelector('.current-track-banner');
    if (banner) banner.classList.add('show-banner');
    
    if (currentTrackIndex === index) {
        if (isPlaying) {
            currentAudio.pause();
            isPlaying = false;
            updatePlayButtons(false, index);
        } else {
            currentAudio.play().catch(err => console.log("Помилка відтворення:", err));
            isPlaying = true;
            updatePlayButtons(true, index);
        }
        return;
    }

    currentTrackIndex = index;
    const track = tracksData[index];

    if (!track) {
        console.log("Трек не знайдено в масиві tracksData для індексу:", index);
        return;
    }

    // ОНОВЛЮЄМО ІНТЕРФЕЙС МИТТЄВО ПРИ КЛІКУ (до запуску звуку):
    if (bottomTitle) bottomTitle.innerText = track.title;
    if (bottomArtist) bottomArtist.innerText = track.artist;
    
    if (bottomCover) {
        // Силоміць міняємо атрибут src на правильну обкладинку з масиву tracksData
        bottomCover.setAttribute('src', track.cover); 
        console.log("Змінено src нижньої обкладинки на:", track.cover);
    }
    if (bannerTitles) bannerTitles.innerText = `${track.artist} - ${track.title}`;
    if (bannerCover) bannerCover.setAttribute('src', track.cover);
    // Змінюємо джерело звуку
    currentAudio.src = track.url;
    waveformBars.forEach(bar => bar.classList.remove('active'));
    // Запускаємо аудіо
    currentAudio.play()
        .then(() => {
            isPlaying = true;
            updatePlayButtons(true, index);
        })
        .catch(err => {
            console.log("Браузер очікує повторного кліку для запуску звуку:", err);
            // Навіть якщо звук заблоковано, кнопки все одно візуально мають оновитися
            isPlaying = false;
            updatePlayButtons(false, index);
        });
}

function updatePlayButtons(playing, activeIndex) {
    // Скидаємо всі кнопки на картках
    allPlayButtons.forEach((btn) => {
        btn.innerText = "▶";
    });

    // Міняємо кнопку саме того треку, який грає
    if (allPlayButtons[activeIndex]) {
        allPlayButtons[activeIndex].innerText = playing ? "⏸" : "▶";
    }
    
    if (bottomPlayBtn) {
        bottomPlayBtn.innerText = playing ? "⏸" : "▶";
    }
    if (bannerPlayBtn) {
        bannerPlayBtn.innerText = playing ? "⏸" : "▶";
    }
}
//
if (bottomPlayBtn) {
    bottomPlayBtn.addEventListener('click', () =>{
        if (currentTrackIndex === null) {
            playTrack(0);
            return;
        }
        if (isPlaying) {
            currentAudio.pause();
            isPlaying = false;
            updatePlayButtons(false, currentTrackIndex);
        } else {
            currentAudio.play().catch(err => console.log("Помилка відтворення:", err));
            isPlaying = true;
            updatePlayButtons(true, currentTrackIndex);
        }
    });
}
//
const volumeSlider = document.querySelector('.volume-slider');
if (volumeSlider) {
    currentAudio.volume = volumeSlider.value / 100;
    volumeSlider.addEventListener('input', (event) => {
        const volumeValue = event.target.value;
        currentAudio.volume = volumeValue / 100;
        console.log(`Гучність змінено на: ${volumeValue}%`);
        
    });
}
//
const currentTimeDisplay = document.querySelector('.current-time');
const totalTimeDisplay = document.querySelector('.total-time');
const progressSlider = document.querySelector('.player-progress');
//
function formatTime(seconds){
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs <10 ? '0' : ''} ${secs}`;    
};
//
currentAudio.addEventListener('timeupdate', () => {
    if (currentAudio.duration){
        const progressPercent = (currentAudio.currentTime / currentAudio.duration) * 100;
        progressSlider.value = progressPercent;
        currentTimeDisplay.innerText = formatTime(currentAudio.currentTime);
    }
});
//
currentAudio.addEventListener('loadeddata', () => {
    totalTimeDisplay.innerText = formatTime(currentAudio.duration);
});
if(progressSlider) {
    progressSlider.addEventListener('input', (event) => {
        const clickPositionPercent = event.target.value;
        const newTime = (clickPositionPercent / 100) * currentAudio.duration;
        currentAudio.currentTime = newTime;
    });
}
//
const nextBtn = document.querySelector('.btn-next');
const prevBtn = document.querySelector('.btn-prev');
//
function playNextTrack(){
    if (currentTrackIndex === null) {
        playTrack(0);
        return;
    }
    let nextIndex = currentTrackIndex + 1;
    if (nextIndex >= tracksData.length){
        nextIndex = 0;
    }
    console.log(`Автоперемикання або клік 'Вперед'. Переходимо на трек №: ${nextIndex}`);
    playTrack(nextIndex);
};

function playPrevTrack(){
    if(currentTrackIndex === null){
        playTrack(0);
        return;
    }
    let prevIndex = currentTrackIndex - 1;
    if(prevIndex < 0){
        prevIndex = tracksData.length - 1;
    }
    console.log(`Клік 'Назад'. Переходимо на трек №: ${prevIndex}`);
    playTrack(prevIndex);    
};
//
if (nextBtn){
    nextBtn.addEventListener('click', playNextTrack);
}
if (prevBtn) {
    prevBtn.addEventListener('click', playPrevTrack);
}
if (bannerNextBtn) {
    bannerNextBtn.addEventListener('click', playNextTrack);
}
if (bannerPrevBtn) {
    bannerPrevBtn.addEventListener('click', playPrevTrack);
}
//
currentAudio.addEventListener('ended', () => {
    console.log("Поточний трек закінчився. Вмикаю наступний...");
    playNextTrack();    
});
//
currentAudio.addEventListener('timeupdate', () => {
    if (currentAudio.duration) {
        const progressPercent = (currentAudio.currentTime / currentAudio.duration) * 100;

        if (progressSlider) progressSlider.value = progressPercent;
        currentTimeDisplay.innerText = formatTime(currentAudio.currentTime);
        const totalBars = waveformBars.length;
        const barsToLightUp = Math.floor((progressPercent / 100) * totalBars);

        waveformBars.forEach((bar, index) => {
            if(index < barsToLightUp) {
                bar.classList.add('active');
            } else {
                bar.classList.remove('active')
            }
        });
    }
}); 
//
if (bannerWaveformContainer) {
    bannerWaveformContainer.addEventListener('click', (event) => {
        // Якщо музика ще жодного разу не запускалася (duration немає), нічого не робимо
        if (!currentAudio.duration) return;

        // 1. Отримуємо координати самого контейнера хвилі на екрані
        const rect = bannerWaveformContainer.getBoundingClientRect();
        
        // 2. Рахуємо, на скільки пікселів від лівого краю хвилі клікнув користувач
        const clickX = event.clientX - rect.left;
        
        // 3. Ділимо цей клік на повну ширину контейнера, щоб отримати відсоток (від 0.0 до 1.0)
        const clickPercent = clickX / rect.width;

        // 4. Переводимо відсоток у секунди треку
        const newTime = clickPercent * currentAudio.duration;

        // 5. Перемотуємо аудіо на нову секунду
        currentAudio.currentTime = newTime;

        console.log(`Перемотано через хвилю банера на: ${Math.floor(clickPercent * 100)}% треку`);
    });
}
// search bar
const searchInput = document.querySelector('.search-bar-input');
if (searchInput) {
    searchInput.addEventListener('input', (event) => {
        // ВИПРАВЛЕННЯ: Оголошуємо та знаходимо картки прямо в момент введення тексту!
        const trackCards = document.querySelectorAll('.track-card');
        
        // Отримуємо текст пошуку, переводимо в нижній регістр
        const searchText = event.target.value.toLowerCase().trim();
        
        // Перебираємо кожну малу картку треку на сторінці
        trackCards.forEach((card, index) => {
            const track = tracksData[index];
            
            if (track) {
                const title = track.title.toLowerCase();
                const artist = track.artist.toLowerCase();
                
                // Перевіряємо, чи є введена літера в назві пісні АБО в імені артиста
                if (title.includes(searchText) || artist.includes(searchText)) {
                    card.style.display = "flex"; // Показуємо картку
                } else {
                    card.style.display = "none"; // Ховаємо картку
                }
            }
        });
    });
}
//SingUp SingIn
const authModal = document.getElementById('auth-modal');
const profileBtn = document.querySelector('.user-profile');
const closeModalBtn = document.querySelector('.close-modal');

// Контейнери форм
const loginFormContainer = document.getElementById('login-form-container');
const registerFormContainer = document.getElementById('register-form-container');

// Перемикачі
const switchToRegister = document.getElementById('switch-to-register');
const switchToLogin = document.getElementById('switch-to-login');

// Самі форми
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// Поточний авторизований користувач
let currentUser = localStorage.getItem('scc_current_user') || null;

// Функція для оновлення зовнішнього вигляду кнопки профілю
function updateProfileUI() {
    const profileText = document.querySelector('.profile-text');
    if (!profileText) return;

    if (currentUser) {
        // Якщо користувач увійшов
        profileText.innerText = currentUser;
        profileBtn.style.backgroundColor = "#ff5500";
        
        // Оновлюємо стилі, щоб при наведенні показувало "Вийти"
        profileBtn.classList.add('logged-in');
    } else {
        // Якщо не авторизований
        profileText.innerText = "Мій Профіль";
        profileBtn.style.backgroundColor = "#2e2e2e";
        profileBtn.classList.remove('logged-in');
    }
}

// Перевіряємо стан при завантаженні сторінки
updateProfileUI();

// ВІДКРИТТЯ І ЗАКРИТТЯ МОДАЛКИ
if (profileBtn) {
    profileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Якщо користувач вже увійшов, то клік по кнопці буде розлогінювати його (Вихід)
        if (currentUser) {
            if (confirm("Ви впевнені, що хочете вийти з акаунту?")) {
                localStorage.removeItem('scc_current_user');
                currentUser = null;
                updateProfileUI();

                if (typeof renderLibrary === "function") {
            renderLibrary(); 
                }
                alert("Ви вийшли з акаунту.");
                // Тут у майбутньому можна очистити списки лайків на екрані
            }
        } else {
            // Якщо не увійшов — відкриваємо вікно входу
            authModal.style.display = 'flex';
            loginFormContainer.classList.remove('hidden');
            registerFormContainer.classList.add('hidden');
        }
    });
}

// Закриття на хрестик
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        authModal.style.display = 'none';
    });
}

// Закриття при кліку на темну область навколо форми
window.addEventListener('click', (e) => {
    if (e.target === authModal) {
        authModal.style.display = 'none';
    }
});

// ПЕРЕМИКАННЯ МІЖ ФОРМАМИ
if (switchToRegister) {
    switchToRegister.addEventListener('click', () => {
        loginFormContainer.classList.add('hidden');
        registerFormContainer.classList.remove('hidden');
    });
}

if (switchToLogin) {
    switchToLogin.addEventListener('click', () => {
        registerFormContainer.classList.add('hidden');
        loginFormContainer.classList.remove('hidden');
    });
}

// РЕЄСТРАЦІЯ (Збереження в LocalStorage)
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value.trim();
        const password = document.getElementById('register-password').value;

        if (!username || !password) return;

        // Отримуємо існуючих користувачів або створюємо порожній масив
        let users = JSON.parse(localStorage.getItem('scc_users')) || [];

        // Перевіряємо, чи немає вже користувача з таким іменем
        const userExists = users.some(user => user.username.toLowerCase() === username.toLowerCase());

        if (userExists) {
            alert("Користувач з таким іменем вже існує!");
            return;
        }

        // Додаємо нового користувача
        users.push({ username, password });
        localStorage.setItem('scc_users', JSON.stringify(users));

        alert("Акаунт успішно створено! Тепер ви можете увійти.");
        registerForm.reset();
        
        // Перемикаємо на форму входу
        registerFormContainer.classList.add('hidden');
        loginFormContainer.classList.remove('hidden');
    });
}

// ВХІД (Перевірка пароля)
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;

        let users = JSON.parse(localStorage.getItem('scc_users')) || [];

        // Шукаємо користувача
        const foundUser = users.find(user => user.username.toLowerCase() === username.toLowerCase());

        if (foundUser && foundUser.password === password) {
            // Якщо пароль збігся
            currentUser = foundUser.username;
            localStorage.setItem('scc_current_user', currentUser);
            
            alert(`Вітаємо, ${currentUser}! Ви успішно увійшли.`);
            
            if (typeof renderLibrary === "function") {
            syncCustomPlayList();
            renderLibrary();
            }

            authModal.style.display = 'none';
            loginForm.reset();
            updateProfileUI();
        } else {
            alert("Неправильне ім'я користувача або пароль!");
        }
    });
}
//
const navHome = document.querySelector('.nav-links a:nth-child(1)');
const navLibrary = document.querySelector('.nav-links a:nth-child(2)');
const pageStream = document.getElementById('page-stream');
const pageLibrary = document.getElementById('page-library');
const likeBtn = document.querySelector('.btn-like');
const libraryBtn = document.querySelector('.btn-library');
const customPlaylistBtn = document.querySelector('.btn-custom-playlist');
//навігація між сторінками
if (navHome && navLibrary){
    navHome.addEventListener('click', (e) => {
        e.preventDefault();
         window.location.hash = 'home'; // Змінює посилання вгорі на #home
        navHome.classList.add('active');
        navLibrary.classList.remove('active');
        if (pageStream) pageStream.classList.remove('hidden');
        if (pageLibrary) pageLibrary.classList.add('hidden');
    });
    navLibrary.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = 'library'; // Змінює посилання вгорі на #library
        navLibrary.classList.add('active');
        navHome.classList.remove('active');
        if (pageLibrary) pageLibrary.classList.remove('hidden');
        if (pageStream) pageStream.classList.add('hidden');

        //перевірка синхронізації
    syncCustomPlayList();
    renderLibrary();
    });  
};
// Додатково: перевіряємо посилання при першому заході на сайт, щоб відкрити правильну вкладку
window.addEventListener('load', () => {
    if (window.location.hash === '#library') {
        navLibrary.click();
    } else {
        window.location.hash = 'home';
    }
});

function getUserData(key){
    if (!currentUser) return [];
    return JSON.parse(localStorage.getItem(`${currentUser}_${key}`)) || [];
}
function saveUserData(key, data){
    if (!currentUser) return;
    localStorage.setItem(`${currentUser}_${key}`, JSON.stringify(data));
}// алгоритм синхронізації: якщо трек видалили із улюбленних, із бібліотеки - видаляємо його із кастомного списку
function syncCustomPlayList(){
    let likes = getUserData('likes');
    let library = getUserData('library');
    let custom = getUserData('custom');
    // Фільтруємо кастомний список, залишаючи лише ті треки, які є  likes або library
    let updatedCustom = custom.filter(trackId => likes.includes(trackId) || library.includes(trackId));

    saveUserData('custom', updatedCustom);
};
//відображення бібліотеки користувача на екрані 
    function renderLibrary(){
        if(!pageLibrary) return;

    const likeListContainer = document.getElementById('likes-list');
    const libraryListContainer = document.getElementById('library-list');
    const customListContainer = document.getElementById('custom-list');
    const likes = getUserData('likes');
    const library = getUserData('library');
    const custom = getUserData('custom');

    updateBannerButtonsState();
    //рендеринг колонки з кнопками видалення 
    renderColumnWithRemove(likeListContainer, likes, "likes");
    renderColumnWithRemove(libraryListContainer, library, "library");
    renderColumnWithRemove(customListContainer, custom, "custom");
};
//функція рендерингу колонки з кнопками play та Remove
function renderColumnWithRemove(container, idsArray, listType, emptyText){
    if(!container) return;
    container.innerHTML = '';
    if(idsArray.length === 0){
        container.innerHTML = `<p class="empty-text">${emptyText || "Список порожній"}</p>`;
        return;
    }
    idsArray.forEach(id =>{
        const track = tracksData[id];
        if(!track) return;
        const trackItem = document.createElement('div');
        trackItem.className = 'lib-track-item';
        trackItem.innerHTML = `
        <div class="lib-track-info">
            <span class="lib-track-title">${track.title}</span>
            <span class="lib-track-artist">${track.artist}</span>
        </div>
        <div class="lib-track-actions">
            <button class="btn-lib-play" onclick="playTrack(${id})">▶</button>
            <button class="btn-lib-remove" onclick="removeFromList(${id}, '${listType}')" backgroundcolor="#b3b3b3">🗑</button>
        </div>
        `;
        container.appendChild(trackItem);
    });
};
//глобальна функція видалення треку із списку
window.removeFromList = function(listType, trackId){
    let list = getUserData(listType);
    list = list.filter(id => id !== trackId);
    saveUserData(listType, list);
// після видалення перевыряэмо чи треба видалити з кастомному списку
    if( listType === 'likes' || listType === 'library'){
        syncCustomPlayList();
    }
    renderLibrary();
}
//функція оновлення стану кнопок банера
function updateBannerButtonsState(){
    if(currentTrackIndex === null) return;
    const likes = getUserData('likes');
    const library = getUserData('library');
    const custom = getUserData('custom');

    if(likeBtn) {
        likeBtn.innerText = likes.includes(currentTrackIndex) ? "❤️" : "🤍";
        likeBtn.style.backgroundColor = likes.includes(currentTrackIndex) ? "#ff3b30" : "#2e2e2e";
    }
    if(libraryBtn) {
        libraryBtn.innerText = library.includes(currentTrackIndex) ? "📂" : "📂";
        libraryBtn.style.backgroundColor = library.includes(currentTrackIndex) ? "#007aff" : "#2e2e2e";
    }
    if(customPlaylistBtn) {
        customPlaylistBtn.innerText = custom.includes(currentTrackIndex) ? "🎧" : "🎧";
        customPlaylistBtn.style.backgroundColor = custom.includes(currentTrackIndex) ? "#34c759" : "#2e2e2e";
    }
}; 
//обробка кліків на банері
function handleBannerClick(listType){
    if(!currentUser) {
        alert("Будь ласка, увійдіть у свій акаунт, щоб додавати треки до списків.");
        authModal.style.display = 'flex';
        return;
    }
    if(currentTrackIndex === null) return;
    let list = getUserData(listType);
    const trackId = currentTrackIndex;
    if(list.includes(trackId)){
        // Якщо трек вже є в списку, видаляємо його
        list = list.filter(id => id !== trackId);
    } else {
        // Якщо треку немає в списку, додаємо його
        list.push(trackId);
    }
    saveUserData(listType, list);
    renderLibrary();
}; 
if(likeBtn) likeBtn.addEventListener('click', () => handleBannerClick('likes'));
if(libraryBtn) libraryBtn.addEventListener('click', () => handleBannerClick('library'));
if(customPlaylistBtn) customPlaylistBtn.addEventListener('click', () => handleBannerClick('custom'));
