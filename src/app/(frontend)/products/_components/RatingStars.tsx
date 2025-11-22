import { Review } from '@/payload-types'

interface RatingStarsProps {
  rating: Review['rating'] | number
  count?: number
}

export const RatingStars = ({ rating, count }: RatingStarsProps) => {
  const ratingValue = typeof rating === 'string' ? parseFloat(rating) : rating
  const clampedRating = Math.min(Math.max(ratingValue, 0), 5)

  const getStarFillPercentage = (index: number): number => {
    if (clampedRating >= index + 1) return 100
    if (clampedRating > index) return (clampedRating - index) * 100
    return 0
  }

  return (
    <div className="flex  items-center gap-x-1 text-gray-400 text-sm">
      <div className="flex">
        {[...Array(5)].map((_, index) => {
          const fillPercentage = getStarFillPercentage(index)
          const gradientId = `star-gradient-${index}-${fillPercentage}`

          return (
            <svg
              key={index}
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <defs>
                <linearGradient id={gradientId}>
                  <stop offset={`${fillPercentage}%`} stopColor="#d4a574" />
                  <stop offset={`${fillPercentage}%`} stopColor="#d9d9d9" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#${gradientId})`}
                d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
              />
            </svg>
          )
        })}
      </div>
      {count && <span>by {count} users</span>}
    </div>
  )
}
