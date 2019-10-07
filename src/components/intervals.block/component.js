import Component from "../../core/components";
import {observer, store} from "../../store";
import actions from "../all-actions";
import {Delivery} from "../../core/main";
import template from './template.html';

import Utils from '../../core/utils';




class IntervalsBlock extends Component {
    constructor() {
        super('#delivery-intervals', template);
        this._data = [];
    }

    setEvents(callback) {
        document.querySelector('#delievery-date-input').addEventListener('change',function (e) {
            store.dispatch(actions.selectIntervalsDate(e.target.value));
        });
        document.querySelector('#delievery-time-input').addEventListener('change',function (e) {
            store.dispatch(actions.selectIntervalsTime(e.target.value));
        });

    }

    date(date){
        let format = (num)=>{
            if(num<=9)
                return `0${num}`;
            else
                return num;
        };
        let day = (num)=>{
            let day = ''
            switch(num){
                case 0:
                    day = "Воскр.";
                    break;
                case 1:
                    day = "Пн.";
                    break;
                case 2:
                    day = "Вт.";
                    break;
                case 3:
                    day = "Ср.";
                    break;
                case 4:
                    day = "Чт.";
                    break;
                case 5:
                    day = "Пт.";
                    break;
                case 6:
                    day = "Суб.";
                    break;
            }
            return day;
        };
        return `${day(date.getDay())} ${format(date.getDate())}.${format(date.getMonth()+1)}.${date.getFullYear()}`;
    }

    prepareParams() {
        this._data = JSON.parse(JSON.stringify(this.params));
        let prepare = this.params.map((element,index)=>{
            let date  = this.date(new Date(element.date));
            element.index = index;
            element.date = date;
            return element;
        });
        this.params = {};
        this.params.schedule = prepare;
    }


    observer(){
        observer.addObserver((state,prevState)=> {
            let s = state['intervalsBlock'];
            if (observer.deactivated('intervalsBlock', state))
                this.clear();
            else if (s.visibility && !prevState['intervalsBlock'].visibility)
                this.update(s.data);
            else {
                if(s.visibility)
                {
                    let update = false;
                    s.data.forEach((el,index)=>{
                        if(el.selected != prevState['intervalsBlock'].data.selected)
                            update =true;
                    });
                    if(update);
                        this.update(s.data);
                }
            }
        });
    }

}

export {IntervalsBlock};