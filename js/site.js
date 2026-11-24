(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", open ? "false" : "true");
      nav.classList.toggle("is-open", !open);
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && toggle && toggle.getAttribute("aria-expanded") === "true") {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      toggle.focus();
    }
  });

  var reveals = document.querySelectorAll(".reveal");
  function showAll() {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }
  if (reduce || !("IntersectionObserver" in window)) {
    showAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var nodes = entry.target.querySelectorAll(".reveal");
        if (!nodes.length) nodes = [entry.target];
        Array.prototype.forEach.call(nodes, function (el, i) {
          el.style.transitionDelay = Math.min(i, 7) * 70 + "ms";
          el.classList.add("in");
        });
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll("[data-reveal-group]").forEach(function (group) {
      io.observe(group);
    });
    window.setTimeout(showAll, 2400);
  }

  window.pcmHandleForm = function (event) {
    event.preventDefault();
    var form = document.getElementById("demo-form");
    if (!form.checkValidity()) {
      form.reportValidity();
      return false;
    }
    form.setAttribute("hidden", "");
    var thanks = document.getElementById("form-thanks");
    if (thanks) thanks.removeAttribute("hidden");
    return false;
  };

  var shots = Array.prototype.slice.call(document.querySelectorAll(".shot"));
  var lightbox = document.getElementById("lightbox");
  if (!shots.length || !lightbox) return;

  var img = lightbox.querySelector("img");
  var count = lightbox.querySelector(".lightbox-count");
  var index = 0;
  var lastFocus = null;

  function render(next) {
    index = (next + shots.length) % shots.length;
    var apply = function () {
      img.src = shots[index].getAttribute("data-full");
      img.alt = shots[index].querySelector("img").alt;
      if (count) count.textContent = (index + 1) + " of " + shots.length;
      img.classList.remove("is-fading");
    };
    if (reduce) {
      apply();
      return;
    }
    img.classList.add("is-fading");
    window.setTimeout(apply, 180);
  }

  function open(i) {
    lastFocus = document.activeElement;
    lightbox.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    render(i);
    var closeBtn = lightbox.querySelector(".lightbox-close");
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    lightbox.setAttribute("hidden", "");
    document.body.style.overflow = "";
    img.classList.remove("is-fading");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  shots.forEach(function (shot, i) {
    shot.addEventListener("click", function () { open(i); });
  });

  lightbox.querySelector(".lightbox-close").addEventListener("click", close);
  lightbox.querySelector(".lightbox-prev").addEventListener("click", function () { render(index - 1); });
  lightbox.querySelector(".lightbox-next").addEventListener("click", function () { render(index + 1); });
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", function (e) {
    if (lightbox.hasAttribute("hidden")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") render(index + 1);
    if (e.key === "ArrowLeft") render(index - 1);
  });
})();
