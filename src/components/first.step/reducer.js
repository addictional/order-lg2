import {handleActions} from "redux-actions";
import {User,Delivery} from '../../core/main'
import actions from './actions';

const reducer = handleActions(
    new Map([
        [
            actions.firstStepInit,
            (state,action)=>{
                // console.log('FIRST_STEP_INIT');
                state.data = { ...state.data ,...action.payload};
                state.visibility = true;
                return state;
            }
        ],
        [
            actions.cityAdd,
            (state,action)=>{
                // console.log('CITY_ADD');
                state.data = { ...state.data ,...action.payload};
                state.visibility = true;
                return state;
            }
        ],
        [
            actions.cityRemove,
            (state,action)=>{
                // console.log('CITY_REMOVE');
                Delivery.city = '';
                state.data.city = '';
                state.visibility = true;
                return state;
            }
        ],
        [
            actions.nameAdd,
            (state,action)=>{
                // console.log('NAME_ADD');
                User.name = action.payload.name;
                state.data = { ...state.data ,...action.payload};
                state.visibility = true;
                return state;
            }
        ],
        [
            actions.emailAdd,
            (state,action)=>{
                // console.log('EMAIL_ADD');
                User.email = action.payload.email;
                state.data.emailError  = false;
                state.data = { ...state.data ,...action.payload};
                state.visibility = true;
                return state;
            }
        ],
        [
            actions.phoneAdd,
            (state,action)=>{
                // console.log('PHONE_ADD');
                User.phone = action.payload.phone;
                state.data = { ...state.data ,...action.payload};
                state.visibility = true;
                return state;
            }
        ],
        [
            actions.phoneError,
            (state,action)=>{
                // console.log('ERROR');
                state.error = true;
                state.data.phoneError  = action.payload;
                return state;
            }
        ],
        [
            actions.disablePhoneError,
            (state)=>{
                console.log('DISABLE ERROR');
                state.error = false;
                state.data.phoneError  = false;
                return state;
            }
        ],
        [
            actions.emailError,
            (state,action)=>{
                console.log('ERROR');
                state.error = true;
                state.data.emailError  = action.payload;
                return state;
            }
        ],
        [
            actions.disableEmailError,
            (state)=>{
                console.log('DISABLE ERROR');
                state.error = false;
                state.data.emailError  = false;
                return state;
            }
        ],
        [
            actions.nameError,
            (state,action)=>{
                console.log('ERROR');
                state.error = true;
                state.data.nameError  = action.payload;
                return state;
            }
        ],
        [
            actions.disableNameError,
            (state)=>{
                console.log('DISABLE ERROR');
                state.error = false;
                state.data.nameError  = false;
                return state;
            }
        ]
    ]),
    {
        visibility: false,
        error: false,
        data: {
            emailError  : false,
            nameError : false,
            phoneError: false,
        }
    }
);

export {reducer};

