/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

interface ProductImageGalleryProps {
  images: Array<{ url: string; id?: string | null }>
  productTitle: string
  discountPercentage: number
}

export function ProductImageGallery({
  images,
  productTitle,
  discountPercentage,
}: ProductImageGalleryProps) {
  const [nav1, setNav1] = React.useState<Slider | null>(null)
  const [nav2, setNav2] = React.useState<Slider | null>(null)
  const sliderRef1 = React.useRef<Slider>(null)
  const sliderRef2 = React.useRef<Slider>(null)

  React.useEffect(() => {
    setNav1(sliderRef1.current)
    setNav2(sliderRef2.current)
  }, [])

  const mainSliderSettings = {
    asNavFor: nav2 || undefined,
    ref: sliderRef1,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
    adaptiveHeight: false,
    infinite: true,
    speed: 500,
  }

  const thumbnailSliderSettings = {
    asNavFor: nav1 || undefined,
    ref: sliderRef2,
    slidesToShow: 4,
    slidesToScroll: 1,
    focusOnSelect: true,
    infinite: true,
    arrows: false,
    centerMode: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  }

  if (!images || images.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Main Image Slider */}
      <div className="relative  overflow-hidden">
        <Slider {...mainSliderSettings}>
          {images.map((image, index) => (
            <div key={image.id || index} className="relative">
              <img
                src={image.url}
                alt={`${productTitle} - View ${index + 1}`}
                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl"
              />
            </div>
          ))}
        </Slider>
        {discountPercentage > 0 && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-savoy-accent-orange text-white px-3 py-1 rounded-full text-sm  shadow-lg">
              - {discountPercentage}%
            </span>
          </div>
        )}
      </div>

      {/* Thumbnail Navigation Slider */}
      {images.length > 1 && (
        <div className="thumbnail-slider">
          <Slider {...thumbnailSliderSettings}>
            {images.map((image, index) => (
              <div key={image.id || index} className="px-1.5">
                <div className="w-full h-20 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ">
                  <img
                    src={image.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}

      <style jsx global>{`
        .slick-slider {
          position: relative;
        }

        .slick-prev,
        .slick-next {
          z-index: 10;
          width: 40px;
          height: 40px;
        }

        .slick-prev {
          left: 20px;
        }

        .slick-next {
          right: 20px;
        }

        .slick-prev:before,
        .slick-next:before {
          font-size: 40px;
          opacity: 0.75;
          color: white;
        }

        .slick-prev:hover:before,
        .slick-next:hover:before {
          opacity: 1;
        }

        .slick-current .slick-slide > div > div {
          opacity: 1 !important;
        }

        .thumbnail-slider .slick-slide > div > div {
          opacity: 0.7;
        }

        .thumbnail-slider .slick-slide > div > div:hover {
          opacity: 1;
        }

        .slick-dots {
          bottom: 20px;
        }

        .slick-dots li button:before {
          color: white;
          opacity: 0.5;
          font-size: 12px;
        }
      `}</style>
    </div>
  )
}
