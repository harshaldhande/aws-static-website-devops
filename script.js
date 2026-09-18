/* =========================================================
   HARSHAL DHANDE PORTFOLIO
   INTERACTIONS
   ========================================================= */


/* =========================================================
   TYPING EFFECT
   ========================================================= */

const typingElement =
    document.getElementById("typing");


const roles = [

    "Cloud & DevOps Engineer",

    "DevSecOps Enthusiast",

    "AWS Learner",

    "Kubernetes Enthusiast",

    "Security Explorer",

    "Software Engineer"

];


let roleIndex = 0;

let charIndex = 0;

let deleting = false;


function typeEffect() {

    if (!typingElement) return;


    const role =
        roles[roleIndex];


    if (!deleting) {

        typingElement.textContent =
            role.substring(
                0,
                charIndex + 1
            );

        charIndex++;


        if (
            charIndex >=
            role.length
        ) {

            deleting = true;

            setTimeout(
                typeEffect,
                1500
            );

            return;
        }

    } else {

        typingElement.textContent =
            role.substring(
                0,
                charIndex - 1
            );

        charIndex--;


        if (charIndex <= 0) {

            charIndex = 0;

            deleting = false;

            roleIndex =
                (roleIndex + 1)
                % roles.length;

        }

    }


    setTimeout(
        typeEffect,
        deleting ? 45 : 80
    );

}


typeEffect();



/* =========================================================
   MOBILE MENU
   ========================================================= */

const menuButton =
    document.querySelector(
        ".menu-btn"
    );


const navLinks =
    document.querySelector(
        ".nav-links"
    );


if (
    menuButton &&
    navLinks
) {

    menuButton.addEventListener(
        "click",
        () => {

            navLinks.classList.toggle(
                "mobile-active"
            );


            const icon =
                menuButton.querySelector(
                    "i"
                );


            if (
                navLinks.classList.contains(
                    "mobile-active"
                )
            ) {

                icon.classList.remove(
                    "fa-bars"
                );

                icon.classList.add(
                    "fa-xmark"
                );

            } else {

                icon.classList.remove(
                    "fa-xmark"
                );

                icon.classList.add(
                    "fa-bars"
                );

            }

        }
    );

}



/* =========================================================
   CLOSE MOBILE MENU
   ========================================================= */

document
    .querySelectorAll(
        ".nav-links a"
    )
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                navLinks?.classList.remove(
                    "mobile-active"
                );


                const icon =
                    menuButton?.querySelector(
                        "i"
                    );


                if (icon) {

                    icon.classList.remove(
                        "fa-xmark"
                    );

                    icon.classList.add(
                        "fa-bars"
                    );

                }

            }
        );

    });



/* =========================================================
   ACTIVE NAVIGATION
   ========================================================= */

const sections =
    document.querySelectorAll(
        "section[id]"
    );


const navAnchors =
    document.querySelectorAll(
        ".nav-links a"
    );


function updateNavigation() {

    let current =
        "home";


    sections.forEach(section => {

        const top =
            section.offsetTop - 180;


        if (
            window.scrollY >= top
        ) {

            current =
                section.id;

        }

    });


    navAnchors.forEach(anchor => {

        anchor.classList.remove(
            "active"
        );


        if (
            anchor.getAttribute(
                "href"
            ) ===
            `#${current}`
        ) {

            anchor.classList.add(
                "active"
            );

        }

    });

}


window.addEventListener(
    "scroll",
    updateNavigation
);


updateNavigation();



/* =========================================================
   SCROLL REVEAL
   ========================================================= */

const revealElements =
    document.querySelectorAll(
        ".section, .project-card, .research-card, .secureflow, .stack-row, .timeline-item"
    );


const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(
                entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "revealed"
                        );

                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                }
            );

        },
        {
            threshold: .08
        }
    );


revealElements.forEach(
    element => {

        element.classList.add(
            "reveal"
        );

        revealObserver.observe(
            element
        );

    }
);



/* =========================================================
   CURSOR LIGHT
   ========================================================= */

const cursorLight =
    document.querySelector(
        ".cursor-light"
    );


if (
    cursorLight &&
    window.matchMedia(
        "(pointer:fine)"
    ).matches
) {

    document.addEventListener(
        "pointermove",
        event => {

            cursorLight.style.left =
                `${event.clientX}px`;

            cursorLight.style.top =
                `${event.clientY}px`;

        }
    );

}



/* =========================================================
   PROJECT CARD TILT
   ========================================================= */

if (
    window.matchMedia(
        "(pointer:fine)"
    ).matches
) {

    document
        .querySelectorAll(
            ".project-card, .research-card"
        )
        .forEach(card => {

            card.addEventListener(
                "mousemove",
                event => {

                    const rect =
                        card.getBoundingClientRect();


                    const x =
                        event.clientX -
                        rect.left;


                    const y =
                        event.clientY -
                        rect.top;


                    const rotateX =
                        (
                            (y -
                            rect.height / 2)
                            /
                            rect.height
                        ) * -2;


                    const rotateY =
                        (
                            (x -
                            rect.width / 2)
                            /
                            rect.width
                        ) * 2;


                    card.style.transform =
                        `perspective(800px)
                         rotateX(${rotateX}deg)
                         rotateY(${rotateY}deg)
                         translateY(-4px)`;

                }
            );


            card.addEventListener(
                "mouseleave",
                () => {

                    card.style.transform =
                        "";

                }
            );

        });

}



/* =========================================================
   PLACEHOLDER LINKS
   ========================================================= */

document
    .querySelectorAll(
        ".placeholder-link"
    )
    .forEach(link => {

        link.addEventListener(
            "click",
            event => {

                event.preventDefault();

            }
        );

    });



/* =========================================================
   SCROLL PROGRESS
   ========================================================= */

const progress =
    document.createElement(
        "div"
    );


progress.className =
    "scroll-progress";


document.body.appendChild(
    progress
);


progress.style.cssText = `
    position:fixed;
    top:0;
    left:0;
    height:2px;
    width:0;
    background:#7cff00;
    z-index:9999;
    pointer-events:none;
`;


window.addEventListener(
    "scroll",
    () => {

        const scrollTop =
            window.scrollY;


        const height =
            document.documentElement
                .scrollHeight -
            window.innerHeight;


        const percentage =
            height > 0
                ? (scrollTop / height) * 100
                : 0;


        progress.style.width =
            `${percentage}%`;

    }
);



/* =========================================================
   KEYBOARD SHORTCUTS
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.target.tagName ===
                "INPUT" ||
            event.target.tagName ===
                "TEXTAREA"
        ) {
            return;
        }


        const key =
            event.key.toLowerCase();


        if (key === "h") {

            document
                .getElementById("home")
                ?.scrollIntoView({
                    behavior: "smooth"
                });

        }


        if (key === "p") {

            document
                .getElementById("projects")
                ?.scrollIntoView({
                    behavior: "smooth"
                });

        }


        if (key === "c") {

            document
                .getElementById("contact")
                ?.scrollIntoView({
                    behavior: "smooth"
                });

        }

    }
);



/* =========================================================
   CONSOLE
   ========================================================= */

console.log(
    "%cHarshal Dhande",
    "color:#7cff00;font-size:22px;font-weight:bold;"
);


console.log(
    "%cCloud • DevOps • DevSecOps",
    "color:#888;font-size:13px;"
);


console.log(
    "%cBuilt with HTML • CSS • JavaScript",
    "color:#555;font-size:11px;"
);