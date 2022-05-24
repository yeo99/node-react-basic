// 스토어에 Reducer가 여러가지 있을 수 있는데, Reducer는 어떻게 state가 변하는지를 보여주고, return한다.
// CombineReducers를 이용해서 Root Reducer에서 하나로 합쳐줌
import { combineReducers } from "redux";
// import user from './user_reducer';

const rootReducer = combineReducers({

})

export default rootReducer;