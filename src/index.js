//  ! Mobile Navbar
const btn = document.querySelector(".mobile-menu-button");
const menu = document.querySelector(".mobile-menu");
const menuBtn = document.querySelectorAll(".menu-list").forEach((item) => {
  item.addEventListener("click", (event) => {
    gsap.to(".mobile-menu", { x: 300, opacity: 0, duration: 0.5, onComplete: toggleHidden });
  });
});

const toggleHidden = () => {
  menu.classList.add("hidden");
};

btn.addEventListener("click", () => {
  if (menu.classList.contains("hidden")) {
    gsap.to(".mobile-menu", { x: 0, opacity: 1, duration: 0.5 });
    menu.classList.remove("hidden");
  } else {
    gsap.to(".mobile-menu", { x: 300, opacity: 0, duration: 0.5, onComplete: toggleHidden });
  }
});

//  ! Initial Animation

const tl = gsap.timeline({ defaults: { ease: "power1.out" } });

tl.to(".anime-text", { y: "0%", duration: 1.5, stagger: 0.25 });
tl.to(".slider", { y: "-100%", duration: 1.5, delay: 0.5 });
tl.to(".intro", { y: "-100%", duration: 1 }, "-=1.5");
tl.fromTo(".main-animation", { opacity: 0 }, { opacity: 1, duration: 1, stagger: 0.25 }, "-=1");
tl.fromTo(".navigation", { opacity: 0 }, { opacity: 1, duration: 1 }, "-=1");

// ! Scroll Animation for About
const scrollAboutTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".about-container",
    start: "center bottom",
  },
});

scrollAboutTl
  .from(".about-img", { x: 300, opacity: 0, duration: 0.5 })
  .from(".about-text", { x: -200, opacity: 0, duration: 0.75, stagger: 0.25 });

// ! Scroll Animation for Skills

const scrollSkillTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".skills",
    start: "center bottom",
  },
});

scrollSkillTl
  .from(".skill-title", { x: -100, opacity: 0, duration: 0.5 })
  .from(".skill-single", { x: 200, opacity: 0, duration: 1, stagger: 0.15 });

// ! Scroll Animation for Projects

gsap.set(".project-single", { opacity: 0 });
ScrollTrigger.batch(".project-single", {
  onEnter: (batch) => gsap.to(batch, { duration: 1, opacity: 1, stagger: 0.05 }),
  onLeave: (batch) => gsap.to(batch, { opacity: 0 }),
  onEnterBack: (batch) => gsap.to(batch, { duration: 1, opacity: 1, stagger: 0.05 }),
  onLeaveBack: (batch) => gsap.to(batch, { opacity: 0 }),
});

// ! Scroll Animation for Contact

const scrollContactTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".contact",
    start: "center bottom",
  },
});

scrollContactTl
  .from(".contact-form", { x: -100, opacity: 0, duration: 0.5 })
  .from(".contact-email", { x: 100, opacity: 0, duration: 0.5 });
