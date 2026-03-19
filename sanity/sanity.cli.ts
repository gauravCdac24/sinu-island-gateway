import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'xha46ejg',
    dataset: 'sinu_website'
  },
  server: {
    "hostname": '0.0.0.0',
    "port": 3333
  },
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
})
