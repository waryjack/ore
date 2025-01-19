export class OneRollTrackWindow extends Application {

    get template() {
        const path = 'systems/ore/templates/actor/';
        return `${path}${this.actor.type}sheet.hbs`;
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ['ore', 'sheet', 'app', 'window-app'],
            width: 775,
            height: 685,
            left:120,
            tabs: [{navSelector: ".tracker-tabs", contentSelector: ".trackerbody", initial: "trackmain"}],
            dragDrop: [{dragSelector: ".dragline", dropSelector: null}]
            });
    }

    /**
     * @override
     */

    getData() {
    
    }


}