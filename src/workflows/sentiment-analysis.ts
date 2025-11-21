import { sendNegativeCommentNotification } from './../emails/send-negative-comment-notification'

export async function sentimentAnalysis(
  commentId: string,
  commentContent: string,
): Promise<1 | 0 | -1> {
  // For simplicity, let's assume any comment containing the word "bad" is negative
  if (commentContent.toLowerCase().includes('bad')) {
    // Send notification for negative comment
    await sendNegativeCommentNotification({
      commentContent,
      commentId,
    })
    return -1
  }

  return 1
}
