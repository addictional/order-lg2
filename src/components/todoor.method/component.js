import Component from "../../core/components";
import {observer, store} from "../../store";
import actions from "../all-actions";
import {App, Delivery, Order} from "../../core/main";
import template from './template.html';
import {PaymentMethodsBlock} from "../payment.methods.block/component";

class ToDoorMethod extends Component {
    constructor() {
        super('#delivery-todoor-block',template)
    }

    error(error = 'show'){
        let element = document.querySelector('#house-input');
        if(error === 'show')
            element.style = 'border-color: red;';
        else if(error === 'hide')
            element.style = '';
    }

    updateIndex(val){
        document.querySelector('#zip-of-city').value = val;
    }

    setEvents() {
        $('#street-input').select2(
            {
                'minimumInputLength': 3,
                tags: true,
                'language': {
                    'errorLoading': function () {
                        return 'Подготавливаем список...'
                    },
                    'searching': function () {
                        return 'Подготавливаем список...'
                    },
                    'inputTooShort': function () {
                        return 'Варианты появятся после ввода 3х первых букв улицы'
                    },
                    'noResults': function () {
                        return 'Такой улицы в базе не найдено'
                    },
                },
                'ajax': {
                    'url': App.params.ajaxUrl,
                    'dataType': 'json',
                    'data': function (params) {
                        if (Delivery.city != '') {
                            return {
                                method: 'getStreetListByCity',
                                q: Delivery.city + ', ' +
                                    params.term
                            }
                        }
                        else {
                            return false
                        }
                    },
                },
                'escapeMarkup': function (markup1) {
                    return markup1
                },
                'templateResult': function (street) {
                    //console.log(street);
                    return street.text
                },
                'templateSelection': function (street) {
                    return street.text;

                },
                'width': '100%',
                'placeholder': 'Улица',
            }
        );
        $('#street-input').on("select2:select",async (e)=>{
            Delivery.method.street = e.params.data.text;
            let zip = await Delivery.getZip();
            if(zip)
            {
                let params = {index: zip,...Delivery.method.data};
                store.dispatch(actions.updateToDoorBlock(params));
                store.dispatch(actions.removeStreet(zip));
                store.dispatch(actions.removeDeliveryInfo());
                store.dispatch(actions.commentBlockRemove());
                store.dispatch(actions.removeIntervals());
                store.dispatch(actions.hidePaymentMethodsBlock());
                store.dispatch(actions.removeAddBonusCardBlock());
            }

        });
        document.querySelector('#house-input').addEventListener('input',async (e)=> {
            Delivery.method.build = e.target.value;
            let data = await Delivery.getZip();
            let params = {index: data, ...Delivery.method.data};
            store.dispatch(actions.updateToDoorBlock(params));
            if(e.target.value == ''){
                store.dispatch(actions.removeDeliveryInfo());
                store.dispatch(actions.commentBlockRemove());
                store.dispatch(actions.removeIntervals());
                store.dispatch(actions.hidePaymentMethodsBlock());
                store.dispatch(actions.removeAddBonusCardBlock());
            }else{
                store.dispatch(actions.showDeliveryInfo({
                    price: Delivery.price,
                    threshold: Delivery.threshold,
                    date: Delivery.estimatedDate,
                    company: Delivery.method.company,
                    type: Delivery.method.type
                }));
                let intervals = Delivery.method.intervals;
                store.dispatch(actions.showIntervals(intervals));
                store.dispatch(actions.initPriceBlock());
                let paymentMethods = Delivery.method.availablePaymentMethods;
                store.dispatch(actions.showPaymentMethodsBlock({methods:paymentMethods}));
                let select = PaymentMethodsBlock.defaultSelect(paymentMethods);
                Order.paymentMethod = select;
                store.dispatch(actions.selectPaymentMethodsBlock(select));
                store.dispatch(actions.showAddBonusCardBlock());
                store.dispatch(actions.commentBlockShow());
            }
        });
        document.querySelector('#corpus-input').addEventListener('input',async (e)=> {
            Delivery.method.block = e.target.value;
            let data = await Delivery.getZip();
            let params = {index: data, ...Delivery.method.data};
            store.dispatch(actions.updateToDoorBlock(params));
        });
        document.querySelector('#flat-input').addEventListener('input',async (e)=> {
            Delivery.method.flat = e.target.value;
            let data = await Delivery.getZip();
            let params = {index: data, ...Delivery.method.data};
            store.dispatch(actions.updateToDoorBlock(params));
        });
        document.querySelector('#street-todoor-clear-button')
            .addEventListener('click',async ()=>{
                if(Delivery.method.street != '')
                {
                    Delivery.method.clear();
                    let zip = await Delivery.getZip();
                    store.dispatch(actions.removeStreet(zip));
                    store.dispatch(actions.removeDeliveryInfo());
                    store.dispatch(actions.commentBlockRemove());
                    store.dispatch(actions.removeIntervals());
                    store.dispatch(actions.hidePaymentMethodsBlock());
                    store.dispatch(actions.removeAddBonusCardBlock());
                }
            })
    }


    observer(){
        observer.addObserver((state,prevState)=>{
            let s = state['toDoorMethod'];
            let  p = prevState['toDoorMethod'];
            if(observer.deactivated('toDoorMethod',state))
                this.clear();
            else if(p.visibility !== s.visibility || p.data.street != s.data.street)
                this.update(s.data);
            else {
                if(s.data.index != p.data.index)
                    this.updateIndex(s.data.index);
                if(s.data.build != p.data.build)
                {
                    if(s.data.build == "")
                        this.error('show');
                    else
                        this.error('hide');
                }
            }
        });
    }


    prepareParams() {
        // console.log(this.params);
    }
}

export {ToDoorMethod};