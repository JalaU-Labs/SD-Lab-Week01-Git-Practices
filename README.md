# SD-Lab-Week01-Git-Practices

[![GitHub Actions CI](https://github.com/JalaU-Labs/SD-Lab-Week01-Git-Practices/actions/workflows/ci.yml/badge.svg)](https://github.com/JalaU-Labs/SD-Lab-Week01-Git-Practices/actions/workflows/ci.yml)
[![GitLab CI](https://gitlab.com/jala-university1/cohort-5/ES.CSSD-245.GA.T2.26.M2/SD/group-b/individual-laboratories/alejandro-botina/week-01/SD-Lab-Week01-Git-Practices/badges/main/pipeline.svg)](https://gitlab.com/jala-university1/cohort-5/ES.CSSD-245.GA.T2.26.M2/SD/group-b/individual-laboratories/alejandro-botina/week-01/SD-Lab-Week01-Git-Practices/-/pipelines)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Laboratorio Semana 1 - Buenas prácticas en el uso de Git.

## Descripción

Proyecto de prueba para demostrar la aplicación de buenas prácticas de Git (ramas temáticas, commits descriptivos, rebase, resolución de conflictos, stash, tags, merge requests) utilizando **GitLab** como repositorio principal y **GitHub** como espejo. El proyecto consiste en una aplicación web estática (HTML, CSS, JavaScript nativo) con pruebas unitarias en Jest.

## Tecnologías

- HTML5
- CSS3
- JavaScript (ES6+)
- Jest (pruebas unitarias)
- Babel (transpilación ESM para Jest)
- GitHub Actions (CI)
- GitLab CI (CI + GitLab Pages)

## Estructura del proyecto

```
.
├── .github/
│   └── workflows/
│       └── ci.yml
├── .gitlab-ci.yml
├── .gitignore
├── LICENSE
├── README.md
├── babel.config.js
├── package.json
├── package-lock.json
├── index.html
├── assets/
│   └── .gitkeep
├── src/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── counter.js
│       └── main.js
└── tests/
    ├── counter.test.js
    └── main.test.js
```

## Instalación

```bash
npm install
```

## Ejecución de pruebas

```bash
npm test
```

Para modo watch:

```bash
npm run test:watch
```

Para cobertura:

```bash
npm run test:coverage
```

## Ejecución local

Abre `index.html` en tu navegador, o sirve el proyecto con:

```bash
npx serve .
```

## Flujo de trabajo Git utilizado

Este proyecto aplica GitFlow simplificado:

- `main`: rama de producción. Solo recibe merges desde `develop` mediante releases.
- `develop`: rama de integración. Recibe merges desde ramas `feature/*`.
- `feature/*`: ramas temáticas para nuevas funcionalidades. Se eliminan tras el merge.
- Tags anotados para releases (`v1.0.0`, `v1.0.1`, etc.).
- Merge Requests en GitLab para integrar features a `develop`.
- Rebase interactivo para mantener historial lineal antes de integrar.
- `git stash` para guardar trabajo temporal.
- Resolución manual de conflictos durante rebase.

## Repositorios

- **GitLab (principal):** [SD-Lab-Week01-Git-Practices](https://gitlab.com/jala-university1/cohort-5/ES.CSSD-245.GA.T2.26.M2/SD/group-b/individual-laboratories/alejandro-botina/week-01/SD-Lab-Week01-Git-Practices)
- **GitHub (espejo):** [SD-Lab-Week01-Git-Practices](https://github.com/JalaU-Labs/SD-Lab-Week01-Git-Practices)

## Licencia

MIT © 2026 Diego Alejandro Botina