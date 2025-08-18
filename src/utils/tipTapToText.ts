export function tipTapToText(content?: string): string {
  if (!content) return ""

  try {
    const doc = JSON.parse(content)

    const extractText = (nodes: any[], depth = 0): string => {
      return nodes
        .map((node) => {
          switch (node.type) {
            case "paragraph":
              return extractText(node.content || []) + "\n\n"
            case "heading":
              const level = node.attrs?.level || 1
              return (
                "#".repeat(level) +
                " " +
                extractText(node.content || []) +
                "\n\n"
              )
            case "bulletList":
              return extractText(node.content || [], depth + 1)
            case "orderedList":
              return extractText(node.content || [], depth + 1)
            case "listItem":
              const prefix =
                node.parent?.type === "orderedList" ? `${depth}. ` : "- "
              return prefix + extractText(node.content || []) + "\n"
            case "horizontalRule":
              return "---\n\n"
            case "text":
              return node.text || ""
            default:
              return extractText(node.content || [])
          }
        })
        .join("")
    }

    return extractText(doc.content || []).trim()
  } catch (err) {
    return ""
  }
}
