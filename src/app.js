import {App,User,Delivery,Order} from './core/main';
import {DeliveryMethods} from "./components/delivery.methods/component";
import {store,observer} from './store';
import actions  from './components/all-actions';
import Utils from './core/utils';
const isEmpty = Utils.empty;
require("./css/style.scss");

App.ready()
    .then(async ()=>{
        store.dispatch(actions.firstStepInit({
            name : User.name,
            email: User.email,
            phone:User.phone,
            city: (Delivery.city==null ? "" : Delivery.city),
            attribute: (User.isAuthorized() ? 'disabled': '')
        }));
        store.dispatch(actions.initPriceBlock());
        if(User.bonusCardExist())
            store.dispatch(actions.initBonusCardBlock({
                number: User.getBonusCardInfo().number,
                STATUS: User.getBonusCardInfo().status,
                BNS_AVAILABLE: User.getBonusCardInfo().available
            }));
        if(!isEmpty(Delivery.city))
        {
            store.dispatch(actions.showLoaderDeliveryMethods());
            let nextStep = await Utils.predatorX(async ()=>{
                let data = await Delivery.getAvailableTypes();
                let params = DeliveryMethods.dataProcessing(data);
                store.dispatch(actions.removeLoaderDeliveryMethods());
                store.dispatch(actions.showDeliveryMethods(params));
                store.dispatch(actions.selectDeliveryMethods(DeliveryMethods.SetDefaultSelector(params)));
            });
            if(Delivery.method.type == 'TODOOR' && nextStep)
            {
                let zip = await Delivery.getZip();
                let params = {index: zip,...Delivery.method.data};
                store.dispatch(actions.showToDoorBlock(params));
                if(Delivery.method.build != '')
                {
                    store.dispatch(actions.showDeliveryInfo({
                        price: Delivery.price,
                        threshold: Delivery.threshold,
                        date: Delivery.estimatedDate,
                        company: Delivery.method.company,
                        type: Delivery.method.type
                    }));
                    let intervals = Delivery.method.intervals;
                    console.log(intervals);
                    store.dispatch(actions.showAddBonusCardBlock());
                    store.dispatch(actions.commentBlockShow());
                    store.dispatch(actions.showIntervals(intervals));
                }
            }else if(Delivery.method.type == 'PICKUP' && nextStep)
            {
                store.dispatch(actions.showParcelButton());
            }
        }

    });