const toggler = document.querySelector('.toggler');
const navbarlinks = document.querySelector('.nav-links');
const navbarSearch = document.querySelector('input[type="search"]');

toggler.addEventListener('click', ()=> {
    navbarlinks.classList.toggle('active');
    // toggler.classList.toggle('toggler_small_screen');
    navbarSearch.classList.toggle('active');
});
