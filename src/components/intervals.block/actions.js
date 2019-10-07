import {createActions} from 'redux-actions';

const actions = createActions({
    showIntervals: payload=>payload,
    removeIntervals: null,
    selectIntervalsDate: payload => payload,
    selectIntervalsTime: payload => payload
});

export default actions;