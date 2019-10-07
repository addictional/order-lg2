import Component from "../../core/components";
import {observer, store} from "../../store";
import actions from "../all-actions";
import { User,Order,App} from "../../core/main";
import template from './template.html';

import Utils from '../../core/utils';
import IMask from "imask";



class AddBonusCardBlock extends Component {
    constructor() {
        super('#add-bonus-card', template);
    }

    setEvents(callback) {
        let button  = document.querySelector('[name="i-want-to-get-a-bonus-card"]'),
            input = document.querySelector('#bonus-card-to-points'),
            mask = IMask(input,{
                mask: '0000000000000000000'
            });
        if(!Utils.empty(button))
        {
            button.addEventListener('click',()=>{
                console.log(Order);
                Order.addBonusCard();
            });
        }
        mask.on("accept", function () {
            if(mask.value.length == 19){
                $.ajax({
                    url: App.params.ajaxUrl,
                    data: {
                        method : 'checkCard',
                        pan: mask.value
                    },
                    dataType: 'json'
                })
                    .then((data)=>{
                        if(data.error)
                            AddBonusCardBlock.throwError(data.error.code);
                    })
                    .catch((error)=>{
                        if(!App.ajaxBadRequest(error.status))
                        {
                            AddBonusCardBlock.throwError(code);
                        }
                    });
            }
        });

    }


    /**
     *
     * @param error
     * codes:
     * <ol>
     *     <li>1 : toShort</li>
     *     <li>2 : notExist</li>
     *     <li>3 : alreadyTaken</li>
     *     <li>4 : norExistOrFree</li>
     * </ol>
     */
    static throwError(error){
        switch (error) {
            case 1:
                console.log('the string you entered is to short');
                break;
            case 2:
                console.log('card not exists');
                break;
            case 3:
                console.log('this card is already taken');
                break;
            case 4:
                console.log('this card not exists or has been taken ');
                break;
            case 5:
                console.log('the string you entered is to long');
            break;
        }
    }


    observer(){
        observer.addObserver((state,prevState)=>{
            let s = state['addBonusCardBlock'];
            if(!User.bonusCardExist())
            {
                if(observer.deactivated('addBonusCardBlock',state))
                    this.clear();
                else if(s.visibility && !prevState['addBonusCardBlock'].visibility)
                    this.update(s.data);
            }
        });
    }

    prepareParams() {
        this.params.show =  User.isAuthorized();
    }
}

export {AddBonusCardBlock};