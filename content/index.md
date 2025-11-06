---
layout: base.njk
title: Home
permalink: /
---

<div class="hero">
  <h1>Welcome to {{ site.name }}</h1>
  <p class="hero-description">{{ site.description }}</p>
</div>

<div class="home-sections">

## Explore Our Content

<div class="section-grid">
  {% for section in site.sections %}
  <a href="{{ ('/' ~ section.id ~ '/') | url }}" class="section-card">
    <span class="section-card-icon">{{ section.icon }}</span>
    <h3>{{ section.title }}</h3>
    <p>{{ section.description }}</p>
  </a>
  {% endfor %}
</div>

</div>
