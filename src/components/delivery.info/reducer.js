import {handleActions} from "redux-actions";
import actions from './actions';

const reducer = handleActions(
    new Map([
        [
            actions.showDeliveryInfo,
            (state,action)=>{
                // console.log('DELIVERY_INFO_SHOW');
                state.data = action.payload;
                state.visibility = true;
                return state;
            }
        ],
        [
            actions.removeDeliveryInfo,
            (state)=>{
                // console.log('DELIVERY_INFO_REMOVE');
                state.data = {};
                state.visibility = false;
                return state;
            }
        ],
    ]),
    {
        visibility: false,
        data: {

        }
    }
);

export {reducer};