const ARROW_CODES = {
        37: 'left',
        38: 'up',
        39: 'right'
}
const ambientSound = new Audio('./sounds/ambient.wav');
ambientSound.loop = true;
let ambientStarted = false;

let arrows = trackKeys(ARROW_CODES);

function trackKeys(keyCodes) {
        let pressedKeys = {};
        function handler(event) {
                if (keyCodes.hasOwnProperty(event.keyCode)) {
                        let downPressed = event.type === 'keydown';
                        pressedKeys[keyCodes[event.keyCode]] = downPressed;
                        event.preventDefault();
                }
        }

        addEventListener('keydown', handler);
        addEventListener('keyup', handler);

        return pressedKeys;
}

function runAnimationFrame(frameFunction) {
        let lastTime = null;
        function frame(time) {
                let stop = false;
                if (lastTime !== null) {
                        let timeStep = Math.min(time - lastTime, 100) / 1000;
                        stop = frameFunction(timeStep) === false;
                }
                lastTime = time;
                if (!stop) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
}

function runLevel(level, Display, callback) {
      let display = new Display(document.body, level);
      runAnimationFrame(step => {
        level.animate(step, arrows);
        display.drawFrame();
        if(level.isFinished()) {
                display.clear();
                if (callback) callback(level.status);
                return false;
        }
      });
}

function runGame(levels, Display) {
        function startLevel(levelNumber) {
                let levelObject;
                try {
                        levelObject = new Level(levels[levelNumber]);
                } catch (err) {
                        return alert(err.message);
                }

                runLevel(levelObject, Display, status => {
                        if (status === 'lost') startLevel(levelNumber);
                        else if (levelNumber < levels.length - 1) startLevel(levelNumber + 1);
                        else alert ('Has ganado!!!');
                })
        }
        startLevel(0);

}


runGame(GAME_LEVELS, DOMDisplay);
function startAmbientSound() {
        if (!ambientStarted) {
                ambientSound.play()
                    .then(() => {
                            console.log('Sonido de ambiente iniciado');
                            ambientStarted = true; // Marcar que el sonido ya se inició
                    })
                    .catch((error) => {
                            console.error('Error al iniciar el sonido de ambiente:', error);
                    });
        }
}

document.addEventListener('keydown', () => {
        startAmbientSound();
});
document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
                startAmbientSound();
        } else {
                ambientSound.pause();
        }
});
if (document.readyState === 'complete' || document.readyState === 'interactive') {
        startAmbientSound();
}