import Component from '../../core/components';
import {App,User,store,observer,Delivery,wait} from '../../core/main';
import actions from "../all-actions";
import IMask from "imask";
import {reducer as firstStep} from "./reducer";
import Utils from '../../core/utils';
const isEmpty = Utils.empty;
import {DeliveryMethods} from "../delivery.methods/component";
import template from "./template.html";

class FirstStepBlock extends Component {
    constructor() {
        super('#first-step', template);
    }

    clean(){
        store.dispatch(actions.removeDeliveryMethods());
        store.dispatch(actions.removeToDoorBlock());
        store.dispatch(actions.removeParcelButton());
        store.dispatch(actions.removeAddBonusCardBlock());
        store.dispatch(actions.hidePaymentMethodsBlock());
        store.dispatch(actions.removeDeliveryInfo());
        store.dispatch(actions.commentBlockRemove());
        store.dispatch(actions.removeIntervals());
    }


    setEvents(callback) {
        let name = document.querySelector('[name="order-name-input"]'),
            email = document.querySelector('[name="order-email-input"]'),
            phone = document.querySelector('[name="order-tel-input"]');

        name.addEventListener('input',(e)=>{
            store.dispatch(actions.nameAdd(e.target.value));
        });

        name.addEventListener('blur',()=>{
            if(name.value == '')
                store.dispatch(actions.nameError('Пустое поле'));
            else if(name.value.length < 3)
                store.dispatch(actions.nameError('Имя не может быть меньше 3 символов'));
        });

        name.addEventListener('focus',()=>{
            store.dispatch(actions.disableNameError())
        });

        email.addEventListener('input',(e)=>{
            store.dispatch(actions.emailAdd(e.target.value));
        });

        email.addEventListener('blur',async (e)=>{
            if(e.target.value == ''){
                store.dispatch(actions.emailError('Пустое поле'));
            }
            else {
                $.ajax({
                    url: App.params.ajaxUrl,
                    data: {
                        method: 'checkEmail',
                        email: e.target.value
                    },
                    dataType: 'json'
                })
                    .then((data)=>{
                        if(!data.pattern)
                            store.dispatch(actions.emailError('Эл. почта введена не верно!'));
                        if(data.emailExist)
                            store.dispatch(actions.emailError('Эл. почта уже зарегана!'));
                    });
            }
        });

        email.addEventListener('focus',()=>{
            store.dispatch(actions.disableEmailError())
        });
        phone.value = User.phone;
        let mask = IMask(phone,{
            mask: '+{7}(000)000-00-00'
        });


        mask.on('accept',()=>{
            store.dispatch(actions.phoneAdd(mask.value));
        });

        phone.addEventListener('blur',()=>{
            if(mask._unmaskedValue.length == 0)
                store.dispatch(actions.phoneError('Пустое поле'));
            else if(mask._unmaskedValue.length < 11)
                store.dispatch(actions.phoneError('Телефон введён неверно!'))
        });

        phone.addEventListener('focus',()=>{
            store.dispatch(actions.disablePhoneError())
        });

        this.createInputAutocomplete();
    }

    createInputAutocomplete(){
        let cityInput = $('#city-selector'),
            _this = this;
        cityInput.select2(
            {
                minimumInputLength: 3,
                language: {
                    errorLoading: function () {
                        return 'Подготавливаем список...'
                    },
                    searching: function () {
                        return 'Подготавливаем список...'
                    },
                    inputTooShort: function () {
                        return 'Варианты появятся после ввода 3х первых букв населенного пункта'
                    },
                    noResults: function () {
                        return 'Такого населенного пункта в базе не найдено'
                    },
                },
                ajax: {
                    url: App.params.ajaxUrl,
                    dataType: 'json',
                    data: function (params) {
                        return {method:'getLocationList',q: params.term}
                    },
                    processResult: function (data) {
                        return {
                            result: data
                        };
                    }

                },
                escapeMarkup: function (markup) {
                    return markup;
                },
                templateResult: function (city) {
                    return city.text;
                },
                templateSelection: function (city) {
                    return city.text;
                },
                width: '100%',
                placeholder: '--Выберите населенный пункт--',
            }
        );
        async function selectFunc (e,attempts = 10,time = 5 * 1000){
            try{
                _this.clean();
                Delivery.city = e.params.data.text;
                store.dispatch(actions.cityAdd({city : e.params.data.text}));
                store.dispatch(actions.showLoaderDeliveryMethods());
                console.log('$c step 1','background: #222; color: #bada55');
                let data = await Delivery.getAvailableTypes();
                console.log('$c step 2','background: #222; color: #bada55');
                let params = DeliveryMethods.dataProcessing(data);
                store.dispatch(actions.removeLoaderDeliveryMethods());
                store.dispatch(actions.showDeliveryMethods(params));
                store.dispatch(actions.selectDeliveryMethods(DeliveryMethods.SetDefaultSelector(params)));
                if(Delivery.method.type == 'TODOOR')
                {
                    let zip = await Delivery.getZip();
                    params = {index: zip,...Delivery.method.data};
                    store.dispatch(actions.showToDoorBlock(params));
                    if(Delivery.method)
                        store.dispatch(actions.showAddBonusCardBlock());
                }else if(Delivery.method.type == 'PICKUP')
                {
                    store.dispatch(actions.showParcelButton());
                }
                return true;
            }catch (error) {
                if(App.ajaxBadRequest(error.status))
                {
                    if (attempts === 1)
                        throw 'fatal error';
                    else
                    {
                        await wait(time);
                        return await selectFunc(e,attempts-1,time * 2);
                    }
                }
            }
        };
        cityInput.on('select2:select',async (e)=>{
           let result = await  Utils.predatorX(async (e)=>{
               _this.clean();
               Delivery.city = e.params.data.text;
               store.dispatch(actions.cityAdd({city : e.params.data.text}));
               store.dispatch(actions.showLoaderDeliveryMethods());
               let data = await Delivery.getAvailableTypes();
               let params = DeliveryMethods.dataProcessing(data);
               store.dispatch(actions.removeLoaderDeliveryMethods());
               store.dispatch(actions.showDeliveryMethods(params));
               store.dispatch(actions.selectDeliveryMethods(DeliveryMethods.SetDefaultSelector(params)));
               if(Delivery.method.type == 'TODOOR')
               {
                   let zip = await Delivery.getZip();
                   params = {index: zip,...Delivery.method.data};
                   store.dispatch(actions.showToDoorBlock(params));
                   if(Delivery.method)
                       store.dispatch(actions.showAddBonusCardBlock());
               }else if(Delivery.method.type == 'PICKUP')
               {
                   store.dispatch(actions.showParcelButton());
               }
           },e)
        });
        document.querySelector('#clear-city-selector').addEventListener('click',()=>{
            store.dispatch(actions.cityRemove());
            this.clean();
        })
    }

    hideErrors(name)
    {
        let element = null,
            secondElement = null;
        switch (name) {
            case 'emailError':
                element = document.querySelector('[for="order-email-input"]');
                secondElement = document.querySelector('[name="order-email-input"]');
                break;
            case 'nameError':
                element = document.querySelector('[for="order-name-input"]');
                secondElement = document.querySelector('[name="order-name-input"]');
                break;
            case 'phoneError':
                element = document.querySelector('[for="order-phone-input"]');
                secondElement = document.querySelector('[name="order-tel-input"]');
                break;
        }
        if(element != null)
            element.style.display = "none";
        if(secondElement != null)
            secondElement.style = ""
    }

    observer(){
        observer.addObserver((state,prevState)=>{
            let s = state['firstStep'];
            let arr = [];
            if(!s.data.emailError)
                arr.push('emailError');
            if(!s.data.nameError)
                arr.push('nameError');
            if(!s.data.phoneError)
                arr.push('phoneError');
            for(let key  of arr)
                this.hideErrors(key);
            if(s.visibility && !prevState['firstStep'].visibility)
                this.update(s.data);
            if(s.data.city == '' && !isEmpty(prevState['firstStep'].data.city))
            {
                this.update(s.data);
            }else if(s.error != prevState['firstStep'].error && s.error)
                this.update(s.data);
        });
    }
}

export {FirstStepBlock};