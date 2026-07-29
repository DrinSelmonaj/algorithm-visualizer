// src/ui/executionLog.js
// Log Ekzekutimi — histori tekstuale e step.message, shfaqet nën panelin e
// kodit Java. Thirret nga animator.js (applyStep) për çdo hap që ka mesazh;
// pastrohet nga main.js te selectAlgorithm()/resetAlgorithm(), njësoj si
// resetStats().

const MAX_ENTRIES = 200; // kufi për të mos rritur DOM-in pafundësisht gjatë runeve të gjata

function initExecutionLog() {
    const el = document.getElementById('execution-log');
    if (!el) return;
    el.replaceChildren();
}

function appendLogEntry(message, type) {
    const el = document.getElementById('execution-log');
    if (!el || !message) return;

    const entry = document.createElement('div');
    entry.className = `log-entry log-entry--${mapTypeToClass(type)}`;
    entry.textContent = `\u203a ${message}`;
    el.appendChild(entry);

    while (el.children.length > MAX_ENTRIES) {
        el.removeChild(el.firstChild);
    }

    el.scrollTop = el.scrollHeight;
}

// Përkthen step.type në një nga ngjyrat SEMANTIKE ekzistuese (të njëjtat si
// bar-at/BST/Graph — asnjë ngjyrë e re): compare=portokalli, swap/delete=kuq,
// sorted/insert=jeshile, found=blu, pivot=vjollcë, visit/default=neutral.
function mapTypeToClass(type) {
    switch (type) {
        case 'compare':                    return 'compare';
        case 'swap':
        case 'overwrite':                  return 'swap';
        case 'sorted':                     return 'sorted';
        case 'found':                      return 'found';
        case 'pivot':                      return 'pivot';
        case 'insert':
        case 'inserting':                  return 'insert';
        case 'delete':
        case 'deleting':                   return 'delete';
        case 'visit':
        case 'current':                    return 'visit';
        default:                           return 'default';
    }
}

export { initExecutionLog, appendLogEntry };
