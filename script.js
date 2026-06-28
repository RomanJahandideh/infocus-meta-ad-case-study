/* ============================================================================
   InFocus Film School — Graphic + Digital Design Meta Ad — Case Study Site
   Script
   ----------------------------------------------------------------------------
   Edit process step copy in PROCESS_STEPS below. Edit hotspot copy/position
   in HOTSPOTS below (x/y are percentages across the final ad — nudge them
   once the real final-ad.png is in place).
   ============================================================================ */

(function () {
  "use strict";

  if (window.history && "scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function clampNum(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }
  function pad(n) {
    return String(n).padStart(2, "0");
  }

  /* ---------------------------------------------------------------------
     Missing-image placeholders (works for any image added later too,
     since these are document-level capture listeners)
  --------------------------------------------------------------------- */
  document.addEventListener(
    "error",
    function (e) {
      var img = e.target;
      if (!img || img.tagName !== "IMG" || !img.dataset || !img.dataset.fallbackLabel) return;
      var frame = img.closest("[data-media-frame]");
      if (!frame) return;
      frame.classList.add("media-missing");
      var label = frame.querySelector(".media-placeholder-text");
      if (label) label.textContent = "Add " + img.dataset.fallbackLabel.split("/").pop() + " to /assets";
    },
    true
  );
  document.addEventListener(
    "load",
    function (e) {
      var img = e.target;
      if (!img || img.tagName !== "IMG" || !img.dataset || !img.dataset.fallbackLabel) return;
      var frame = img.closest("[data-media-frame]");
      if (frame) frame.classList.remove("media-missing");
      img.classList.add("is-visible");
    },
    true
  );

  /* ---------------------------------------------------------------------
     Header: scroll state + mobile nav toggle + active-link highlighting
  --------------------------------------------------------------------- */
  var header = document.getElementById("siteHeader");
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");

  window.addEventListener(
    "scroll",
    function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    },
    { passive: true }
  );

  navToggle.addEventListener("click", function () {
    var open = mainNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  mainNav.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      mainNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  var navLinks = document.querySelectorAll(".nav-link");
  var navSections = document.querySelectorAll("main section[id]");
  var navObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  navSections.forEach(function (s) {
    navObserver.observe(s);
  });

  /* ---------------------------------------------------------------------
     Fade-in on scroll
  --------------------------------------------------------------------- */
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ---------------------------------------------------------------------
     Hero magnifying-glass zoom lens
  --------------------------------------------------------------------- */
  (function setupZoomLens() {
    var frame = document.getElementById("zoomFrame");
    var lens = document.getElementById("zoomLens");
    var img = document.getElementById("finalAdImage");
    if (!frame || !lens || !img) return;

    var ZOOM = 2.4;
    var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    var rect = null;
    var target = { x: 0, y: 0 };
    var current = { x: 0, y: 0 };
    var rafId = null;
    var active = false;

    function updateRect() {
      rect = frame.getBoundingClientRect();
    }

    function applyFrame() {
      if (!rect) updateRect();
      var lensSize = lens.offsetWidth;
      var bgW = rect.width * ZOOM;
      var bgH = rect.height * ZOOM;
      lens.style.backgroundSize = bgW + "px " + bgH + "px";
      var bgX = -(current.x * ZOOM - lensSize / 2);
      var bgY = -(current.y * ZOOM - lensSize / 2);
      lens.style.backgroundPosition = bgX + "px " + bgY + "px";
      lens.style.transform = "translate3d(" + (current.x - lensSize / 2) + "px, " + (current.y - lensSize / 2) + "px, 0)";
    }

    function loop() {
      var ease = prefersReducedMotion ? 1 : 0.22;
      current.x += (target.x - current.x) * ease;
      current.y += (target.y - current.y) * ease;
      applyFrame();
      if (active) rafId = requestAnimationFrame(loop);
    }

    function setPoint(clientX, clientY) {
      if (!rect) updateRect();
      target.x = clampNum(clientX - rect.left, 0, rect.width);
      target.y = clampNum(clientY - rect.top, 0, rect.height);
    }

    function start(clientX, clientY) {
      if (frame.classList.contains("media-missing")) return;
      updateRect();
      setPoint(clientX, clientY);
      current.x = target.x;
      current.y = target.y;
      lens.style.backgroundImage = "url('" + (img.currentSrc || img.src) + "')";
      lens.classList.add("is-active");
      frame.classList.add("zoom-engaged");
      active = true;
      applyFrame();
      rafId = requestAnimationFrame(loop);
    }

    function stop() {
      active = false;
      if (rafId) cancelAnimationFrame(rafId);
      lens.classList.remove("is-active");
      frame.classList.remove("zoom-engaged");
    }

    if (canHover) {
      frame.addEventListener("mouseenter", function (e) {
        start(e.clientX, e.clientY);
      });
      frame.addEventListener("mousemove", function (e) {
        setPoint(e.clientX, e.clientY);
      });
      frame.addEventListener("mouseleave", stop);
    } else {
      var holdTimer = null;
      frame.addEventListener(
        "touchstart",
        function (e) {
          var t = e.touches[0];
          holdTimer = setTimeout(function () {
            start(t.clientX, t.clientY);
          }, 150);
        },
        { passive: true }
      );
      frame.addEventListener(
        "touchmove",
        function (e) {
          if (!active) return;
          e.preventDefault();
          var t = e.touches[0];
          setPoint(t.clientX, t.clientY);
        },
        { passive: false }
      );
      frame.addEventListener("touchend", function () {
        clearTimeout(holdTimer);
        stop();
      });
      frame.addEventListener("touchcancel", function () {
        clearTimeout(holdTimer);
        stop();
      });
    }

    window.addEventListener("resize", function () {
      if (active) updateRect();
    });
  })();

  /* ---------------------------------------------------------------------
     Design Process — interactive filmstrip timeline
  --------------------------------------------------------------------- */
  var PROCESS_STEPS = [
    {
      title: "Concept A — The Film Canister",
      desc: "The first concept built the whole ad around a distressed 35mm film canister, with the InFocus wordmark die-cut into the label so creative tools showed through the lettering itself. It was a strong nod to film stock, but the metaphor read more \"camera department\" than \"design studio.\"",
      changed: "Tested a vintage film-canister object as the hero visual, paired with its own headline (\"Turn ideas into bold visual communication\") and a filled red icon set.",
      connects: "Proved the idea of objects revealing tools through cut-outs — a device the final ad keeps, just on a different object."
    },
    {
      title: "Concept B — The Reel, Alone",
      desc: "The object pivoted to a film reel with its spokes opened into compartments holding real design tools — pens, markers, a paint tube, a color-swatch grid. At this stage it was tested in the leanest possible layout: object, headline, subhead, footer, nothing else.",
      changed: "Replaced the canister with the film reel and dropped every supporting layout element to judge the object on its own.",
      connects: "Locked in the reel as the hero object and the transparent, tool-filled compartments that survive into the final ad."
    },
    {
      title: "Building the Supporting Layout",
      desc: "With the reel object settled, the page needed a real layout around it. This pass stacked the headline into three lines and introduced a first benefits row — branding, industry projects, portfolio building — with a simple icon set and a thin divider line.",
      changed: "Added the first benefits-icon row and a full stacked headline treatment to the reel-alone composition.",
      connects: "Established the three-benefit structure that appears, restyled, in the submitted ad."
    },
    {
      title: "Layout Alternate — Two Columns",
      desc: "In parallel, the same reel object was tried in a two-column format — image on the left, copy stacked on the right — to see whether a side-by-side layout read better than the stacked square.",
      changed: "Tested an image-left, text-right format as an alternative to the square stacked layout.",
      connects: "Ruled out the two-column split for the hero ad itself, though the format resurfaces briefly later while the border and copy were being locked."
    },
    {
      title: "Pencil Joins the Reel",
      desc: "A mechanical pencil was introduced as a second hero object alongside the reel — drawing and layout work standing next to filmmaking. Benefits row and border were stripped back out to judge the new pairing on its own.",
      changed: "Added the pencil object for the first time, paired directly with the reel.",
      connects: "Set the two-object pairing — reel plus pencil — that defines the final ad's entire hero visual."
    },
    {
      title: "Benefits Row, Square Format",
      desc: "The reel-and-pencil pairing moved back into the square stacked-headline format, with the benefits row reinstated and the subheadline shifting toward \"build your creative future\" language.",
      changed: "Carried the new two-object pairing into the square layout and brought the benefits row back.",
      connects: "Converged the object pairing and the square layout into one composition for the first time."
    },
    {
      title: "Border & Copy Lock",
      desc: "A thin outer border frame appeared for the first time, the subheadline locked to its final wording — \"Build your creative future in graphic design\" — and the benefits icons were redrawn in an outlined style with a boxed CTA bar at the bottom.",
      changed: "Introduced the border frame, the boxed bottom bar, and the final subheadline copy.",
      connects: "These three elements — border, boxed CTA, final subhead — all carry straight through to the submitted ad."
    },
    {
      title: "Square Format, Final Copy",
      desc: "The locked copy, border, and boxed CTA were brought back into the square format alongside a cleaner pencil redesign — simplified yellow body, pink eraser cap — to match the reel's level of finish.",
      changed: "Unified the final copy and chrome (border, CTA box) with the square layout and a refined pencil model.",
      connects: "This is effectively the final ad's layout skeleton, one material pass away from done."
    },
    {
      title: "Material Alternate — Tested & Rejected",
      desc: "With the layout fully locked, the reel and pencil were rebuilt entirely from solid, toy-like wood-block cubes as an alternate material direction — same border, same copy, same CTA box, different texture.",
      changed: "Swapped the reel and pencil's material from grey technical brickwork to solid multicolor wood blocks, everything else held constant.",
      connects: "Tested side by side with the brick-and-glass version and set aside — the wood-block look felt too playful for the program's premium positioning, which is why the final ad went the other direction."
    },
    {
      title: "Final Direction",
      desc: "The submitted ad keeps the grey technical-brick construction with transparent compartments revealing real, photographed design tools, paired with the refined pencil and a scatter of loose pieces in front — the direction chosen over the wood-block alternate.",
      changed: "Confirmed the brick-and-glass material over the wood-block alternate and finished the scatter, pencil banding, and final spacing.",
      connects: "This is the submitted ad — every prior stage is visible somewhere in this final frame."
    }
  ];

  (function setupProcessTimeline() {
    var stageSection = document.getElementById("process");
    var image = document.getElementById("processImage");
    var bigNumber = document.getElementById("processBigNumber");
    var placeholderText = document.getElementById("processPlaceholderText");
    var stageLabel = document.getElementById("processStageLabel");
    var stageTag = document.getElementById("processStageTag");
    var titleEl = document.getElementById("processTitle");
    var descEl = document.getElementById("processDesc");
    var changedEl = document.getElementById("processChanged");
    var connectsEl = document.getElementById("processConnects");
    var counterCurrent = document.getElementById("processCounterCurrent");
    var counterTotal = document.getElementById("processCounterTotal");
    var prevBtn = document.getElementById("processPrev");
    var nextBtn = document.getElementById("processNext");
    var progress = document.getElementById("processProgress");
    var progressFill = document.getElementById("processProgressFill");
    var filmstrip = document.getElementById("filmstripTrack");
    if (!stageSection || !image || !filmstrip) return;

    var total = PROCESS_STEPS.length;
    var currentStep = 0;
    counterTotal.textContent = pad(total);

    function buildFilmstrip() {
      PROCESS_STEPS.forEach(function (step, i) {
        var n = pad(i + 1);
        var path = "assets/process-" + n + ".jpg";

        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "filmstrip-item";
        btn.setAttribute("data-media-frame", "");
        btn.setAttribute("role", "tab");
        btn.setAttribute("aria-selected", i === 0 ? "true" : "false");
        btn.setAttribute("aria-label", "Stage " + n + ": " + step.title);

        var thumb = document.createElement("img");
        thumb.src = path;
        thumb.alt = "";
        thumb.dataset.fallbackLabel = path;

        var placeholder = document.createElement("div");
        placeholder.className = "media-placeholder";
        placeholder.setAttribute("aria-hidden", "true");
        placeholder.innerHTML = '<span class="media-placeholder-icon">▦</span>';

        var numTag = document.createElement("span");
        numTag.className = "fs-num";
        numTag.textContent = n;

        btn.appendChild(thumb);
        btn.appendChild(placeholder);
        btn.appendChild(numTag);
        btn.addEventListener("click", function () {
          renderStep(i);
        });
        filmstrip.appendChild(btn);
      });
    }

    function renderStep(index, instant) {
      currentStep = clampNum(index, 0, total - 1);
      var step = PROCESS_STEPS[currentStep];
      var n = pad(currentStep + 1);

      stageLabel.textContent = "Stage " + n + " / " + pad(total);
      var isFinal = currentStep === total - 1;
      stageTag.textContent = isFinal ? "Final Direction" : "Exploration";
      stageTag.classList.toggle("is-final", isFinal);
      bigNumber.textContent = n;
      counterCurrent.textContent = n;
      titleEl.textContent = step.title;
      descEl.textContent = step.desc;
      changedEl.textContent = step.changed;
      connectsEl.textContent = step.connects;
      prevBtn.disabled = currentStep === 0;
      nextBtn.disabled = currentStep === total - 1;
      progressFill.style.width = (currentStep / (total - 1)) * 100 + "%";

      function swapImage() {
        var path = "assets/process-" + n + ".jpg";
        image.src = path;
        image.alt = "Process stage " + n + ": " + step.title;
        image.dataset.fallbackLabel = path;
        placeholderText.textContent = "Add process-" + n + ".jpg to /assets";
        var mediaFrame = image.closest("[data-media-frame]");
        if (mediaFrame) mediaFrame.classList.remove("media-missing");
      }

      image.classList.remove("is-visible");
      if (instant || prefersReducedMotion) {
        swapImage();
      } else {
        setTimeout(swapImage, 220);
      }

      var thumbs = filmstrip.querySelectorAll(".filmstrip-item");
      thumbs.forEach(function (el, i) {
        var isActive = i === currentStep;
        el.classList.toggle("is-active", isActive);
        el.setAttribute("aria-selected", isActive ? "true" : "false");
      });
      var activeThumb = thumbs[currentStep];
      if (activeThumb) {
        var target = activeThumb.offsetLeft - (filmstrip.clientWidth - activeThumb.clientWidth) / 2;
        target = clampNum(target, 0, filmstrip.scrollWidth - filmstrip.clientWidth);
        filmstrip.scrollTo({ left: target, behavior: prefersReducedMotion ? "auto" : "smooth" });
      }
    }

    prevBtn.addEventListener("click", function () {
      renderStep(currentStep - 1);
    });
    nextBtn.addEventListener("click", function () {
      renderStep(currentStep + 1);
    });

    progress.addEventListener("click", function (e) {
      var r = progress.getBoundingClientRect();
      var ratio = clampNum((e.clientX - r.left) / r.width, 0, 1);
      renderStep(Math.round(ratio * (total - 1)));
    });

    var processInView = false;
    var processSectionObserver = new IntersectionObserver(
      function (entries) {
        processInView = entries[0].isIntersecting;
      },
      { threshold: 0.3 }
    );
    processSectionObserver.observe(stageSection);

    document.addEventListener("keydown", function (e) {
      if (!processInView) return;
      var activeTag = document.activeElement ? document.activeElement.tagName : "";
      if (activeTag === "INPUT" || activeTag === "TEXTAREA") return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        renderStep(currentStep - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        renderStep(currentStep + 1);
      }
    });

    buildFilmstrip();
    renderStep(0, true);
  })();

  /* ---------------------------------------------------------------------
     Before / After comparison slider
  --------------------------------------------------------------------- */
  (function setupCompare() {
    var range = document.getElementById("compareRange");
    var compareFrame = document.getElementById("compareFrame");
    if (!range || !compareFrame) return;

    function update(value) {
      compareFrame.style.setProperty("--pos", value + "%");
    }
    range.addEventListener("input", function (e) {
      update(e.target.value);
    });
    update(range.value);
  })();

  /* ---------------------------------------------------------------------
     Final Ad Breakdown — numbered hotspots
     x / y are percentages across the ad canvas, mapped directly from the
     real final-ad.png (1080×1350) and matched to the 12-point breakdown
     used in the Design Rationale graphic.
  --------------------------------------------------------------------- */
  var HOTSPOTS = [
    { x: 9, y: 9, title: "Logo", text: "The red dot inside the square mark doubles as a focus/aperture cue — brand recognition built into the InFocus name." },
    { x: 12, y: 18, title: "Program Label", text: "A small red tag that immediately tells the viewer which specific program this ad is for." },
    { x: 25, y: 27, title: "Headline", text: "Bold two-tone type sets up the program name and gives the ad its visual anchor before anything else is read." },
    { x: 22, y: 42, title: "Subheadline", text: "One sentence that turns the program into a personal outcome: build your creative future." },
    { x: 19, y: 59, title: "Key Benefits", text: "Three scannable lines — branding, real projects, portfolio — so the offer reads in seconds." },
    { x: 70, y: 38, title: "Film Reel", text: "The hero object's main body, tying the program directly to InFocus Film School's identity." },
    { x: 79, y: 28, title: "Exposed Compartments", text: "Transparent windows reveal real design tools inside the reel — craft made visible, not just implied." },
    { x: 42, y: 62, title: "Deconstructed Pencil", text: "A second hero object paired with the reel, standing for drawing, layout, and hands-on design practice." },
    { x: 49, y: 73, title: "Scattered Pieces", text: "Loose pieces in front of both objects read as work in progress — creativity as something built, not finished." },
    { x: 16, y: 86, title: "Start Date", text: "A concrete date gives the offer a real deadline instead of an open-ended invitation." },
    { x: 50, y: 86, title: "Countdown", text: "The \"3 days to start\" callout stacks urgency directly on top of the date." },
    { x: 79, y: 86, title: "Call to Action", text: "The one red button on the page — every other red accent leads the eye toward this." }
  ];

  (function setupHotspots() {
    var layer = document.getElementById("hotspotLayer");
    if (!layer) return;

    var activeBtn = null;

    function closeAll() {
      layer.querySelectorAll(".hotspot-tooltip.is-visible").forEach(function (t) {
        t.classList.remove("is-visible");
      });
      layer.querySelectorAll(".hotspot.is-active").forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-expanded", "false");
      });
      activeBtn = null;
    }

    HOTSPOTS.forEach(function (spot, i) {
      var n = i + 1;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "hotspot";
      btn.style.left = spot.x + "%";
      btn.style.top = spot.y + "%";
      btn.textContent = String(n);
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-label", n + ". " + spot.title + " — show explanation");

      var tooltip = document.createElement("div");
      tooltip.className = "hotspot-tooltip";
      tooltip.id = "hotspot-tip-" + n;
      tooltip.setAttribute("role", "dialog");
      tooltip.innerHTML = "<h5>" + n + ". " + spot.title + "</h5><p>" + spot.text + "</p>";

      if (spot.x > 60) {
        tooltip.style.right = 100 - spot.x + 4 + "%";
        tooltip.style.left = "auto";
      } else {
        tooltip.style.left = spot.x + 4 + "%";
        tooltip.style.right = "auto";
      }
      if (spot.y > 65) {
        tooltip.style.bottom = 100 - spot.y + 6 + "%";
        tooltip.style.top = "auto";
      } else {
        tooltip.style.top = spot.y + "%";
        tooltip.style.bottom = "auto";
      }

      btn.setAttribute("aria-controls", tooltip.id);
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var willOpen = !tooltip.classList.contains("is-visible");
        closeAll();
        if (willOpen) {
          tooltip.classList.add("is-visible");
          btn.classList.add("is-active");
          btn.setAttribute("aria-expanded", "true");
          activeBtn = btn;
        }
      });

      layer.appendChild(btn);
      layer.appendChild(tooltip);
    });

    document.addEventListener("click", function (e) {
      if (activeBtn && !layer.contains(e.target)) closeAll();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAll();
    });
  })();

  /* ---------------------------------------------------------------------
     Lightbox — click any rationale/process image to view it full-size
  --------------------------------------------------------------------- */
  (function setupLightbox() {
    var overlay = document.getElementById("lightboxOverlay");
    var lightboxImg = document.getElementById("lightboxImg");
    var closeBtn = document.getElementById("lightboxClose");
    if (!overlay || !lightboxImg || !closeBtn) return;

    function open(src, alt) {
      lightboxImg.src = src;
      lightboxImg.alt = alt || "";
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");
    }

    function close() {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lightbox-open");
      lightboxImg.src = "";
    }

    document.addEventListener("click", function (e) {
      var trigger = e.target.closest("[data-lightbox-trigger]");
      if (!trigger || trigger.classList.contains("media-missing")) return;
      var img = trigger.querySelector("img");
      if (!img) return;
      open(img.currentSrc || img.src, img.alt);
    });

    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) close();
    });
  })();

  /* ---------------------------------------------------------------------
     Footer year
  --------------------------------------------------------------------- */
  var footerYear = document.getElementById("footerYear");
  if (footerYear) footerYear.textContent = new Date().getFullYear();
})();
