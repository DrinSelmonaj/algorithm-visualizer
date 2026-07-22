// src/engine/scheduler.js

const SPEEDS = {
    1: 1200,
    2: 500,
    3: 80
};

let isRunning   = false;
let isPaused    = false;
let stopRequest = false;

// Guard kundër double-run — nëse po ekzekutohet, blloko
// thirrjen e re pa e ndalur të vjetrën me stop() së pari
let activeRunId = 0;

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run(generator, onStep, onFinish, speed = 2, onError = null) {
    // Nëse ka run aktiv, ndalo atë së pari
    if (isRunning) {
        stop();
        // Prit 1 tick që stop() të regjistrohet
        await wait(50);
    }

    const myRunId = ++activeRunId;

    isRunning   = true;
    isPaused    = false;
    stopRequest = false;

    let completed = false;
    try {
        for (const step of generator) {
            // Kontrollojmë ID-në — nëse ka filluar run i ri, dil
            if (stopRequest || myRunId !== activeRunId) break;

            while (isPaused && !stopRequest) {
                await wait(100);
            }

            if (stopRequest || myRunId !== activeRunId) break;

            onStep(step);
            await wait(SPEEDS[speed]);
        }
        completed = !stopRequest && myRunId === activeRunId;
    } catch (error) {
        if (myRunId === activeRunId) onError?.(error);
        else console.error('Gabim në një ekzekutim të vjetër:', error);
    } finally {
        // Çdo rrugë (edhe përjashtimi) e liron scheduler-in.
        if (myRunId === activeRunId) {
            isRunning = false;
            isPaused = false;
            if (completed) onFinish();
        }
    }
}

function stepOnce(generator, onStep, onFinish) {
    const result = generator.next();
    if (result.done) { onFinish(); return; }
    onStep(result.value);
}

function pause()  { isPaused    = true;  }
function resume() { isPaused    = false; }
function stop()   { stopRequest = true; isRunning = false; isPaused = false; }

function getState() { return { isRunning, isPaused }; }

export { run, stepOnce, pause, resume, stop, getState, SPEEDS };
