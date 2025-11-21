import mjml2html from 'mjml'
import fs from 'fs'
import path from 'path'

/**
 * Compile an MJML template to HTML
 * @param templateName - Name of the template file (without .mjml extension)
 * @param variables - Object containing template variables to replace
 * @returns Compiled HTML string
 */
export function compileMjmlTemplate(
  templateName: string,
  variables: Record<string, string>,
): string {
  const templatePath = path.join(
    process.cwd(),
    'src',
    'emails',
    'templates',
    `${templateName}.mjml`,
  )

  // Read the MJML template
  let mjmlContent = fs.readFileSync(templatePath, 'utf8')

  // Replace variables in the template
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g')
    mjmlContent = mjmlContent.replace(regex, value)
  })

  // Compile MJML to HTML
  const { html, errors } = mjml2html(mjmlContent, {
    validationLevel: 'soft',
  })

  if (errors && errors.length > 0) {
    console.error('MJML compilation errors:', errors)
  }

  return html
}

/**
 * Template variable types for negative comment email
 */
export interface NegativeCommentEmailData {
  commentContent: string
  moderationLink: string
}

/**
 * Generate HTML for negative comment notification email
 */
export function generateNegativeCommentEmail(data: NegativeCommentEmailData): string {
  return compileMjmlTemplate('negative-comment', {
    commentContent: data.commentContent,
    moderationLink: data.moderationLink,
  })
}
