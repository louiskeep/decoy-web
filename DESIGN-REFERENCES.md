# Design references

Status: current

Sites the owner picked as references for the Decoy website and docs in the pre-release web work. Read this before planning or building any site page.

## optimAIzr (https://www.optimaizr.com/)

Added 2026-11-05 by Cam: "I like this skeleton design and clean/fast aesthetic, demo videos, images etc."

What to take from it:
- **Skeleton.** In this order: a top nav with docs, demo, GitHub star count and an install button; a one-line hero with a copyable install command; a product mockup right under the hero; numbers (downloads, stars); "what it is" and "what it does" in plain words; feature blocks, each with a short video; testimonials; a "receipt" card with real figures and the method behind them; releases; FAQ; a "try it" terminal block; footer.
- **Clean and fast.** Text-first, light on decoration, no heavy framework feel. A light/dark toggle. Dense but readable: small labels, numbers, tight cards.
- **Type.** Monospace for commands, output and `//` comment-style labels, with a sans-serif for body text. Terse, lowercase, technical voice.
- **Demo videos.** Short and captioned with their length ("Watch the 47-second run"), with no sound needed for the main one, and offered as a click from a still frame instead of autoplaying.
- **Images.** Screenshots of the real product, plus text-based terminal and window mockups that stay selectable. The README reuses the same stills (demo.jpg, vscode.jpg) as click-to-play posters.
- **Proof.** Real numbers from the author's own use, with how they were measured. This fits Decoy's `/proof` page and the rule that every built capability is shown to customers.

Fit with what exists: the current site is the teal/black/gold DuckDB-style static rebuild (`decoy-site/`). Treat this reference as direction for structure, density, demo presentation and speed, not as a reskin, and do not copy its copy, layout code or assets. Keep the no-em-dash rule and the VISUAL-ASSET-PLAN.md rules (selectable CLI text, still fallbacks, reduced motion).
