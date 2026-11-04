let steps = [];
let onSeek = null;

function initTimeline(seekHandler) {
    onSeek = seekHandler;
    const slider = document.getElementById('timeline-slider');
    slider?.addEventListener('input', () => {
        const index = Number(slider.value);
        updateLabel(index);
        onSeek?.(index, steps);
    });
}

function resetTimeline(enabled = false) {
    steps = [];
    const group = document.getElementById('timeline-control');
    const slider = document.getElementById('timeline-slider');
    if (group) group.hidden = !enabled;
    if (slider) {
        slider.min = '0';
        slider.max = '0';
        slider.value = '0';
        slider.disabled = true;
    }
    updateLabel(0);
}

function recordTimelineStep(step) {
    steps.push(step);
    const slider = document.getElementById('timeline-slider');
    if (!slider) return;
    slider.max = String(steps.length);
    slider.value = String(steps.length);
    slider.disabled = false;
    updateLabel(steps.length);
}

function updateLabel(index) {
    const label = document.getElementById('timeline-value');
    if (label) label.textContent = `${index}/${steps.length}`;
}

export { initTimeline, resetTimeline, recordTimelineStep };
