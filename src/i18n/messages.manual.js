// src/i18n/messages.manual.js — mesazhe me kushte brenda algoritmit (zgjedhen me t(çelës1 | çelës2)).
// Parametra me emra të qartë (jo p0…), sepse janë shkruar me dorë.
const MANUAL_SQ = {
    'm.bst.goLeft': 'Kërkojmë {v}: {v} < {c} — majtas.',
    'm.bst.goRight': 'Kërkojmë {v}: {v} > {c} — djathtas.',
    'm.ll.newNodeHead': 'node.next = head → nyja e re tregon te {h}.',
    'm.ll.newNodeEmpty': 'node.next = head → lista ishte bosh, node.next = null.',
    'm.ll.checkPair': 'Kontrollojmë çiftin {a} → {b}.',
    'm.ll.checkNode': 'Kontrollojmë nyjen {a}.',
    'm.kruskal.considerCycle': 'Shqyrtojmë {u}-{v} (peshë {w}). Cikël? Po — kapërcejmë.',
    'm.kruskal.considerNoCycle': 'Shqyrtojmë {u}-{v} (peshë {w}). Cikël? Jo — shtojmë.',
};

const MANUAL_EN = {
    'm.bst.goLeft': 'Search for {v}: {v} < {c} — left.',
    'm.bst.goRight': 'Search for {v}: {v} > {c} — right.',
    'm.ll.newNodeHead': 'node.next = head → the new node points to {h}.',
    'm.ll.newNodeEmpty': 'node.next = head → the list was empty, node.next = null.',
    'm.ll.checkPair': 'Check the pair {a} → {b}.',
    'm.ll.checkNode': 'Check node {a}.',
    'm.kruskal.considerCycle': 'Consider {u}-{v} (weight {w}). Cycle? Yes — skip it.',
    'm.kruskal.considerNoCycle': 'Consider {u}-{v} (weight {w}). Cycle? No — add it.',
};

export { MANUAL_SQ, MANUAL_EN };
