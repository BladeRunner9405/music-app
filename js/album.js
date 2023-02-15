
let container = document.querySelector(`.album`);

let search = new URLSearchParams(window.location.search);

let isPlaying = false;

let nowPlayingMusicNode = ``;
let nowPlayingImgNode = ``;
let nowPlayingBarNode = ``;
let nowPlayingtimeNode = ``;


let i = search.get(`i`);

// готово! i это нужное нам число
// Получаем нужный альбом из массива
let album = getAlbum();

// Если альбом не найден
if (!album) {
    // Показать ошибку
    renderError();
} else {
    // Вывод информации об альбоме
    renderAlbumInfo();

    // Вывод треков из альбома
    renderTracks();

    // Тут будет код для запуска звуков
    setupAudio();
}

// Ниже объяви все эти функции
function getAlbum(){
    return albums[i]
}

function renderError(){
    container.innerHTML = `ОШИБКА!!! Редирект на главную страницу через 5 секунд.`;
    setTimeout(function() {
        window.location.pathname = `index.html`;
    }, 5000);
}

function renderAlbumInfo(){
    container.innerHTML = `
    <div class="card mb-3">
        <div class="row">
            <div class="col-4">
                <img src="assets/albums/${album.img}" alt="" class="img-fluid rounded-start">
            </div>
            <div class="col-8">
                <div class="card-body">
                    <h5 class="card-title">${album.title}</h5>
                    <p class="card-text">${album.description}</p>
                    <p class="card-text"><small class="text-muted">Сборник выпущен в ${album.year} году</small></p>
                </div>
            </div>
        </div>
    </div>`;
}

function renderTracks(){
    let playlist = document.querySelector(`.playlist`);
    let tracks = album.tracks;
    for (j = 0; j < tracks.length; j++){
        let track = tracks[j];
        playlist.innerHTML += `
        <li class="track list-group-item">
            <div class=" d-flex align-items-center">
                
                <button class="btn btn-outline-light">
                    <img class="music-control" src="assets/UI/play.png" height="45px">
                </button>
                
                <div>
                    <div>${track.title}</div>
                    <div class="text-secondary">${track.author}</div>
                </div>
                <div class="time ms-auto">${track.time}</div>
                <audio class="audio" src="music/${track.src}" preload="metadata"></audio>
            </div>
            <div class="progress w-100">
                <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
            </div>
            </div>
        </li>`
    }
}

function setupAudio() {
    let trackNodes = document.querySelectorAll(`.track`); 
    for (let i = 0; i < trackNodes.length; i++) { 
        let node = trackNodes[i];   
        setMusicNode(node);
        setupButton(node);
    }
};

function playMusicNode(node){
    let audio = node.querySelector(`.audio`); 
    let state = node.querySelector(`img`);
    function playMusic(){
        audio.play();
        state.src = `assets/UI/pause.png`
        changePlayingNode(node);
        isPlaying = true;
        updateProgress(node);
    }

    if (isPlaying) {
        if (nowPlayingMusicNode != audio) {
            stopMusic();
            playMusic();
        }
        else {
            stopMusic();
        }
    // Если трек сейчас не играет...
    } else {
        playMusic();
    } 
}
    
function stopMusic(){
    nowPlayingMusicNode.pause();
    nowPlayingImgNode.src = `assets/UI/play.png`;
    isPlaying = false;
    clearPlayingNode();
}

function changePlayingNode(node){
    nowPlayingMusicNode = node.querySelector(`.audio`);
    nowPlayingImgNode = node.querySelector(`img`);
    nowPlayingBarNode = node.querySelector(`.progress-bar`);
    nowPlayingtimeNode = node.querySelector(`.time`);
}

function clearPlayingNode(){
    nowPlayingMusicNode = ``;
    nowPlayingImgNode = ``;
    nowPlayingBarNode = ``;
    nowPlayingtimeNode = ``;
}

function setMusicNode(node){
    let audio = node.querySelector(`.audio`); 
    let timeNode = node.querySelector(`.time`);
    let bar = node.querySelector(`.progress-bar`);
    audio.onloadedmetadata = function() {
        let fullTime = audio.duration;
        let minutes = `${Math.floor(fullTime / 60)}`;
        let seconds = `${Math.floor(fullTime % 60)}`;
        bar.ariaValueMax = fullTime;
        timeNode.innerHTML = `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    };
}

function setupButton(node){
    let button = node.querySelector(`.btn`);
    button.addEventListener(`click`, function () {
        playMusicNode(node);
    })
}

function updateProgress() {
    let time = nowPlayingMusicNode.currentTime;
    let fullTime = nowPlayingMusicNode.duration;

    let minutes = `${Math.floor(time / 60)}`;
    let seconds = `${Math.floor(time % 60)}`;
    nowPlayingtimeNode.innerHTML = `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    if (isPlaying) {
        nowPlayingBarNode.style.width = (time / fullTime) * 100 + `%`;
        requestAnimationFrame(updateProgress);
    }
}

