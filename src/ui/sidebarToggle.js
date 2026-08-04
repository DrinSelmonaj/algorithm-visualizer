// src/ui/sidebarToggle.js
// Hamburger — hap/mbyll sidebar-in si drawer mbivendosës në ekranë të
// ngushtë (≤768px, shih styles/main.css). Në desktop butoni është i fshehur
// dhe kjo logjikë s'ka efekt (sidebar-i mbetet gjithmonë i dukshëm në grid).

function initSidebarToggle() {
    const toggle   = document.getElementById('btn-sidebar-toggle');
    const sidebar  = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (!toggle || !sidebar || !backdrop) return;

    const open = () => {
        sidebar.classList.add('sidebar--open');
        backdrop.hidden = false;
        toggle.setAttribute('aria-expanded', 'true');
    };

    const close = () => {
        sidebar.classList.remove('sidebar--open');
        backdrop.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
        if (sidebar.classList.contains('sidebar--open')) close();
        else open();
    });

    backdrop.addEventListener('click', close);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('sidebar--open')) close();
    });

    // Zgjedhja e një algoritmi mbyll drawer-in automatikisht — përdoruesi
    // s'ka nevojë ta mbyllë vetë çdo herë pas klikimit (UX mobile).
    sidebar.addEventListener('click', (e) => {
        if (e.target.closest('.algo-btn')) close();
    });
}

export { initSidebarToggle };
