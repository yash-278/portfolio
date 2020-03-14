const text = document.querySelector(".title");
const strText = text.textContent;
const splitText = strText.split("");
text.textContent = "";

for (const currentLetter of splitText) {
  if (currentLetter === ",") {
    text.innerHTML += `<span class="title-anim">${currentLetter}</span><br />`;
  } else if (currentLetter === "h") {
    text.innerHTML += `<span class="title-anim">${currentLetter}</span><br />`;
  } else if (currentLetter === " ") {
    text.innerHTML += `<span class="title-anim">&nbsp;</span>`;
  } else {
    text.innerHTML += `<span class="title-anim">${currentLetter}</span>`;
  }
}

let char = 0;
let timer = setInterval(onTick, 80);

function onTick() {
  const span = text.querySelectorAll(".title-anim")[char];
  span.classList.add("rubberBand", "fade-in");
  char++;
  if (char === splitText.length) {
    complete();
    $(".title-anim").bind(
      "webkitAnimationEnd mozAnimationEnd animationEnd",
      function() {
        $(this).removeClass("rubberBand");
      }
    );
    document.querySelector(".contact-btn").classList.add("fade-in");
    document.querySelector(".Animation").classList.add("fade-in");
    document.querySelector(".social").classList.add("fade-in");
    document.querySelector(".subtitle").classList.add("fade-in");
    return;
  }
}

function complete() {
  clearInterval(timer);
  timer = null;
}

$(".title-anim").bind(
  "webkitAnimationEnd mozAnimationEnd animationEnd",
  function() {
    $(this).removeClass("rubberBand");
  }
);

$(".title-anim").hover(function() {
  $(this).addClass("rubberBand");
});
