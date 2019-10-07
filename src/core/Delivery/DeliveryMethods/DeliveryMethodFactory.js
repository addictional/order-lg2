import ParcelShopsFactory from './ParcelShops/ParcelShopFactory';
import CourierDelivery from './CourierDelivery/CourierDelivery';
import DefaultDelivery from './DeliveryMethod';

const  DeliveryMethodFactory = {
    createCourier(){
        return new CourierDelivery();
    },

    createParcelShop(){
        return new ParcelShopsFactory();
    },
    createDefault(){
        return new DefaultDelivery();
    }
};

export  default DeliveryMethodFactory;