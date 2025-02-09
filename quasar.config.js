import { defineConfig } from '#q-app/wrappers'
import path from 'path'

export default defineConfig((ctx) => {
  console.log(ctx)
  return {
      dev: true,
      prod: false,
      mode: { spa: true },
      modeName: 'spa',
      target: {},
      targetName: undefined,
      arch: {},
      archName: undefined,
      debug: undefined,
      extras: [
        'material-icons',
        'mdi-v7'
      ],
      framework: {
        iconSet: 'mdi-v7',
        plugins: [
          'Loading',
          'Dialog'
        ]
      },
      build: {
        sassVariables: 'src/styles/quasar.variables.scss',
        alias: {
          '@': path.resolve(__dirname, 'src'),
          '@components': path.resolve(__dirname, 'src/components'),
          '@assets': path.resolve(__dirname, 'src/assets'),
          '@views': path.resolve(__dirname, 'src/views'),
          '@store': path.resolve(__dirname, 'src/store')
        },
        loaderOptions: {
          scss: {
            additionalData: `@use 'sass:color';`
          }
        }
      }      
  }
})