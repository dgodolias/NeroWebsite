# Graph Report - NeroWebsite  (2026-06-17)

## Corpus Check
- 44 files · ~1,314,858 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 135 nodes · 246 edges · 24 communities (12 shown, 12 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bd62e0bb`
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
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]

## God Nodes (most connected - your core abstractions)
1. `App()` - 12 edges
2. `publicAsset()` - 7 edges
3. `Premium Hospitality Pattern Notes` - 7 edges
4. `getServiceStatus()` - 5 edges
5. `Nero Research Notes` - 5 edges
6. `wait_for_images()` - 4 edges
7. `getArrivalEssentials()` - 4 edges
8. `getTodayHours()` - 3 edges
9. `getProgrammeCue()` - 3 edges
10. `useActiveSection()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `useActiveSection()`  [INFERRED]
  src/App.tsx → src/hooks/useActiveSection.ts
- `App()` --calls--> `useClock()`  [INFERRED]
  src/App.tsx → src/hooks/useClock.ts
- `App()` --calls--> `useSiteMotion()`  [INFERRED]
  src/App.tsx → src/hooks/useSiteMotion.ts
- `App()` --calls--> `useHeroDepth()`  [INFERRED]
  src/App.tsx → src/hooks/useHeroDepth.ts
- `App()` --calls--> `useCustomCursor()`  [INFERRED]
  src/App.tsx → src/hooks/useCustomCursor.ts

## Communities (24 total, 12 thin omitted)

### Community 1 - "Community 1"
Cohesion: 0.19
Nodes (6): ProofStrip(), SiteFooter(), SiteHeader(), menuIconFor(), getPreviewGallery(), publicAsset()

### Community 2 - "Community 2"
Cohesion: 0.19
Nodes (10): VisitSection(), closingHourForDay(), formatHour(), getArrivalEssentials(), getProgrammeCue(), getServiceStatus(), getTodayHours(), useAddressCopy() (+2 more)

### Community 3 - "Community 3"
Cohesion: 0.36
Nodes (6): applyGoogleTranslateLanguage(), clearGoogleTranslateState(), ensureGoogleTranslateWidget(), getInitialLanguage(), initializeGoogleTranslateElement(), GoogleTranslateWidget()

### Community 4 - "Community 4"
Cohesion: 0.25
Nodes (7): 2026 Grand Cafe / Luxury Cafe Research Pass, 2026 High-Class Venue Pattern Refresh, 2026 Premium Pattern Pass, Pattern Boundaries, Patterns Applied To Nero, Premium Hospitality Pattern Notes, Sources Reviewed

### Community 5 - "Community 5"
Cohesion: 0.33
Nodes (5): Current Official Assets Used, Nero Research Notes, Transferable Principles From The Crema Rollout, Verified Business Facts, Visual Asset Rule

### Community 6 - "Community 6"
Cohesion: 0.7
Nodes (4): capture(), capture_preview(), capture_section(), wait_for_images()

### Community 10 - "Community 10"
Cohesion: 0.67
Nodes (4): handlePreviewPointerUp(), showNextPreview(), showPreviewAt(), showPreviousPreview()

### Community 12 - "Community 12"
Cohesion: 0.67
Nodes (3): closingHourForDay(), formatHour(), getServiceStatus()

## Knowledge Gaps
- **10 isolated node(s):** `Verified Business Facts`, `Visual Asset Rule`, `Current Official Assets Used`, `Transferable Principles From The Crema Rollout`, `Sources Reviewed` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getServiceStatus()` connect `Community 2` to `Community 0`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Why does `translateContent()` connect `Community 9` to `Community 0`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **Why does `App()` connect `Community 2` to `Community 0`, `Community 7`, `Community 15`, `Community 17`, `Community 19`, `Community 20`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **Are the 11 inferred relationships involving `App()` (e.g. with `useActiveSection()` and `useClock()`) actually correct?**
  _`App()` has 11 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Verified Business Facts`, `Visual Asset Rule`, `Current Official Assets Used` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._