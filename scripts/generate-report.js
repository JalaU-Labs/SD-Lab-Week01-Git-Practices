#!/usr/bin/env node
/**
 * Genera el informe del Laboratorio Semana 1 en formato .docx
 *
 * Uso:
 *   npm run report
 *
 * Personalizar ruta de imágenes:
 *   EVIDENCES_DIR=/ruta/a/imagenes npm run report
 */

const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  ImageRun, AlignmentType, TableOfContents, PageBreak,
  ExternalHyperlink, Table, TableRow, TableCell,
  WidthType, BorderStyle
} = require('docx');

// ============================================================
// CONFIGURACIÓN
// ============================================================
const EVIDENCES_DIR = process.env.EVIDENCES_DIR
  || path.resolve(__dirname, '..', 'docs', 'evidences');

const OUTPUT_DIR = process.env.OUTPUT_DIR
  || path.resolve(__dirname, '..', 'docs');

const OUTPUT_FILE = path.join(OUTPUT_DIR, 'Informe-Lab-Semana1.docx');

const STUDENT_NAME = 'Diego Alejandro Botina';
const COURSE = 'Desarrollo de Software 4 (ES.CSSD-245)';
const LAB_TITLE = 'Laboratorio Semana 1 - Buenas prácticas en el uso de Git';
const DATE_STR = new Date().toLocaleDateString('es-CO', {
  year: 'numeric', month: 'long', day: 'numeric'
});

const GITLAB_URL = 'https://gitlab.com/jala-university1/cohort-5/ES.CSSD-245.GA.T2.26.M2/SD/group-b/individual-laboratories/alejandro-botina/week-01/SD-Lab-Week01-Git-Practices';
const GITHUB_URL = 'https://github.com/JalaU-Labs/SD-Lab-Week01-Git-Practices';

const IMAGES = {
  logo: 'logo-jalau.jpg',
  graph: 'repository-graph.png',
  mergeRequest: 'merge-request.png',
  pipelines: 'pipelines.png',
  tags: 'tags.png',
  pages: 'gitlab-pages.png'
};

// ============================================================
// HELPERS
// ============================================================
function imageExists(filename) {
  return fs.existsSync(path.join(EVIDENCES_DIR, filename));
}

function imageParagraph(filename, maxWidth = 550) {
  if (!imageExists(filename)) {
    console.warn(`[WARN] No se encontró ${filename} en ${EVIDENCES_DIR}`);
    return new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 200 },
      children: [new TextRun({
        text: `[Imagen no disponible: ${filename}]`,
        italics: true,
        color: '999999'
      })]
    });
  }
  const filepath = path.join(EVIDENCES_DIR, filename);
  const buffer = fs.readFileSync(filepath);
  let dimensions;
  try {
    dimensions = sizeOf(buffer);
  } catch (err) {
    console.warn(`[WARN] No se pudieron leer dimensiones de ${filename}: ${err.message}`);
    dimensions = { width: 800, height: 600, type: filename.endsWith('.jpg') ? 'jpg' : 'png' };
  }
  const ratio = dimensions.height / dimensions.width;
  const width = Math.min(dimensions.width, maxWidth);
  const height = Math.round(width * ratio);
  const type = (dimensions.type === 'jpg' || dimensions.type === 'jpeg') ? 'jpg' : 'png';

  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 200 },
    children: [
      new ImageRun({
        data: buffer,
        transformation: { width, height },
        type
      })
    ]
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 300, after: 200 },
    children: [new TextRun({ text, bold: true })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 250, after: 150 },
    children: [new TextRun({ text, bold: true })]
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, bold: true })]
  });
}

function p(text, options = {}) {
  const runOptions = options.run || {};
  return new Paragraph({
    spacing: { after: 120 },
    alignment: options.alignment || AlignmentType.JUSTIFIED,
    children: [new TextRun({ text, ...runOptions })]
  });
}

function bullet(text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text })]
  });
}

function codeBlock(lines) {
  return lines.map(line => new Paragraph({
    spacing: { after: 0 },
    shading: { type: 'clear', fill: 'F4F4F4' },
    children: [new TextRun({ text: line, font: 'Consolas', size: 18 })]
  }));
}

function link(url, text) {
  return new ExternalHyperlink({
    link: url,
    children: [new TextRun({ text, style: 'Hyperlink', color: '0563C1', underline: {} })]
  });
}

function caption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text, italics: true, size: 18, color: '666666' })]
  });
}

// ============================================================
// PORTADA
// ============================================================
const cover = [
  new Paragraph({ spacing: { before: 400 }, children: [] }),
  imageParagraph(IMAGES.logo, 180),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 300, after: 100 },
    children: [new TextRun({ text: 'Jala University', bold: true, size: 32 })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 600 },
    children: [new TextRun({ text: COURSE, size: 24 })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text: LAB_TITLE, bold: true, size: 36 })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 800 },
    children: [new TextRun({ text: 'Informe de Buenas Prácticas y Proyecto de Prueba', italics: true, size: 22 })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
    children: [new TextRun({ text: `Estudiante: ${STUDENT_NAME}`, size: 22 })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
    children: [new TextRun({ text: 'Cohorte 5 - Grupo B', size: 22 })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
    children: [new TextRun({ text: `Fecha: ${DATE_STR}`, size: 22 })]
  }),
  new Paragraph({ children: [new PageBreak()] })
];

// ============================================================
// TABLA DE CONTENIDO
// ============================================================
const toc = [
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text: 'Tabla de Contenido', bold: true })]
  }),
  new TableOfContents('Tabla de Contenido', {
    hyperlink: true,
    headingStyleRange: '1-3'
  }),
  new Paragraph({ children: [new PageBreak()] })
];

// ============================================================
// 1. INTRODUCCIÓN
// ============================================================
const intro = [
  h1('1. Introducción'),
  p('El presente informe documenta el desarrollo del Laboratorio Semana 1 de la materia Desarrollo de Software 4, cuyo objetivo central es comprender y aplicar las mejores prácticas al trabajar con Git en un proyecto de software. Para ello, se desarrolló un proyecto de prueba en HTML, CSS y JavaScript nativo, alojado simultáneamente en GitLab (repositorio principal) y GitHub (espejo), en el que se ejecutaron comandos Git que respaldan cada una de las prácticas descritas.'),
  p('El proyecto consiste en una aplicación web estática que incluye un saludo personalizado y un contador interactivo, acompañado de pruebas unitarias automatizadas con Jest y Babel. Adicionalmente, se configuraron pipelines de integración continua tanto en GitHub Actions como en GitLab CI, incluyendo el despliegue automático en GitLab Pages.'),
  p('Este documento presenta, en primer lugar, las diez buenas prácticas de Git seleccionadas, cada una con su descripción, su importancia y un ejemplo concreto extraído del proyecto. Posteriormente, se incluyen las evidencias gráficas del repositorio (grafo de commits, merge requests, pipelines, tags y despliegue), y finalmente, las conclusiones del ejercicio.'),
  new Paragraph({ children: [new PageBreak()] })
];

// ============================================================
// 2. OBJETIVOS
// ============================================================
const objectives = [
  h1('2. Objetivos'),
  h2('2.1. Objetivo general'),
  p('Aplicar las buenas prácticas de Git en un proyecto de software real, utilizando GitLab como repositorio principal y GitHub como espejo, con el fin de afianzar los conocimientos sobre control de versiones y flujos de trabajo colaborativos.'),
  h2('2.2. Objetivos específicos'),
  bullet('Identificar y justificar al menos diez buenas prácticas para el trabajo con Git.'),
  bullet('Desarrollar un proyecto de prueba en HTML, CSS y JavaScript nativo que implemente dichas prácticas.'),
  bullet('Configurar pipelines de integración continua en GitLab CI y GitHub Actions.'),
  bullet('Documentar el flujo de trabajo con evidencias gráficas del repositorio y de los pipelines.'),
  bullet('Implementar pruebas unitarias automatizadas que validen el comportamiento del código.'),
  new Paragraph({ children: [new PageBreak()] })
];

// ============================================================
// 3. BUENAS PRÁCTICAS DE GIT
// ============================================================
function bestPractice(num, title, description, importance, example, commands) {
  const content = [
    h2(`3.${num}. ${title}`),
    h3('Descripción'),
    p(description),
    h3('Importancia'),
    p(importance),
    h3('Aplicación en este proyecto'),
    p(example)
  ];
  if (commands && commands.length) {
    content.push(new Paragraph({
      spacing: { before: 120, after: 60 },
      children: [new TextRun({ text: 'Comandos representativos:', bold: true })]
    }));
    content.push(...codeBlock(commands));
  }
  return content;
}

const practices = [
  h1('3. Buenas Prácticas de Git Aplicadas'),

  ...bestPractice(
    1,
    'Nombrado de ramas',
    'Las ramas deben nombrarse siguiendo una convención que permita identificar de forma inmediata su propósito. En este proyecto se utilizó el prefijo feature/ para ramas temáticas, seguido de un nombre en kebab-case descriptivo (feature/project-structure, feature/add-counter, feature/update-readme). Las ramas principales se mantuvieron como main y develop, siguiendo GitFlow.',
    'Un nombrado consistente facilita la navegación del repositorio, permite aplicar reglas de protección por patrón (por ejemplo, proteger develop contra push directo), y ayuda a identificar ramas huérfanas que deben eliminarse tras el merge.',
    'Se crearon tres ramas temáticas siguiendo la convención: feature/project-structure, feature/add-counter y feature/update-readme. Todas fueron eliminadas tras su respectivo merge a develop, manteniendo el repositorio limpio.',
    ['git checkout -b feature/add-counter',
     'git push -u origin feature/add-counter']
  ),

  ...bestPractice(
    2,
    'Frecuencia y atomicidad de los commits',
    'Cada commit debe representar una unidad lógica de trabajo completa y coherente. Se evitó agrupar cambios no relacionados en un mismo commit; por ejemplo, la creación de cada archivo base (.gitignore, LICENSE, package.json, README.md) tuvo su propio commit, al igual que cada archivo fuente y cada test.',
    'Los commits atómicos permiten revertir cambios puntuales sin afectar funcionalidad no relacionada, facilitan el uso de git bisect para localizar bugs, y hacen que las revisiones de código (code review) sean más claras y rápidas.',
    'A lo largo del proyecto se realizaron más de 25 commits atómicos. Cada uno incluye una única responsabilidad y sigue la convención de Conventional Commits.',
    ['git add index.html',
     'git commit -m "feat: add index.html with basic structure and greeting section"']
  ),

  ...bestPractice(
    3,
    'Mensajes claros y descriptivos en los commits',
    'Se adoptó la convención Conventional Commits, que estructura el mensaje como <tipo>: <descripción imperativa>. Los tipos utilizados fueron feat, fix, docs, test, ci, chore y build. Los mensajes se redactaron en inglés, en modo imperativo y con la primera letra en minúscula.',
    'Un historial con mensajes descriptivos funciona como documentación viva del proyecto. Permite generar changelogs automáticos, entender el porqué de cada cambio meses después, y facilita la incorporación de nuevos colaboradores al equipo.',
    'Ejemplos reales del historial: "feat: add counter module with createCounter and renderCounter functions", "fix: update greeting message to include \'Have a great day\'", "ci: add GitLab CI pipeline for testing and pages deployment".',
    ['git commit -m "test: add unit tests for counter module"',
     'git commit -m "docs: expand README with project info, structure, workflow and repository links"']
  ),

  ...bestPractice(
    4,
    'Ramas temáticas para nuevas funcionalidades',
    'Cada nueva funcionalidad, corrección o mejora se desarrolla en una rama aislada creada a partir de develop. Una vez completada y validada mediante pruebas y merge request, la rama se fusiona a develop y se elimina. Este patrón se conoce como Feature Branch Workflow.',
    'El aislamiento en ramas temáticas evita que cambios a medio terminar contaminen la rama de integración. Permite que varios desarrolladores trabajen en paralelo sin bloquearse, y que cada funcionalidad se revise de forma independiente antes de integrarse.',
    'Se aplicó en tres ocasiones: feature/project-structure (estructura base), feature/add-counter (módulo contador) y feature/update-readme (documentación). Cada una se fusionó vía merge request con --no-ff, preservando su historial.',
    ['git checkout develop',
     'git checkout -b feature/add-counter',
     '# ... desarrollo y commits ...',
     'git checkout develop',
     'git merge --no-ff feature/add-counter']
  ),

  ...bestPractice(
    5,
    'Merging vs Rebasing',
    'El merge preserva la historia completa de ambas ramas creando un commit de fusión, mientras que el rebase reescribe los commits de la rama actual sobre la rama destino, produciendo un historial lineal. En este proyecto se aplicó merge con --no-ff para integrar features a develop (preservando trazabilidad), y rebase para actualizar la rama feature/add-counter antes de su merge final.',
    'El rebase mantiene un historial lineal y limpio, ideal para ramas de feature que aún no han sido compartidas. El merge preserva el contexto de cuándo se integró cada rama, lo cual es valioso en la rama develop y en los releases. Conocer cuándo aplicar cada uno evita reescribir historia pública y mantiene el repositorio legible.',
    'La rama feature/add-counter se rebaseó sobre develop (que había recibido un fix en el mensaje de saludo), resolviendo dos conflictos durante el proceso. Posteriormente se integró a develop mediante merge con --no-ff, y develop se integró a main mediante merge --no-ff con tag v1.0.0.',
    ['git checkout feature/add-counter',
     'git rebase develop',
     '# resolver conflictos',
     'git add <archivos>',
     'git rebase --continue',
     'git push --force-with-lease origin feature/add-counter']
  ),

  ...bestPractice(
    6,
    'Manejo de conflictos en el código',
    'Los conflictos surgen cuando dos ramas modifican las mismas líneas de un archivo. Git marca las secciones en conflicto con <<<<<<<, ======= y >>>>>>>. La resolución consiste en editar el archivo para dejar el contenido definitivo, eliminando los marcadores, y luego ejecutar git add y git rebase --continue (o git commit en caso de merge).',
    'Resolver conflictos correctamente es una habilidad fundamental en el trabajo colaborativo. Ignorarlos o resolverlos de forma descuidada puede introducir bugs silenciosos en la rama de integración. Además, resolver conflictos durante un rebase exige más cuidado porque se reescribe historia.',
    'Durante el rebase de feature/add-counter sobre develop se presentaron dos conflictos: uno en src/js/main.js (mensaje del saludo) y otro en tests/main.test.js (aserciones esperadas). Ambos se resolvieron combinando los mensajes en uno solo: "Hello, ${name}! Have a great day! Welcome!", y se actualizaron las pruebas para que coincidieran.',
    ['# Durante el rebase, Git muestra:',
     'CONFLICT (content): Merge conflict in src/js/main.js',
     '# Editar el archivo eliminando marcadores, luego:',
     'git add src/js/main.js tests/main.test.js',
     'git rebase --continue']
  ),

  ...bestPractice(
    7,
    'Utilización de etiquetas (tags) para releases',
    'Los tags anotados marcan puntos específicos en la historia del proyecto, típicamente releases. Se utilizó versionado semántico (SemVer): MAJOR.MINOR.PATCH. Se crearon los tags v1.0.0 (release inicial con saludo y contador) y v1.0.1 (actualización de documentación). Los tags anotados incluyen mensaje, autor y fecha.',
    'Los tags permiten reconstruir el estado exacto del código en un release histórico, facilitan la generación de changelogs, y son la base para pipelines de despliegue a producción. A diferencia de las ramas, los tags son inmutables, lo que garantiza reproducibilidad.',
    'Se crearon dos tags anotados y se subieron a ambos remotos. GitLab los muestra en su sección "Tags" con opción de crear releases formales a partir de ellos.',
    ['git tag -a v1.0.0 -m "Release v1.0.0: Initial project with greeting and counter features"',
     'git push origin v1.0.0',
     'git tag -a v1.0.1 -m "Release v1.0.1: Documentation update"',
     'git push origin v1.0.1']
  ),

  ...bestPractice(
    8,
    'Uso de git stash',
    'git stash guarda temporalmente los cambios del working directory y del index, dejando el árbol de trabajo limpio. Permite cambiar de contexto (por ejemplo, para atender un fix urgente en otra rama) sin necesidad de commitear trabajo a medias. Los cambios se recuperan luego con git stash pop o git stash apply.',
    'Evita commits WIP ("work in progress") que ensucian el historial, permite cambiar de rama sin perder trabajo, y facilita la experimentación: si un draft no sirve, simplemente se descarta. Es especialmente útil cuando un cambio urgente interrumpe una tarea en curso.',
    'Se utilizó durante el desarrollo del módulo contador: se tenía un draft de "modo oscuro" en src/css/styles.css sin terminar. Se guardó con git stash push -m "WIP: draft dark mode styles", se atendió un fix en develop, y al volver se recuperó con git stash pop. Como el draft no era necesario, se descartó con git checkout -- src/css/styles.css.',
    ['git stash push -m "WIP: draft dark mode styles"',
     'git stash list',
     '# cambiar de rama, atender el fix urgente',
     'git checkout feature/add-counter',
     'git stash pop',
     '# descartar el draft si no sirve:',
     'git checkout -- src/css/styles.css']
  ),

  ...bestPractice(
    9,
    'Trabajo colaborativo y pull/merge requests',
    'Los Merge Requests (GitLab) o Pull Requests (GitHub) son solicitudes formales de integración de una rama a otra. Permiten revisión de código, discusión de cambios, ejecución de pipelines de CI y aprobación antes del merge. En este proyecto se creó un MR real en GitLab para integrar feature/add-counter a develop.',
    'Los MR/PR son el mecanismo central de colaboración en equipos profesionales. Garantizan que ningún cambio llega a la rama principal sin revisión, ejecutan automáticamente las pruebas y pipelines de CI, y dejan un registro auditable de quién aprobó qué y cuándo.',
    'Se creó el MR "feat: add counter module with tests and rebase conflict resolution" en GitLab, con descripción detallada de las buenas prácticas demostradas. El pipeline asociado pasó en verde y el MR fue aprobado y mergeado, eliminando la rama origen automáticamente.',
    ['# Crear MR desde la interfaz de GitLab:',
     '# Source: feature/add-counter  ->  Target: develop',
     '# Título: feat: add counter module with tests and rebase conflict resolution',
     '# Merge con opción "Delete source branch"']
  ),

  ...bestPractice(
    10,
    'Sincronización frecuente con el repositorio remoto',
    'Antes de comenzar cualquier tarea se ejecuta git pull para traer los últimos cambios. Al terminar, se ejecuta git push para compartirlos. Esta rutina evita que la rama local diverja de la remota y reduce la magnitud de los conflictos. Adicionalmente, se configuró un remoto dual para empujar a GitLab y GitHub simultáneamente.',
    'La sincronización frecuente mantiene el repositorio local actualizado, reduce conflictos grandes y deja visible el progreso del equipo. Además, al usar un remoto dual con GitLab como principal y GitHub como espejo, se garantiza redundancia y visibilidad del trabajo en ambas plataformas.',
    'Cada rama feature se sincronizó al inicio (git pull origin develop) y al final (git push -u origin feature/xxx). El remoto origin se configuró con URL de fetch apuntando a GitLab y múltiples URLs de push (GitLab + GitHub), de modo que un solo git push actualiza ambos repositorios.',
    ['git remote add origin <gitlab-url>',
     'git remote set-url --add --push origin <github-url>',
     'git pull origin develop',
     'git push origin develop']
  ),

  new Paragraph({ children: [new PageBreak()] })
];

// ============================================================
// 4. EVIDENCIAS DEL PROYECTO
// ============================================================
const evidence = [
  h1('4. Evidencias del Proyecto'),
  p('A continuación se presentan las capturas de pantalla que demuestran la correcta aplicación de las buenas prácticas descritas en la sección anterior. Todas las evidencias provienen del repositorio en GitLab.'),
  
  h2('4.1. Grafo de commits del repositorio'),
  p('El siguiente grafo muestra el historial completo del proyecto, incluyendo la estructura de ramas, los merges con --no-ff, los dos tags de release (v1.0.0 y v1.0.1), y la rama develop como línea de integración. Se evidencia el uso de ramas temáticas y la preservación del historial.'),
  imageParagraph(IMAGES.graph, 550),
  caption('Figura 1. Repository graph del proyecto en GitLab.'),

  h2('4.2. Merge Request aprobado'),
  p('El MR "feat: add counter module with tests and rebase conflict resolution" fue creado desde feature/add-counter hacia develop. Incluye la descripción de las buenas prácticas demostradas, el pipeline en verde, y la evidencia del merge con eliminación automática de la rama origen.'),
  imageParagraph(IMAGES.mergeRequest, 550),
  caption('Figura 2. Detalle del Merge Request aprobado en GitLab.'),

  h2('4.3. Pipelines de integración continua'),
  p('Los pipelines de GitLab CI se ejecutaron automáticamente en cada push, mostrando el estado "Passed" en todos los commits relevantes. Se evidencia la ejecución tanto en ramas feature como en develop y main, incluyendo los tags de release.'),
  imageParagraph(IMAGES.pipelines, 550),
  caption('Figura 3. Historial de pipelines en GitLab CI.'),

  h2('4.4. Tags de release'),
  p('Se crearon dos tags anotados (v1.0.0 y v1.0.1) siguiendo versionado semántico. Ambos incluyen mensaje descriptivo y están asociados al commit de merge correspondiente en main.'),
  imageParagraph(IMAGES.tags, 550),
  caption('Figura 4. Sección de Tags en GitLab con los releases v1.0.0 y v1.0.1.'),

  h2('4.5. Despliegue en GitLab Pages'),
  p('El pipeline de GitLab CI incluye una etapa de deploy que publica automáticamente el sitio estático en GitLab Pages. Esto demuestra la integración entre control de versiones, CI/CD y despliegue continuo.'),
  imageParagraph(IMAGES.pages, 550),
  caption('Figura 5. Aplicación desplegada en GitLab Pages.'),

  new Paragraph({ children: [new PageBreak()] })
];

// ============================================================
// 5. CONCLUSIONES
// ============================================================
const conclusions = [
  h1('5. Conclusiones'),
  p('El desarrollo de este laboratorio permitió aplicar de forma integral las buenas prácticas de Git en un proyecto real, utilizando GitLab como repositorio principal y GitHub como espejo. Se completaron los siguientes logros:'),
  bullet('Se implementaron 10 buenas prácticas de Git, cada una con ejemplos concretos extraídos del proyecto.'),
  bullet('Se configuró un flujo de trabajo GitFlow simplificado con ramas main, develop y feature/*.'),
  bullet('Se demostró el uso de git stash, rebase interactivo, resolución manual de conflictos y tags anotados.'),
  bullet('Se creó y aprobó un Merge Request real en GitLab, con pipeline en verde y eliminación automática de la rama origen.'),
  bullet('Se configuraron pipelines de CI en GitLab CI y GitHub Actions, incluyendo despliegue automático en GitLab Pages.'),
  bullet('Se implementaron 13 pruebas unitarias con Jest, todas en verde, con cobertura de los módulos main.js y counter.js.'),
  p('El proyecto queda como una plantilla reproducible que demuestra un flujo de trabajo profesional de control de versiones, listo para ser usado como base en futuros desarrollos.'),
  new Paragraph({ children: [new PageBreak()] })
];

// ============================================================
// 6. REFERENCIAS Y ENLACES
// ============================================================
const references = [
  h1('6. Referencias y Enlaces'),
  h2('6.1. Repositorios del proyecto'),
  new Paragraph({
    spacing: { after: 100 },
    children: [
      new TextRun({ text: 'GitLab (principal): ', bold: true }),
      link(GITLAB_URL, GITLAB_URL)
    ]
  }),
  new Paragraph({
    spacing: { after: 200 },
    children: [
      new TextRun({ text: 'GitHub (espejo): ', bold: true }),
      link(GITHUB_URL, GITHUB_URL)
    ]
  }),
  h2('6.2. Documentación oficial consultada'),
  bullet('Git SCM - Branching and Merging: https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell'),
  bullet('Conventional Commits: https://www.conventionalcommits.org/'),
  bullet('GitLab CI/CD Documentation: https://docs.gitlab.com/ee/ci/'),
  bullet('GitHub Actions Documentation: https://docs.github.com/en/actions'),
  bullet('Jest Documentation: https://jestjs.io/docs/getting-started'),
  bullet('Semantic Versioning: https://semver.org/')
];

// ============================================================
// CONSTRUCCIÓN DEL DOCUMENTO
// ============================================================
const doc = new Document({
  creator: STUDENT_NAME,
  title: 'Informe Laboratorio Semana 1 - Buenas prácticas en el uso de Git',
  description: 'Informe del laboratorio de la semana 1 de Desarrollo de Software 4',
  styles: {
    default: {
      document: {
        run: {
          font: 'Calibri',
          size: 22
        },
        paragraph: {
          spacing: { line: 276 }
        }
      },
      heading1: {
        run: { font: 'Calibri', size: 32, bold: true, color: '1F3864' }
      },
      heading2: {
        run: { font: 'Calibri', size: 26, bold: true, color: '2E5496' }
      },
      heading3: {
        run: { font: 'Calibri', size: 22, bold: true, color: '44546A' }
      }
    }
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [
      ...cover,
      ...toc,
      ...intro,
      ...objectives,
      ...practices,
      ...evidence,
      ...conclusions,
      ...references
    ]
  }]
});

// ============================================================
// ESCRITURA DEL ARCHIVO
// ============================================================
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(OUTPUT_FILE, buffer);
  console.log(`\n✓ Informe generado correctamente:`);
  console.log(`  ${OUTPUT_FILE}`);
  console.log(`\nNota: al abrir el documento en Word, haz clic derecho sobre la`);
  console.log(`Tabla de Contenido y selecciona "Actualizar campo" para que se`);
  console.log(`generen los números de página y los enlaces internos.\n`);
}).catch((err) => {
  console.error('\n✗ Error al generar el informe:', err);
  process.exit(1);
});