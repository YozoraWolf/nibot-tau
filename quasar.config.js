import { defineConfig } from '#q-app/wrappers'

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
      build: {
        sassVariables: 'src/styles/quasar.variables.scss'
      }      
  }
})