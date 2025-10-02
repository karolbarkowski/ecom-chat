import CenterSportImportUI from './CenterSport/UI'
import { Gutter } from '@payloadcms/ui'
import React from 'react'
import Tramp4ImportUI from './Tramp4/UI'

const ImportsAdminView = () => {
  return (
    <Gutter>
      <Tramp4ImportUI />
      <CenterSportImportUI />
    </Gutter>
  )
}

export default ImportsAdminView
