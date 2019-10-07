import User from './entities/user';
import {store,observer} from "../store";
import Delivery from "./Delivery/Delivery";
import Order from "./entities/order";
import {FirstStepBlock} from "../components/first.step/component";
import {DeliveryMethods} from "../components/delivery.methods/component";
import {PriceBlock} from "../components/price.block/component";
import {BonusCardBlock} from "../components/bonuscard.block/component";
import {AddBonusCardBlock} from "../components/add.bonus.card/component";
import {ToDoorMethod} from "../components/todoor.method/component";
import {ParcelMethodBlock} from "../components/parcel_shop.method/component";
import {DeliveryInfo} from "../components/delivery.info/component";
import {PaymentMethodsBlock} from "../components/payment.methods.block/component";
import OrderIsProcessed from "../components/order.is.processed/component";
import CommentBlock from "../components/comment/component";
import {IntervalsBlock} from "../components/intervals.block/component";

import actions from "../components/all-actions"

import Utils from './utils';
const isEmpty = Utils.empty;

const wait = async function(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
};

const App = {


    params: {
      mobile: false,
      ajaxUrl: '/rest.v2/ajax.order/?'+document.querySelector('[name="bitrix-session-id"]').value
    },


    // get User(){
    //     return User;
    // },
    //
    // get Order(){
    //     return Order;
    // },
    //
    // get Delivery(){
    //     return Delivery;
    // },


    ajaxBadRequest(error){
        if(error == 0)
            alert('Отсутсвует подключение к интурнету');
        if(error >= 500)
            alert('Отсутствует соединение с сервером');
        return error == 0 || error >= 500;

    },

    async ready(){
        const errorHandler = function(error){
            switch(error.code){
                case 40:
                    store.dispatch(actions.nameError(error.description));
                    break;
                case 42:
                    store.dispatch(actions.phoneError(error.description));
                    break;
                case 43:
                    store.dispatch(actions.emailError(error.description));
                    break;
                case 44:
                    store.dispatch(actions.emailError(error.description));
                    break;
            }
        };
       let ready = await Utils.predatorX(async ()=>{
            let data = await $.ajax({
                url: this.params.ajaxUrl,
                data: {method: 'init'},
                dataType: 'json'
            });
            if(data.items.length < 1)
                location.href = '/order/';
            else{
                this.params.mobile = window.innerWidth <= 991;
                User.init({
                    user: {...data.user},
                    bonusCard:{
                        number: data.bonusCard
                    }
                });
                if(User.bonusCardExist())
                {
                    let number = User.getBonusCardInfo().number;
                    let data = await $.ajax({
                        url: this.params.ajaxUrl,
                        data: {
                            method: 'bonusCardStatus',
                            bonusCard: User.getBonusCardInfo().number,
                        },
                        dataType: 'json'
                    });
                    User.init({
                        bonusCard: {
                            available: data.BNS_AVAILABLE,
                            status: data.STATUS,
                            maxChequePoints : data.maxChequePoints,
                            preCalculatedBns: data.preCalculatedBns,
                            number: number
                        }
                    });
                }
                console.log({...data});
                Order.init(data);

                Delivery.init();

                new FirstStepBlock();
                new DeliveryMethods();
                new PriceBlock();
                new BonusCardBlock();
                new AddBonusCardBlock();
                new ToDoorMethod();
                new ParcelMethodBlock();
                new DeliveryInfo();
                new PaymentMethodsBlock();
                new OrderIsProcessed();
                new CommentBlock();
                new IntervalsBlock();



                let button = document.querySelector('.wbl-finish-make-order-block');

                button.addEventListener('click',async ()=>{
                    document.querySelector('.main-loader-wrap').classList.remove('hide');
                    let d = {
                        method: 'add',
                        delivery: {
                            company: Delivery.method.company,
                            city: Delivery.city,
                            zone: Delivery.method.zone,
                            paymentMethod: Order.paymentMethod,
                            cost:Delivery.price,
                            threshold:Delivery.threshold,
                            bonusCard:User.bonusCardExist() ? User.getBonusCardInfo().number : '',
                            bonusPointsUsed: Order.bonusPointsUsed,
                            method: Delivery.method.type,
                            regionCode: '1',
                            shippingDate:Delivery.method.shippingDate,
                            estimatedDeliveryDate:Delivery.method.estimatedDeliveryDate,
                            methodData: {
                                ...Delivery.method.info
                            }
                        },
                        user:{
                            phone:User.phone,
                            email:User.email,
                            name:User.name,
                            comment: Order.comment,
                            addCard: Order.addCard,
                            time: (new Date()).getTimezoneOffset()/-60,
                        }};
                    console.log(d);
                    let data =  await  $.ajax({
                        url: App.params.ajaxUrl,
                        method: "POST",
                        data: d,
                        dataType: 'json'
                    });
                    if(data.error)
                    {
                        data.error.forEach((err)=>{
                            errorHandler(err);
                        });
                    }else
                        store.dispatch(actions.showOrderIsProcessed(data));
                    document.querySelector('.main-loader-wrap').classList.add('hide');
                });
                observer.addObserver((c,p)=>{
                    // console.log(JSON.parse(JSON.stringify(c)));
                    if(!isEmpty(User.name) && !isEmpty(User.email) && !isEmpty(User.phone) && Delivery.method.ready
                        && Order.paymentMethod)
                        button.classList.remove('hide');
                    else if (!button.classList.contains('hide'))
                        button.classList.add('hide');
                });

                observer.init();
            }
        });

        return ready;
    }
};

export  {App,User,store,observer,Delivery,Order,wait};