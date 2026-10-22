---
title: Domain-relevant software evolution
summary: A Python/LLM study of how software evolves when scientific domain knowledge changes.
category: Research
destination: artifacts/covasim-poster.pdf
action_label: View poster · PDF
status: Preliminary findings · Manuscript in progress
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
display_order: 2
cv_entry: covasim-research
links:
  - label: Original research poster · PDF
    url: artifacts/covasim-poster.pdf
    description: The source poster, including its original findings chart.
  - label: Case-study repository — Covasim
    url: https://github.com/InstituteforDiseaseModeling/covasim
    description: The software being studied, distinct from the research tooling.
---

## 01 Context

Research at GEODES, Université de Montréal, begun during a May–August 2026 internship and continued in graduate study. The Covasim case study examines changes to immunity-related code following new evidence about COVID-19 variants in 2021.

## 02 Problem

Software can keep running while its assumptions about the domain become outdated. Can repository history reveal how developers adapt those assumptions?

## 03 Approach

Built a Python/LLM pipeline to classify repository commits. The broader pipeline covered approximately 8,500 commits from 30 repositories across two open-source systems. A 330-commit reference dataset, independently annotated by two people, supported classifier validation.

For Covasim, compared domain-related development around the January 19, 2021 scientific event with historical pseudo-events in the same repository.

## 04 Result

<div class="findings-panel">

<div class="finding-head"><span class="finding-stat">85.3%</span><p>of commits in Bins 1–3 were domain-relevant<span class="metadata">128 / 150 commits · Preliminary finding</span></p></div>

Domain-related commits exceeded the historical 95th percentile for three consecutive intervals, as immunity-related representations were extended, reworked, and consolidated.

<p class="caveat">One retrospective Covasim episode; no causal or general claim.</p>

</div>

Manuscript in progress; venue to be determined. The poster includes the original findings chart.
