Drop your real image files into this folder using these exact names.
Everything on the site (hero, rationale, process timeline, before/after
slider, and the final-ad breakdown) is wired to these filenames already —
no HTML/CSS/JS edits are required once the files are here.

  final-ad.png     The final 1080 x 1350 px Meta ad.
                    Used in: Hero, Before/After (the "after" side),
                    Final Ad Breakdown.

  rationale.png     An annotated / overview image for the Design
                    Rationale section (e.g. the ad with callouts, or a
                    clean still of the full composition).

  process-01.jpg     Step 01 — Concept A: The Film Canister
  process-02.jpg     Step 02 — Concept B: The Reel, Alone
                    (also used as the "before" image in the Before/After
                    slider)
  process-03.jpg     Step 03 — Building the Supporting Layout
  process-04.jpg     Step 04 — Layout Alternate: Two Columns
  process-05.jpg     Step 05 — Pencil Joins the Reel
  process-06.jpg     Step 06 — Benefits Row, Square Format
  process-07.jpg     Step 07 — Border & Copy Lock
  process-08.jpg     Step 08 — Square Format, Final Copy
  process-09.jpg     Step 09 — Material Alternate: Tested & Rejected
  process-10.jpg     Step 10 — Final Direction

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
