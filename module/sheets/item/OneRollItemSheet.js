export default class OneRollItemSheet extends ItemSheet {
    
    get template() {
        const path = 'systems/ore/templates/item/itemsheet.hbs';
        return path;
    }

    getData () {
        const data = this.item.data;
        data.item = this.item;
        data.myName = data.name;

        data.config = CONFIG.ore; 

        console.warn("Data: ", data);
        
        return data;
    }
}