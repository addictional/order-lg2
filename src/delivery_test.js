import Delivery from './core/Delivery/Delivery';
(async function(){
    Delivery.init();
    let data = await Delivery.getAvailableTypes();
    data.PICKUP[0] = 
}());

