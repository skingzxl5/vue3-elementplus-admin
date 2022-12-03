import { createStore, createLogger } from 'vuex';
import getters from './getters'

const files = require.context('./modules', false, /\.js$/)
const modules = {}
files.keys().forEach((key) => {
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})
Object.keys(modules).forEach((key) => {
  modules[key]['namespaced'] = true
})

const debug = process.env.NODE_ENV !== 'production'

export const store = createStore({
  modules,
  getters,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})

export function useStore() {
  return store;
}


export function loadStore(app) {
  app.use(store)
  return store;
}

export default store;