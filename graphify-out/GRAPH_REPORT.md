# Graph Report - NeroWebsite  (2026-06-17)

## Corpus Check
- 11 files · ~1,267,327 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 70 nodes · 79 edges · 14 communities (9 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b67fe148`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]

## God Nodes (most connected - your core abstractions)
1. `Premium Hospitality Pattern Notes` - 7 edges
2. `Nero Research Notes` - 5 edges
3. `wait_for_images()` - 4 edges
4. `getServiceStatus()` - 3 edges
5. `showPreviewAt()` - 3 edges
6. `showPreviousPreview()` - 3 edges
7. `showNextPreview()` - 3 edges
8. `handlePreviewPointerUp()` - 3 edges
9. `publicAsset()` - 3 edges
10. `MockDate` - 3 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (14 total, 5 thin omitted)

### Community 1 - "Community 1"
Cohesion: 0.25
Nodes (7): 2026 Grand Cafe / Luxury Cafe Research Pass, 2026 High-Class Venue Pattern Refresh, 2026 Premium Pattern Pass, Pattern Boundaries, Patterns Applied To Nero, Premium Hospitality Pattern Notes, Sources Reviewed

### Community 2 - "Community 2"
Cohesion: 0.33
Nodes (5): Current Official Assets Used, Nero Research Notes, Transferable Principles From The Crema Rollout, Verified Business Facts, Visual Asset Rule

### Community 4 - "Community 4"
Cohesion: 0.7
Nodes (4): capture(), capture_preview(), capture_section(), wait_for_images()

### Community 5 - "Community 5"
Cohesion: 0.67
Nodes (4): handlePreviewPointerUp(), showNextPreview(), showPreviewAt(), showPreviousPreview()

### Community 7 - "Community 7"
Cohesion: 0.67
Nodes (3): closingHourForDay(), formatHour(), getServiceStatus()

## Knowledge Gaps
- **10 isolated node(s):** `Verified Business Facts`, `Visual Asset Rule`, `Current Official Assets Used`, `Transferable Principles From The Crema Rollout`, `Sources Reviewed` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `translateContent()` connect `Community 3` to `Community 0`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `Verified Business Facts`, `Visual Asset Rule`, `Current Official Assets Used` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._