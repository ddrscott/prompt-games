(() => {
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let audioElement = document.createElement('audio');
    let analyser = audioContext.createAnalyser();
    let dataArray, bufferLength;

    document.addEventListener('DOMContentLoaded', function() {
        let params = new URLSearchParams(window.location.search);
        let audioFile = params.get('f');
        if (audioFile) {
            audioElement.src = audioFile;
            audioElement.loop = true;
        } else {
            document.querySelector('#audio-player').style.display = 'none';
        }
    });


    let track = audioContext.createMediaElementSource(audioElement);

    let splitter = audioContext.createChannelSplitter(2);
    let merger = audioContext.createChannelMerger(2);

    let gainNodeLeft = audioContext.createGain();
    let gainNodeRight = audioContext.createGain();

    track.connect(splitter);
    splitter.connect(gainNodeLeft, 0);
    splitter.connect(gainNodeRight, 1);

    gainNodeLeft.connect(merger, 0, 0);
    gainNodeRight.connect(merger, 0, 1);

    merger.connect(audioContext.destination);

    document.getElementById('channel-slider').addEventListener('input', function() {
        let value = parseFloat(this.value),
            gainLeft = 0,
            gainRight = 0;

        if (value < 0) {
            gainRight = value;
        } else if (value > 0) {
            gainLeft = -value;
        }
        gainNodeLeft.gain.value = gainLeft;
        gainNodeRight.gain.value = gainRight;
    });

    audioElement.addEventListener('timeupdate', function() {
        let value = (this.currentTime / this.duration) * 100 || 0;
        document.getElementById('progress-slider').value = value;
        document.getElementById('currentTime').textContent = formatTime(this.currentTime);
    });

    audioElement.addEventListener('loadedmetadata', function() {
    });

    document.getElementById('progress-slider').addEventListener('input', function() {
        if (audioElement.duration) {
            let seekTime = (this.value / 100) * audioElement.duration;
            audioElement.currentTime = seekTime;
        }
    });

    track.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 512;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    document.getElementById('playBtn').addEventListener('click', togglePlay);

    document.body.addEventListener('keyup', function(event) {
        if (event.code === 'Space') {
            togglePlay();
        }
    });

    function togglePlay() {
        if(audioContext.state === 'suspended') {
            audioContext.resume();
        }
        if(audioElement.paused) {
            audioElement.play();
            document.getElementById('playBtn').textContent = 'Pause';
            requestAnimationFrame(draw);
        } else {
            audioElement.pause();
            document.getElementById('playBtn').textContent = 'Play';
        }
    }

    function formatTime(seconds) {
        let minutes = Math.floor(seconds / 60);
        let secondsPart = Math.floor(seconds % 60);
        return `${minutes}:${secondsPart < 10 ? '0' : ''}${secondsPart}`;
    }

    function draw() {
        let canvas = document.getElementById('visualization');
        let ctx = canvas.getContext('2d');
        if (!audioElement.paused) {
            requestAnimationFrame(draw);
        }

        analyser.getByteTimeDomainData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.lineWidth = 2 * (window.devicePixelRatio || 1);
        ctx.strokeStyle = 'rgb(20, 20, 20)';

        ctx.beginPath();

        let sliceWidth = canvas.width * 1.0 / bufferLength;
        let x = 0;

        for(let i = 0; i < bufferLength; i++) {
            let v = dataArray[i] / 128.0;
            let y = v * canvas.height/2;

            if(i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height/2);
        ctx.stroke();
    }
})();
