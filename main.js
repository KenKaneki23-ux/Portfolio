const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav ul");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
});

// DArk - light mode

const darkmodeButton = document.getElementById("darkmodeButton");
const body = document.body;

const enableDarkMode = () => {
    body.classList.add("dark-mode");
}

const disableDarkMode = () => {
    body.classList.remove("dark-mode");
}

darkmodeButton.addEventListener("change", () => {
    if (darkmodeButton.checked) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
});

// Multiple type

const typed = new Typed('.multiple', {
    strings:['Front-End Developer', 'Back-End Developer', 'UI-UX Designer', 'Guitarist'],
    typeSpeed:100,
    backSpeed:100,
    backDelay:1000,
    loop:true
});