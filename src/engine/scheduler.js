// ── Scheduler — kontrollon ritmin e animacionit ──

const SPEEDS = {
    1: 1200,  // Ngadalë
    2: 500,   // Normal
    3: 80     // Shpejt
};

// Gjendja aktuale e scheduler-it
let isRunning   = false;
let isPaused    = false;
let stopRequest = false;

/**
 * Pret X milisekonda pa bllokuar browser-in
 * @param {number} ms
 * @returns {Promise}
 */
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Ekzekuton hapat e algoritmit një nga një me vonesë
 * @param {Generator}  generator - function* e algoritmit
 * @param {Function}   onStep    - thirret për çdo hap
 * @param {Function}   onFinish  - thirret kur algoritmi mbaron
 * @param {number}     speed     - 1 | 2 | 3
 */
async function run(generator, onStep, onFinish, speed = 2) {
    isRunning   = true;
    isPaused    = false;
    stopRequest = false;

    for (const step of generator) {
        // Nëse është kërkuar ndalesë — dil
        if (stopRequest) break;

        // Nëse është pauzë — prit derisa të vazhdojë
        while (isPaused && !stopRequest) {
            await wait(100);
        }

        if (stopRequest) break;

        onStep(step);
        await wait(SPEEDS[speed]);
    }

    isRunning = false;

    if (!stopRequest) {
        onFinish();
    }
}

/**
 * Ekzekuton 1 hap manualisht (butoni "Hap")
 * @param {Generator} generator
 * @param {Function}  onStep
 * @param {Function}  onFinish
 */
function stepOnce(generator, onStep, onFinish) {
    const result = generator.next();

    if (result.done) {
        onFinish();
        return;
    }

    onStep(result.value);
}

function pause()  { isPaused    = true;  }
function resume() { isPaused    = false; }
function stop()   { stopRequest = true; isRunning = false; isPaused = false; }

function getState() {
    return { isRunning, isPaused };
}

export { run, stepOnce, pause, resume, stop, getState, SPEEDS };