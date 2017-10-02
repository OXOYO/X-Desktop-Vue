/**
 * Created by OXOYO on 2017/10/2.
 */

import state from './state'
import actions from './actions'
import mutations from './mutations'

export default {
  moduleName: 'Apps',
  store: {
    namespaced: true,
    state,
    actions,
    mutations
  }
}
