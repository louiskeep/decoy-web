# Claude Guide

Web Claude guidance moved to [../decoy-platform/docs/guides/web-claude-guide.md](../decoy-platform/docs/guides/web-claude-guide.md).

Use [../decoy-platform/docs/README.md](../decoy-platform/docs/README.md) as the documentation entrypoint.

## Engineering best practices

The marketing site has no backend, no auth, no customer data. The rules from [../decoy-platform/docs/guides/engineering-best-practices.md](../decoy-platform/docs/guides/engineering-best-practices.md) apply selectively:

- §6.4 Performance claims trace to dated benchmarks. Any marketing claim ("X rows per second", "Y latency") must link to a dated benchmark file in `decoy-engine/tests/benchmark/calibration/`. Claims older than one engine release get a "last measured on" annotation.
- §10.1 Comments explain why, not what.
- §10.3 No em-dashes in repo content.

Marketing claims that outrun product capability are the chronic risk on this surface; the rule above is the relevant guard.
