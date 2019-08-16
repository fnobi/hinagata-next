import { combineReducers } from 'redux'
import sampleReducer, { SampleState } from './sampleReducer'

export interface State {
  sampleReducer: SampleState
}

export default combineReducers({
  sampleReducer
})
