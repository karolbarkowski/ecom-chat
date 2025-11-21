import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { generateNegativeCommentEmail } from './utils/compile-mjml'

export interface CommentNotificationData {
  commentContent: string
  commentId: string
}

/**
 * Send email notification for negative comment detection
 */
export async function sendNegativeCommentNotification(
  data: CommentNotificationData,
): Promise<void> {
  const payload = await getPayload({ config: configPromise })

  // Generate moderation link (adjust base URL as needed)
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const moderationLink = `${baseUrl}/admin/collections/post-comments/${data.commentId}`

  // Compile the MJML template to HTML
  const htmlContent = generateNegativeCommentEmail({
    commentContent: data.commentContent,
    moderationLink,
  })

  // Send the email
  await payload.sendEmail({
    to: 'karol.barkowski@gmail.com',
    subject: `⚠️ Negative Comment Detected`,
    html: htmlContent,
  })
}
