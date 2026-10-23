/* Scroll-reveal layer for the static site. The hero entrance and page
   fade are pure CSS (see decoy-skin.css); this adds the "in" class to
   content blocks as they scroll into view. Gated on html.anim-on, so it
   stays off for reduced-motion visitors and never runs without JS. */
(function () {
	var root = document.documentElement;
	if (!root.classList.contains('anim-on')) return;
	if (!('IntersectionObserver' in window)) return;

	// Blocks worth revealing. Hero content is excluded; it has its own entrance.
	var SELECTORS = [
		'.bento-box',
		'.feature-row .frow-head',
		'.feature-row .frow-shot',
		'.demo .intro',
		'.demo .demo-frame',
		'.cap-tablist',
		'.cap-panels',
		'section > .wrap > .intro',
		'.install'
	];

	var seen = [];
	SELECTORS.forEach(function (sel) {
		Array.prototype.forEach.call(document.querySelectorAll(sel), function (el) {
			if (el.closest('.welcome')) return;
			if (seen.indexOf(el) !== -1) return;
			seen.push(el);
		});
	});
	if (!seen.length) return;

	// Stagger blocks that share a parent so a row or grid flows in, not all at once.
	var counts = [];
	var parents = [];
	seen.forEach(function (el) {
		el.classList.add('reveal');
		var p = el.parentElement;
		var pi = parents.indexOf(p);
		if (pi === -1) { parents.push(p); counts.push(0); pi = parents.length - 1; }
		var i = counts[pi]++;
		if (i) el.style.setProperty('--d', (Math.min(i, 6) * 0.07).toFixed(2) + 's');
	});

	var io = new IntersectionObserver(function (entries) {
		entries.forEach(function (e) {
			if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
		});
	}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

	seen.forEach(function (el) { io.observe(el); });
})();
