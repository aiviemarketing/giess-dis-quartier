![love badge](https://img.shields.io/badge/Built%20with-%E2%99%A5-red)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-15-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

# Güss dis Quartier

Güss dis Quartier is the local Zürich MVP of the open-source
[Giess den Kiez](https://github.com/technologiestiftung/giessdenkiez-de)
platform.

## About

Hotter, drier summers put pressure on Zürich’s urban trees. Güss dis Quartier
adapts the established Giess den Kiez interaction model for Zürich: residents
can find nearby trees, see their watering context, create a profile, adopt
trees, and record watering.

The Zürich MVP keeps the existing Giess den Kiez frontend and data contract as
closely as practical, replacing Berlin-specific sources with Zürich and Swiss
equivalents. It is a local MVP, not yet a hosted or scheduled production
service.

Giess den Kiez was created as an open-source project by the
[Technologiestiftung Berlin](https://www.technologiestiftung-berlin.de/) and
[CityLAB Berlin](https://citylab-berlin.org/de/start/). This repository builds
on that work and preserves its upstream attribution.

## Repositories

This project is composed of multiple repositories:

- [React frontend (this repository)](https://github.com/aiviemarketing/guess-dis-quartier)
- [Postgres API and local data adapters](https://github.com/aiviemarketing/guess-dis-quartier-postgres-api)
- [Weather repository](https://github.com/aiviemarketing/guess-dis-quartier-weather)

The original project’s additional upstream repositories remain useful
references for the base architecture and historical Berlin implementation.

## Data sources

- [City of Zürich tree cadastre (Baumkataster)](https://data.stadt-zuerich.ch/dataset/geo_baumkataster), published under CC0.
- [City of Zürich fountains (Brunnen)](https://data.stadt-zuerich.ch/dataset/geo_brunnen), published under CC0. The local MVP uses public, active fountains only.
- [MeteoSwiss CombiPrecip (CPC)](https://www.meteoswiss.admin.ch/services-and-publications/service/weather-and-climate-products/combiprecip.html) for hourly precipitation. CPC data is attributed to MeteoSwiss under its CC BY terms.
- [Mapbox](https://www.mapbox.com/) for map rendering and the local MVP’s tree vector tiles.

## Documentation

To run the local Zürich MVP, follow [gdq/README.md](./gdq/README.md). It
includes the local Supabase, Mapbox, tree, and fountain setup.

The delivery plan is in
[gdq/docs/plan/guess-dis-quartier-final-mvp-plan.md](./gdq/docs/plan/guess-dis-quartier-final-mvp-plan.md).
For upstream development details, see [README_DEV.md](./README_DEV.md) and the
[original project wiki](https://github.com/technologiestiftung/giessdenkiez-de/wiki).

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/adiux"><img src="https://avatars.githubusercontent.com/u/13075514?v=4?s=100" width="100px;" alt="Adrian Schimpf"/><br /><sub><b>Adrian Schimpf</b></sub></a><br /><a href="https://github.com/aiviemarketing/guess-dis-quartier/commits/main/?author=adiux" title="Code">💻</a></td>
    </tr>

  </tbody>
</table>

## Upstream contributors ✨

Thanks to the upstream contributors who made Giess den Kiez possible:
https://github.com/technologiestiftung/giessdenkiez-de#contributors-

## MVP sponsor

<a href="https://aivie.ch/?utm_source=gdq&utm_medium=gdq-app&utm_campaign=human&utm_content=readme-sponsor-logo">
  <img src="https://cdn.aivie.ch/media/wp/2021/06/19131704/logo-aivie-fast-kein-rand-400w.png" alt="Aivie" width="180" />
</a>

This Zürich MVP is sponsored by [Aivie](https://aivie.ch/?utm_source=gdq&utm_medium=gdq-app&utm_campaign=human&utm_content=readme-sponsor).
