Drop your real image files into this folder using these exact names.
Everything on the site (hero, rationale, process timeline, before/after
slider, and the final-ad breakdown) is wired to these filenames already.
No HTML/CSS/JS edits are required once the files are here.

  final-ad.png     The final 1080 x 1350 px Meta ad.
                    Used in: Hero, Before/After (the "after" side),
                    Final Ad Breakdown.

  rationale.png     An annotated / overview image for the Design
                    Rationale section (e.g. the ad with callouts, or a
                    clean still of the full composition).

  case-process-01-v7.jpg
  case-process-02-v9.png
  case-process-03-v11.png
  case-process-04-v10.png
  case-process-05-v1.png
  case-process-06-v12.png
  case-process-07-ls.png
  case-process-08-v4.png
  case-process-09-wooden-version.png
  case-process-10-upd-new.png
  case-process-13-v5.png
  case-process-14-v6.png
  case-process-16-v13.png
  case-process-17-v14.png
  case-process-18-v15.png
  case-process-19-v16.png
  case-process-20-lido.png
  case-process-21-rsnalle.png
  case-process-22-rationale.png

  (case-process-11-v2.png, -12-v3.png, and -15-v8.png were removed —
  each was a pixel-for-pixel duplicate of -06-v12.png, -09-wooden-version.png,
  and -05-v1.png respectively, just exported under a different source name.)

  Earlier paper-cut and canister exploration, added later and placed at
  the start of the timeline (the actual order each artifact appears in
  is controlled by PROCESS_STEPS in script.js, not by these filenames):

  case-process-paper-01-tunnel.png
  case-process-paper-02-ribbon.png
  case-process-paper-03-sketch.png
  case-process-paper-04-options.png
  case-process-reelphoto-01.png
  case-process-reelphoto-02.png
  case-process-lego-reel.png
  case-process-lego-camera.png
  case-process-canister-window-01.png
  case-process-canister-window-02-design.png
  case-process-canister-label-03.png
  case-process-canister-diecut-infocus.png
  case-process-canister-diecut-design.png
  case-process-canister-diecut-create.png
  case-process-canister-studio-options.png
  case-process-canister-altfinal-01.png
  case-process-canister-altfinal-02.png

  process-01.jpg is still used as the "before" image in the Before/After
  slider.

Until a file is added, that slot shows a clean placeholder card naming the
file it is waiting for, so nothing ever looks broken while you finish
gathering assets.

To edit copy:
  - Process step titles/descriptions/"what changed"/"connects to final"
    live in script.js, in the PROCESS_STEPS array near the top.
  - Final Ad Breakdown hotspot labels and their x/y position (in percent
    across the ad) live in script.js, in the HOTSPOTS array. Nudge the x/y
    values once the real final-ad.png is in place so markers line up.
  - Everything else (hero copy, rationale cards, about, contact) lives
    directly in index.html.
