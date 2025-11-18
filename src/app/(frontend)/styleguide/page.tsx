import React from 'react'

export default function StyleGuidePage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12">
      {/* Page Title */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl tracking-logo uppercase mb-4">Typography Styleguide</h1>
        <p className="text-savoy-text-light text-base">
          A collection of header styles and typographic elements
        </p>
      </div>

      {/* Section: Display Headings */}
      <section className="mb-20 pb-20 border-b border-savoy-border">
        <div className="mb-12 text-center">
          <h2 className="text-xs uppercase tracking-wider text-savoy-text-light mb-2">
            Display Headings
          </h2>
          <p className="text-sm text-savoy-text-lighter">Large format headings for hero sections</p>
        </div>

        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-6xl tracking-wide uppercase mb-2">Minimalist Design</h1>
            <p className="text-sm text-savoy-text-light">60px / Uppercase / Wide tracking</p>
          </div>

          <div className="text-center">
            <h1 className="text-5xl tracking-wider uppercase mb-2">Elegant Fashion</h1>
            <p className="text-sm text-savoy-text-light">48px / Uppercase / Wider tracking</p>
          </div>

          <div className="text-center">
            <h1 className="text-4xl tracking-logo uppercase mb-2">Modern Luxury</h1>
            <p className="text-sm text-savoy-text-light">
              36px / Uppercase / Logo tracking (0.25em)
            </p>
          </div>
        </div>
      </section>

      {/* Section: Page Headings */}
      <section className="mb-20 pb-20 border-b border-savoy-border">
        <div className="mb-12 text-center">
          <h2 className="text-xs uppercase tracking-wider text-savoy-text-light mb-2">
            Page Headings
          </h2>
          <p className="text-sm text-savoy-text-lighter">Main page title variations</p>
        </div>

        <div className="space-y-12">
          {/* Centered with underline */}
          <div className="text-center">
            <h1 className="text-3xl uppercase tracking-wider inline-block border-b-2 border-savoy-text pb-2 mb-3">
              Collection Title
            </h1>
            <p className="text-sm text-savoy-text-light">Centered / Uppercase / Bottom border</p>
          </div>

          {/* With subtitle */}
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider text-savoy-text-light mb-2">
              Spring 2024
            </p>
            <h1 className="text-3xl uppercase tracking-wide mb-2">New Arrivals</h1>
            <p className="text-sm text-savoy-text-light">With category label</p>
          </div>

          {/* Minimalist */}
          <div className="text-center">
            <h1 className="text-2xl uppercase tracking-logo mb-2">Shop All</h1>
            <p className="text-sm text-savoy-text-light">Simple / Clean / Maximum tracking</p>
          </div>

          {/* Left aligned */}
          <div>
            <h1 className="text-3xl uppercase tracking-wide mb-2">Our Products</h1>
            <p className="text-sm text-savoy-text-light">Left aligned variant</p>
          </div>
        </div>
      </section>

      {/* Section: Section Headings */}
      <section className="mb-20 pb-20 border-b border-savoy-border">
        <div className="mb-12 text-center">
          <h2 className="text-xs uppercase tracking-wider text-savoy-text-light mb-2">
            Section Headings
          </h2>
          <p className="text-sm text-savoy-text-lighter">For content sections and blocks</p>
        </div>

        <div className="space-y-10">
          <div>
            <h2 className="text-2xl uppercase tracking-wide mb-2">Featured Collection</h2>
            <p className="text-sm text-savoy-text-light">24px / H2 heading</p>
          </div>

          <div>
            <h2 className="text-xl uppercase tracking-wider mb-2">Best Sellers</h2>
            <p className="text-sm text-savoy-text-light">20px / H2 heading / Extra tracking</p>
          </div>

          <div className="text-center">
            <h2 className="text-lg uppercase tracking-logo mb-2">Customer Reviews</h2>
            <p className="text-sm text-savoy-text-light">18px / Centered / Maximum tracking</p>
          </div>

          <div>
            <h3 className="text-base uppercase tracking-wide mb-2 text-savoy-text-light">
              Related Items
            </h3>
            <p className="text-sm text-savoy-text-light">16px / H3 heading / Lighter color</p>
          </div>
        </div>
      </section>

      {/* Section: Product Headings */}
      <section className="mb-20 pb-20 border-b border-savoy-border">
        <div className="mb-12 text-center">
          <h2 className="text-xs uppercase tracking-wider text-savoy-text-light mb-2">
            Product Headings
          </h2>
          <p className="text-sm text-savoy-text-lighter">Product title variations</p>
        </div>

        <div className="space-y-10">
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider text-savoy-text-lighter mb-2">
              Premium Collection
            </p>
            <h1 className="text-3xl tracking-wide mb-3">Cashmere Sweater</h1>
            <p className="text-lg text-savoy-accent-orange">$249.00</p>
            <p className="text-sm text-savoy-text-light mt-4">Product page title with price</p>
          </div>

          <div>
            <h3 className="text-md uppercase tracking-wide mb-1">Wool Coat</h3>
            <p className="text-lg text-savoy-text">$199.00</p>
            <p className="text-sm text-savoy-text-light mt-4">Product card title</p>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-wider mb-1 text-savoy-text">
              Leather Handbag
            </h3>
            <p className="text-base text-savoy-text-light">$329.00</p>
            <p className="text-sm text-savoy-text-light mt-4">Compact product card</p>
          </div>
        </div>
      </section>

      {/* Section: Decorative Headers */}
      <section className="mb-20 pb-20 border-b border-savoy-border">
        <div className="mb-12 text-center">
          <h2 className="text-xs uppercase tracking-wider text-savoy-text-light mb-2">
            Decorative Headers
          </h2>
          <p className="text-sm text-savoy-text-lighter">
            Headers with decorative elements and dividers
          </p>
        </div>

        <div className="space-y-16">
          {/* With side lines */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-savoy-border"></div>
            <h2 className="text-xl uppercase tracking-logo">Featured</h2>
            <div className="flex-1 h-px bg-savoy-border"></div>
          </div>

          {/* With accent line */}
          <div className="text-center">
            <h2 className="text-2xl uppercase tracking-wide mb-4">Latest Trends</h2>
            <div className="w-16 h-0.5 bg-savoy-accent-orange mx-auto"></div>
          </div>

          {/* With dotted divider */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-savoy-text-light"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-savoy-text-light"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-savoy-text-light"></span>
            </div>
            <h2 className="text-xl uppercase tracking-wider">Handpicked Selection</h2>
          </div>

          {/* Bordered box */}
          <div className="border border-savoy-border p-8 text-center">
            <p className="text-xs uppercase tracking-wider text-savoy-text-lighter mb-2">
              Exclusive
            </p>
            <h2 className="text-2xl uppercase tracking-wide">Limited Edition</h2>
          </div>

          {/* With background */}
          <div className="bg-savoy-card p-12 text-center">
            <h2 className="text-3xl uppercase tracking-logo mb-3">Sale</h2>
            <p className="text-base text-savoy-text-light">Up to 50% off selected items</p>
          </div>
        </div>
      </section>

      {/* Section: Category Headers */}
      <section className="mb-20 pb-20 border-b border-savoy-border">
        <div className="mb-12 text-center">
          <h2 className="text-xs uppercase tracking-wider text-savoy-text-light mb-2">
            Category Headers
          </h2>
          <p className="text-sm text-savoy-text-lighter">Navigation and filter headings</p>
        </div>

        <div className="space-y-8">
          <div>
            <h4 className="text-xs uppercase tracking-wider text-savoy-text-light mb-4">
              Shop by Category
            </h4>
            <div className="flex gap-6 flex-wrap">
              <a href="#" className="text-base uppercase tracking-wide hover:text-savoy-text-light">
                Women
              </a>
              <a href="#" className="text-base uppercase tracking-wide hover:text-savoy-text-light">
                Men
              </a>
              <a href="#" className="text-base uppercase tracking-wide hover:text-savoy-text-light">
                Accessories
              </a>
              <a href="#" className="text-base uppercase tracking-wide hover:text-savoy-text-light">
                Sale
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-wide mb-4">Filter By</h4>
            <div className="space-y-2">
              <div className="text-base text-savoy-text-light">Size</div>
              <div className="text-base text-savoy-text-light">Color</div>
              <div className="text-base text-savoy-text-light">Price Range</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Content Headers */}
      <section className="mb-20">
        <div className="mb-12 text-center">
          <h2 className="text-xs uppercase tracking-wider text-savoy-text-light mb-2">
            Content Headers
          </h2>
          <p className="text-sm text-savoy-text-lighter">Blog posts and editorial content</p>
        </div>

        <div className="space-y-12">
          {/* Blog post style */}
          <div>
            <p className="text-xs uppercase tracking-wider text-savoy-text-lighter mb-2">
              Fashion / March 15, 2024
            </p>
            <h1 className="text-3xl tracking-tight mb-3">The Art of Minimalist Wardrobe</h1>
            <p className="text-base text-savoy-text-light leading-relaxed">
              Discover how to build a timeless collection with essential pieces
            </p>
          </div>

          {/* Editorial style */}
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl uppercase tracking-logo mb-6">Sustainability Matters</h2>
            <p className="text-base text-savoy-text-light leading-relaxed">
              We believe in creating beautiful products that respect our planet. Every piece in our
              collection is thoughtfully crafted using sustainable materials and ethical production
              methods.
            </p>
          </div>

          {/* Quote style */}
          <div className="border-l-2 border-savoy-accent-orange pl-8 py-4">
            <h3 className="text-xl italic mb-2">
              &quot;Less is more when it comes to timeless style&quot;
            </h3>
            <p className="text-sm uppercase tracking-wide text-savoy-text-light">
              — Design Philosophy
            </p>
          </div>
        </div>
      </section>

      {/* Footer note */}
      <div className="text-center pt-12 border-t border-savoy-border">
        <p className="text-xs uppercase tracking-wider text-savoy-text-lighter">
          End of Styleguide
        </p>
      </div>
    </div>
  )
}
