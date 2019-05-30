const COLORS = {
    pink: {
        r: 250,
        g: 0,
        b: 255
    },
    yellow: {
        r: 250,
        g: 255,
        b: 0
    },
    green: {
        r: 204,
        g: 255,
        b: 0
    },
    blue: {
        r: 0,
        g: 219,
        b: 131
    },
    lightBlue: {
        r: 0,
        g: 199,
        b: 255
    }
};

window.onload = function () {

    const file = document.getElementById('file-input');
    const canvas = document.getElementById('canvas');
    const audio = document.getElementById('audio');

    const clearCanvas = (ctx) => {
        return ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    };

    const getColorBaseOnDataArray = (data) => {
        if (data > 210) {
            return COLORS.pink
        } else if (data > 200) {
            return COLORS.yellow
        } else if (data > 190) {
            return COLORS.green
        } else if (data > 180) {
            return COLORS.blue
        }
        return COLORS.lightBlue
    };

    file.onchange = function () {
        const files = this.files;
        audio.src = URL.createObjectURL(files[0]);

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext('2d');
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const context = new AudioContext();
        const src = context.createMediaElementSource(audio);
        const analyser = context.createAnalyser();

        src.connect(analyser);
        analyser.connect(context.destination);

        analyser.fftSize = 8192; // increase this value for thiner columns

        const bufferLength = analyser.frequencyBinCount;

        const dataArray = new Uint8Array(bufferLength);

        const barWidth = (canvasWidth / bufferLength) * 15;

        function renderFrame() {
            requestAnimationFrame(renderFrame);
            analyser.getByteFrequencyData(dataArray); // Results in a normalized array of values between 0 and 255

            clearCanvas(ctx);
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            const bars = Array.from({length: 120}); // Create empty array with 120 positions

            let spaceBetween = 0;
            bars.forEach((bar, i) => {
                const barHeight = (dataArray[i] * 2);

                const {r, g, b} = getColorBaseOnDataArray(dataArray[i]);

                ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.fillRect(spaceBetween, (canvasHeight - barHeight), barWidth, barHeight);

                spaceBetween += barWidth + 10 // Gives 10px space between each bar
            })
        }

        audio.play();
        renderFrame();
    };
};
