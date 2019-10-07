import {handleActions} from "redux-actions";
import actions from './actions';
import {Delivery} from "../../core/main";

const reducer = handleActions(
    new Map([
        [
            actions.showIntervals,
            (state,action)=>{
                // console.log('SHOW_INTERVALS');
                console.log(Delivery.method.selectedTime);
                state.data = action.payload.map((element,ind)=>{
                    element.selected = ind == (Delivery.method.selectedDate == null ? 0: state.dateSelected);
                    if(element.selected && Delivery.method.selectedDate == null)
                    {
                        Delivery.method.selectedDate = element.date.toISOString().slice(0,10);
                        state.dateSelected = ind;
                    }
                    element.intervals = element.intervals.map((el,index)=>{
                        el.selected = index == (Delivery.method.selectedTime == null ? 0 : state.timeSelected);
                        if(el.selected && Delivery.method.selectedTime == null)
                        {
                            state.timeSelected = index;
                            Delivery.method.selectedTime = el.value;
                        }
                        return el;
                    });
                    return element;
                });
                // console.log('SHOW_INTERVALS',JSON.parse(JSON.stringify(state)),action)
                state.visibility = true;
                return state;
            }
        ],
        [
            actions.removeIntervals,
            (state)=>{
                // console.log('REMOVE_INTERVALS');
                state.data = {};
                state.visibility = false;

                return state;
            }
        ],
        [
            actions.selectIntervalsDate,
            (state,action)=>{
                // console.log('SELECT_INTERVALS_DATE',state,action);
                console.log(state.selected);
                state.dateSelected = action.payload;
                state.data = state.data.map((element,ind)=>{
                        element.selected = action.payload == ind;
                    if(element.selected)
                        Delivery.method.selectedDate = element.date.toISOString().slice(0,10);
                    element.intervals = element.intervals.map((el,index)=>{
                        el.selected = index === 0;
                        return el;
                    });
                    return element;
                });
                // console.log('SELECT_INTERVALS_DATE',state,action);
                return state;
            }
        ],
        [
            actions.selectIntervalsTime,
            (state,action)=>{
                // console.log('SELECT_INTERVALS_TIME');
                state.timeSelected = action.payload;
                Delivery.method.selectedTime = state.data[state.dateSelected]
                    .intervals[action.payload].value;
                state.data = state.data.map((element,ind)=>{
                    element.selected = state.dateSelected == ind;
                    element.intervals = element.intervals.map((el,index)=>{
                        el.selected = index == action.payload;
                        return el;
                    });
                    return element;
                });
                return state;
            }
        ],
    ]),
    {
        visibility: false,
        data: {

        },
        dateSelected : null,
        timeSelected : null
    }
);

export {reducer};