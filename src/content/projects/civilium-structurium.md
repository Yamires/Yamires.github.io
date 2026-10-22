---
title: "Civilium Structurium"
summary: "A full-stack application for steel-section calculations and selection under CSA S16, with configurable engineering rules."
date_display: "2025"
category: "Software"
context: "Full-stack engineering application"
technologies:
  ["Python", "Flask", "React", "PostgreSQL", "SymPy", "Auth0", "Render"]
draft: false
action_label: Open calculator
featured: true
include_in_cv: true
display_order: 1
cv_highlights:
  - Designed a full-stack PWA for CSA S16 steel-section calculations and selection using Flask, React, and PostgreSQL.
  - Built a YAML DSL and symbolic engine using dependency graphs, topological sorting, and SymPy to change calculation rules without editing Python code.
  - Validated the backend with 15 automated tests; the original calculation pipeline averaged approximately 17 ms over 1,000 iterations.
links: []
---

## 01 Context

A full-stack application for structural steel calculations and section selection under CSA S16.

## 02 Problem

Make engineering calculations interactive and allow calculation rules to evolve without changes to application code.

## 03 Approach

Built a PWA with React, Flask, and PostgreSQL. A YAML DSL describes calculation rules; a symbolic engine resolves dependencies through topological sorting and SymPy. Auth0 handles authentication, and the application was hosted on Render.

## 04 Result

Validated the backend with 15 automated tests. The original calculation pipeline averaged approximately 17 ms over 1,000 iterations. The portfolio hosts a separate browser-based demo; this benchmark describes the original Python pipeline.
