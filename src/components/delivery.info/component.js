import Component from '../../core/components'
import {observer} from "../../store";

import pickup from './templates/pickup.html';
import toDoor from './templates/todoor.html';

class DeliveryInfo extends Component
{
    constructor()
    {
        super('#delivery-info-message-wrapper',pickup);
    }

    update(params = {}) {
        if(params.type == "TODOOR")
            this.template.main = toDoor;
        if(params.type == "PICKUP")
            this.template.main = pickup;
        super.update(params);
    }

    observer(){
        observer.addObserver((state,prevState)=>{
            if(observer.deactivated('deliveryInfo',state))
                this.clear();
            else if(observer.update('deliveryInfo',state))
                this.update(state.deliveryInfo.data);
        });
    }
}

export {DeliveryInfo};