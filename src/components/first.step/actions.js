import {createActions} from 'redux-actions';

const actions = createActions({
    firstStepInit: payload=>payload,
    cityAdd: [
        payload=>payload,
        (payload,meta)=>Object.assign({city : payload},meta)
    ],
    cityRemove: null,
    nameAdd: payload=>{
        return {name: payload}
    },
    emailAdd: payload=>{
        return {email: payload}
    },
    phoneAdd: payload=>{
        return {phone: payload}
    },
    phoneError : payload => payload,
    disablePhoneError: null,
    emailError : payload => payload,
    disableEmailError: null,
    nameError : payload => payload,
    disableNameError: null,
});

export default actions