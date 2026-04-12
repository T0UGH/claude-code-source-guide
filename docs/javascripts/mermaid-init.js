document$.subscribe(function () {
  if (typeof mermaid === 'undefined') return

  const theme = document.body.getAttribute('data-md-color-scheme') === 'slate' ? 'dark' : 'default'
  const diagramNodes = Array.from(document.querySelectorAll('.mermaid')).filter((element) =>
    /^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|journey|gantt|pie|mindmap|timeline|quadrantChart|gitGraph|sankey-beta|requirementDiagram|block-beta|C4Context|C4Container|C4Component|C4Dynamic|C4Deployment|zenuml|xychart-beta)/m.test(
      element.textContent.trim()
    )
  )

  if (!diagramNodes.length) return

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    theme,
    themeVariables: {
      fontSize: '18px'
    },
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true,
      nodeSpacing: 36,
      rankSpacing: 48
    }
  })

  mermaid.run({ nodes: diagramNodes }).catch(() => {})
})
