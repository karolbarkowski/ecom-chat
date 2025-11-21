import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function sentimentAnalysis(content: string): Promise<1 | 0 | -1> {
  const payload = await getPayload({ config: configPromise })

  await payload.sendEmail({
    to: 'karol.barkowski@gmail.com',
    subject: 'Test Email',
    text: 'This is a test email from Payload CMS!',
    html: '<p>This is a <strong>test email</strong> from Payload CMS!</p>',
  })

  return 1
}
