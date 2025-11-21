# Email Templates

This directory contains MJML email templates and utilities for sending transactional emails.

## Overview

MJML (Mailjet Markup Language) is used to create responsive email templates that work across all email clients. The templates use the same design system as the main application for brand consistency.

## Design System

The email templates use the following styles from your application:

- **Colors:**
  - Primary Text: `#2D2D2D`
  - Light Text: `#808080`
  - Lighter Text: `#999999`
  - Accent: `#D4A574` (golden/orange)
  - Background: `#FFFFFF`
  - Card Background: `#F5F5F5`
  - Border: `#E5E5E5`

- **Typography:**
  - Font Family: 'Unna', serif
  - Font Sizes: 11px - 18px (matching your app)
  - Letter Spacing: 0.05em - 0.25em (clean, minimal look)

## Directory Structure

```
src/emails/
├── templates/           # MJML template files
│   └── negative-comment.mjml
├── utils/              # Utility functions
│   └── compile-mjml.ts
├── send-negative-comment-notification.ts
├── example-usage.ts
└── README.md
```

## Available Templates

### Negative Comment Notification

**File:** `templates/negative-comment.mjml`

Sends an alert when a negative comment is detected on the website.

**Variables:**
- `productName` - Name of the product
- `authorName` - Comment author name
- `commentContent` - The comment text
- `timestamp` - Formatted date/time
- `moderationLink` - Link to review the comment
- `unsubscribeLink` - Link to manage preferences

## Usage

### Basic Usage

```typescript
import { sendNegativeCommentNotification } from '@/emails/send-negative-comment-notification'

await sendNegativeCommentNotification({
  productName: 'Elegant Summer Dress',
  productSlug: 'elegant-summer-dress',
  authorName: 'Jane Doe',
  commentContent: 'Very disappointed with the quality...',
  commentId: '507f1f77bcf86cd799439011',
  recipientEmail: 'admin@yourstore.com',
})
```

### Creating New Templates

1. Create a new `.mjml` file in `templates/`
2. Use the existing template as a reference for styling
3. Add template variables using `{{variableName}}` syntax
4. Create a corresponding TypeScript function in `utils/compile-mjml.ts`

Example:

```typescript
export interface MyTemplateData {
  userName: string
  message: string
}

export function generateMyTemplateEmail(data: MyTemplateData): string {
  return compileMjmlTemplate('my-template', data)
}
```

## Testing Templates

You can preview MJML templates online at [MJML Playground](https://mjml.io/try-it-live) or use the MJML CLI:

```bash
# Install MJML CLI globally
npm install -g mjml

# Compile a template to HTML
mjml src/emails/templates/negative-comment.mjml -o output.html
```

## Integration with Sentiment Analysis

See [example-usage.ts](./example-usage.ts) for how to integrate with your sentiment analysis workflow.

## Environment Variables

Make sure to set the following environment variables:

- `NEXT_PUBLIC_SERVER_URL` - Base URL for links in emails (e.g., `https://yourstore.com`)

## Notes

- All emails are sent through Payload CMS's email adapter
- The current setup uses `@payloadcms/email-nodemailer`
- Templates automatically compile MJML to HTML at runtime
- Variable replacement happens before MJML compilation
