const pages = Array.from(document.querySelectorAll('.page'));
const totalLeaves = pages.length; // jokainen .page on yksi "lehti"
const indicator = document.getElementById('scroll-indicator');

// Luodaan scroll-indikaattori sivujen määrän mukaan
pages.forEach(() => {
    const span = document.createElement('span');
    indicator.appendChild(span);
});
const indicatorSpans = Array.from(indicator.querySelectorAll('span'));

function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
}

function updatePages() {
    const doc = document.documentElement;
    const maxScroll = doc.scrollHeight - window.innerHeight;
    const rawProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    const progress = clamp(rawProgress, 0, 1);

    pages.forEach((page, index) => {
        const start = index / totalLeaves;
        const end = (index + 1) / totalLeaves;

        let local = (progress - start) / (end - start);
        local = clamp(local, 0, 1);

        const angle = -local * 180; // 0° → -180° (kääntyy oikealta vasemmalle)
        const depth = (totalLeaves - index) * 0.4; // pieni syvyys

        page.style.transform =
            'translateZ(' + depth + 'px) rotateY(' + angle + 'deg)';
        page.style.setProperty('--turn-progress', String(local));
        page.style.zIndex = String(totalLeaves - index);
    });

    // päivitä indikaattori
    const activeIndex = Math.floor(progress * totalLeaves);
    indicatorSpans.forEach((span, i) => {
        if (i === activeIndex) {
            span.classList.add('active');
        } else {
            span.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', updatePages);
window.addEventListener('resize', updatePages);
updatePages();