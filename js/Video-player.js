export function videoPlayerOn() {



    let videoIsPlaying = false;

    let playerProgress = document.querySelector('#player-progress');
    let playButton = document.querySelector('#player-play-pause');
    let volume = document.querySelector('#player-volume');
    let muteButton = document.querySelector('#player-volume-mute');
    let fullScreenButton = document.querySelector('#player-fullscreen');
    let videoPlayer = document.querySelector('#video-player');
    let bigButtonPlay = document.querySelector('#video-big-play');

    let videoSpeed = document.querySelector('#video-speed');
    let speed = 1;
    videoPlayer.volume = 0.5;

    let videoPlayerContainer = document.querySelector('.video-player');


    // PLAYER WINDOW CLICKS
    videoPlayerContainer.addEventListener('click', (e) => { videoPlayerClick(e) });

    function videoPlayerClick(e) {
        //play-stop buttons
        if (e.target == playButton || e.target == videoPlayer || e.target == bigButtonPlay) {
            playPause();
        }

        //volume button
        if (e.target == muteButton) {
            if (e.target.classList.contains('muted')) {
                unmute();
            } else {
                mute();
            }
        }

        //FULLSCREEN
        if (e.target == fullScreenButton) {
            toggleFullscreen();
        }

    }


    //PROGRESSBAR
    videoPlayer.addEventListener('timeupdate', progressUpdate);
    playerProgress.addEventListener('click', (e) => { videoRewind(e) });
    document.addEventListener('touchstart', (e) => {
        if (e.target == playerProgress) {
            videoRewind(e);
        }
    });


    function progressUpdate() {
        if (videoPlayer.duration) {
            playerProgress.value = (videoPlayer.currentTime * 100) / videoPlayer.duration;
        }
        playerProgress.dispatchEvent(new Event('input'));
    }

    function videoRewind(e) {
        // debugger;
        let w = playerProgress.offsetWidth;
        let o;
        if (e.offsetX) {
            o = e.offsetX;
        } else {
            let rect = e.target.getBoundingClientRect();
            o = e.targetTouches[0].pageX - rect.left;
        }
        playerProgress.value = 100 * o / w;
        videoPlayer.pause();
        videoPlayer.currentTime = videoPlayer.duration * (o / w);
        if (videoIsPlaying) {
            videoPlayer.play();
        }
    }


    //VOLUME / MUTE
    volume.addEventListener('input', (e) => { muteToggle(e) });


    function muteToggle(e) {
        if (Number(e.target.value) !== 0) {
            videoPlayer.volume = e.target.value / 100;
            muteButton.classList.remove('muted');
        } else {
            muteButton.classList.add('muted');
        }
    }

    function mute() {
        volume.value = 0;
        videoPlayer.volume = 0;
        muteButton.classList.add('muted');
        volume.style.background = `linear-gradient(to right, #710707 0%, #710707 ${0}%, #C4C4C4 ${0}%, #C4C4C4 100%)`
    }

    function unmute() {
        volume.value = 50;
        videoPlayer.volume = 0.5;
        muteButton.classList.remove('muted');
        volume.style.background = `linear-gradient(to right, #710707 0%, #710707 ${50}%, #C4C4C4 ${50}%, #C4C4C4 100%)`
    }

    //FULLSCREEN
    function toggleFullscreen() {
        if (document.fullscreenElement == videoPlayerContainer) {
            document.exitFullscreen();
        } else {
            videoPlayerContainer.requestFullscreen();
        }
    }

    //KEYBOARD LISTENERS

    document.addEventListener('keyup', (e) => {
        if ((e.shiftKey && e.code == 'Period') || (e.shiftKey && e.code == 'Comma')) {
            videoSpeed.classList.add('hide');
        }
    })

    document.addEventListener('keydown', (e) => {

        if (e.shiftKey && e.code == 'Period') {
            speedUp();
        } else if (e.shiftKey && e.code == 'Comma') {
            speedDown();
        }

        if (e.code == 'Space') {
            e.preventDefault();
            playPause();
        }

        if (e.code == 'KeyM') {
            if (e.target.classList.contains('muted')) {
                unmute();
            } else {
                mute();
            }
        }

        if (e.code == 'KeyF') {
            toggleFullscreen();
        }

    });

    //PLAY - PAUSE

    function play() {
        playButton.classList.add('playing');
        videoPlayer.play();
        videoIsPlaying = true;
        bigButtonPlay.classList.add('hide');
    }

    function pause() {
        playButton.classList.remove('playing');
        videoPlayer.pause();
        videoIsPlaying = false;
        bigButtonPlay.classList.remove('hide');
    }

    function playPause() {
        if (videoIsPlaying) {
            pause();
        } else {
            pauseAllYouTubeVideos();
            play();
        }
    }

    //SPEED 
    function speedUp() {
        if (speed < 2) {
            speed += 0.25;
            videoPlayer.playbackRate = speed;
        }
        videoSpeed.innerHTML = speed;
        videoSpeed.classList.remove('hide');
    }

    function speedDown() {
        if (speed > 0.25) {
            speed -= 0.25;
            videoPlayer.playbackRate = speed;
        }
        videoSpeed.innerHTML = speed;
        videoSpeed.classList.remove('hide');
    }

    //ARROWS TO SWIPE NEXT OR PREV VIDEO 
    let videoNext = document.querySelector('#video-slider-next');
    let videoPrev = document.querySelector('#video-slider-prev');
    let arrVideoPagination = document.querySelectorAll('.video-slider-pagination');

    //listeners
    videoNext.addEventListener('click', flipVideoTimeOut);
    videoPrev.addEventListener('click', flipVideoTimeOut);
    for (let i = 0; i < arrVideoPagination.length; i++) {
        arrVideoPagination[i].addEventListener('click', flipVideoTimeOut);
    }


    function flipVideoTimeOut() {
        setTimeout(() => {
            flipVideo();
        }, 0);
    }


    function flipVideo() {

        pause();
        videoPlayer.currentTime = 0;
        playerProgress.value = 0;
        playerProgress.dispatchEvent(new Event('input'));

        for (let i = 0; i < arrVideoPagination.length; i++) {

            if (arrVideoPagination[i].classList.contains('active') && arrVideoPagination[i + 1].classList.contains('active')) {
                if (!arrVideoPagination[i + 2]) {

                    videoPlayer.src = `/assets/video/video${i + 1}.mp4`;
                    videoPlayer.poster = `assets/video/poster${i + 1}.jpg`;
                    break;
                }
                if (!arrVideoPagination[i + 2].classList.contains('active')) {
                    videoPlayer.src = `/assets/video/video${i}.mp4`;
                    videoPlayer.poster = `assets/video/poster${i}.jpg`;
                    break;
                }
                videoPlayer.src = `/assets/video/video${i + 1}.mp4`;
                videoPlayer.poster = `assets/video/poster${i + 1}.jpg`;
                break;
            }
        }
    }


    //PAUSE ALL YOUTUBE VIDEOS
    let pauseAllYouTubeVideos = () => {
        var iframes = document.querySelectorAll('#video-iframe');
        Array.prototype.forEach.call(iframes, iframe => {
            iframe.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func: 'pauseVideo'
            }), '*');
        });
    }

    //commands
    // stopVideo
    // playVideo
    // pauseVideo
}


//progress 
export function progressAddListener(inputSelector) {
    let inputElement = document.querySelector(inputSelector);

    inputElement.addEventListener('input', function () {
        let value = this.value;
        this.style.background = `linear-gradient(to right, #710707 0%, #710707 ${value}%, #C4C4C4 ${value}%, #C4C4C4 100%)`
    })

}
