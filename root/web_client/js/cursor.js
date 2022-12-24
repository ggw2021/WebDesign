window.addEventListener('load', function () {
    const blobCursor = (() => {
        const CURSOR = document.querySelector('#cursorBlob');
        const LINKS = document.querySelectorAll('.nav__link');
        const setCursorPos = e => {
            const { pageX: posX, pageY: posY } = e;
            CURSOR.style.top = `${posY - CURSOR.offsetHeight / 2}px`;
            CURSOR.style.left = `${posX - CURSOR.offsetWidth / 2}px`;
        };
        document.addEventListener('mousemove', setCursorPos);

        const setCursorHover = () => CURSOR.style.transform = 'scale(2.5)';
        const removeCursorHover = () => CURSOR.style.transform = '';
        LINKS.forEach(link => link.addEventListener('mouseover', setCursorHover));
        LINKS.forEach(link => link.addEventListener('mouseleave', removeCursorHover));
    })();
})