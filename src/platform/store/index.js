/**
 * Created by OXOYO on 2017/9/30.
 */

import state from './state'
import actions from './actions'
import mutations from './mutations'

export default {
  moduleName: 'Platform',
  store: {
    namespaced: true,
    state,
    actions,
    mutations
  }
}
