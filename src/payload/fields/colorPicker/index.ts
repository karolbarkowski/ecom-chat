import type { Field } from 'payload'

export const colorPickerField: Field = {
  name: 'colorPicker',
  type: 'text',
  index: false,
  required: false,
  label: 'Color',
  admin: {
    components: {
      Field: {
        path: '@/payload/fields/colorPicker/ColorPickerComponent#ColorPickerComponent',
      },
      Cell: '@/payload/fields/colorPicker/ColorPickerCell#ColorPickerCell',
    },
  },
}
