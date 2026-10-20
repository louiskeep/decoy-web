# Demo video

Drop the product demo here as `decoy-demo.mp4` (and optionally a poster image at
`../images/decoy/demo-poster.png`). Then, in `index.html`, replace the
`.demo-frame` placeholder block with:

    <video controls preload="metadata" poster="images/decoy/demo-poster.png">
      <source src="videos/decoy-demo.mp4" type="video/mp4">
    </video>

Keep large source files out of git; host the mp4 on a CDN or object storage and
point `src` at it if the file is big.
