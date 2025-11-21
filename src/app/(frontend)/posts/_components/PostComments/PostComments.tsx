import { PostComment } from '@/payload-types'
import { dateToFormattedString } from '@/utilities/text-format'

interface PostCommentsProps {
  comments: (string | PostComment)[]
  postTitle: string
}

export function PostComments({ comments, postTitle }: PostCommentsProps) {
  if (!comments || comments.length === 0) {
    return null
  }

  return (
    <div className="mt-32">
      <h1 className="text-xl uppercase tracking-logo mb-2 text-center">
        {comments.length} replies to &quot;{postTitle}&quot;
      </h1>

      <div className="space-y-6 divide-y divide-savoy-border">
        {comments
          .filter((comment): comment is PostComment => typeof comment === 'object')
          .map((comment, index) => {
            const userName = typeof comment.user === 'object' ? comment.user.name : comment.user
            return (
              <div key={index} className=" py-4 ">
                <h3 className="text-md uppercase">{userName}</h3>
                <p className="text-xs text-savoy-text-light">
                  {dateToFormattedString(comment.createdAt)}
                </p>
                <p className="text-xsmtext-savoy-text mt-2">{comment.content}</p>
              </div>
            )
          })}
      </div>
    </div>
  )
}
