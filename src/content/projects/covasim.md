---
title: Domain-relevant software evolution
summary: A case study of Covasim, examining how software development responds to changes in the scientific knowledge it represents.
category: Research
destination: research/covasim/
status: Preliminary findings · Manuscript in progress; venue to be determined
date_display: 2026–present
context: GEODES research
organization: Université de Montréal
role: Research internship, followed by graduate research
collaborators: Yamir Alejandro Poldo Silva · Michalis Famelis
topics: [Repository analysis, Domain knowledge, Software evolution]
technologies: [Python]
draft: false
featured: true
include_in_cv: false
display_order: 1
cv_entry: covasim-research
links:
  - label: Interactive research narrative
    url: research/covasim/
    description: Motivation, method, findings, and representative commits.
  - label: Original research poster · PDF
    url: artifacts/covasim-poster.pdf
    description: The source poster, including its original findings chart.
  - label: Case-study repository — Covasim
    url: https://github.com/InstituteforDiseaseModeling/covasim
    description: The software being studied, distinct from the research tooling.
---

## 01 Context

Covasim is agent-based COVID-19 modeling software in the broader Starsim infectious-disease modeling ecosystem. The case study examines how domain-relevant development evolves following a change in domain knowledge, and how unusual that evolution is relative to the project’s historical development.

This research direction began during a summer 2026 internship at GEODES, Université de Montréal, and continues as graduate research at the same lab. The internship helped frame the research idea. The repository episode examined below is from 2021; it is not the research appointment date.

## 02 Problem

Software can continue to run and pass tests while its encoded domain assumptions become outdated. New evidence about immune escape provides an external anchor for examining how immunity-related representations change in repository history.

The question is whether repository artifacts can help expose this change in represented assumptions. The sequence is not treated as evidence of causality.

## 03 Approach

The preliminary method connects an external event to repository evidence, then compares the observed trajectory with historical pseudo-events from the same repository.

1. Anchor the analysis to Jan. 19, 2021: new evidence of immune escape.
2. Classify domain-relevant and non-domain-relevant commits using project-specific criteria and an LLM classifier.
3. Analyze repository history: the poster specifies 400 commits before and after the event.
4. Calibrate the trajectory against historical activity in the same repository.

## 04 Result

<div class="findings-panel">

<div class="finding-head"><span class="finding-stat">85.3%</span><p>of commits in Bins 1–3 were domain-relevant<span class="metadata">128 / 150 commits · Preliminary finding</span></p></div>

Across Bins 1–3, immunity representation is extended, reworked, and eventually consolidated into an explicit module. These bins exceeded the historical 95th percentile; domain prevalence remained above the 90th percentile through Bin 5.

<p class="caveat">One retrospective Covasim episode; no causal or general claim.</p>

</div>

Manuscript in progress; target venue to be determined.
