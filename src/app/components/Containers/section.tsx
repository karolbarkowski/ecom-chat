import React, { ReactNode } from 'react'
import { cn } from '@/utilities/cn'

type SectionProps = {
  className?: string
  children: ReactNode
}

type SectionHeaderProps = {
  children: ReactNode
}

type SectionContentProps = {
  children: ReactNode
}

const Section: React.FC<SectionProps> & {
  Header: React.FC<SectionHeaderProps>
  Content: React.FC<SectionContentProps>
} = ({ className, children }) => {
  // Initialize arrays to hold header(s) and content
  const headers: ReactNode[] = []
  let content: ReactNode | null = null

  // group children into headers and content
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return

    switch (child.type) {
      case SectionHeader:
        headers.push(child)
        break
      case SectionContent:
        content = child
        break
    }
  })

  return (
    <section className={cn('flex flex-col', className)}>
      {headers && (
        <header className="flex max-md:flex-wrap justify-between items-center gap-8 w-full max-md:max-w-full whitespace-nowrap">
          {headers.map((header, index) => (
            <React.Fragment key={index}>
              {header}
              {(headers.length == 1 || index < headers.length - 1) && (
                <div className="flex border-gray-200 border-t w-full h-px"></div>
              )}
            </React.Fragment>
          ))}
        </header>
      )}
      {content && <div>{content}</div>}
    </section>
  )
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ children }) => children
SectionHeader.displayName = 'SectionHeader'

const SectionContent: React.FC<SectionContentProps> = ({ children }) => children
SectionContent.displayName = 'SectionContent'

Section.Header = SectionHeader
Section.Content = SectionContent

export default Section
