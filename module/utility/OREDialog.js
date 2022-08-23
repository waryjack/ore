export default class OneRollDialog extends Application {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ['ore', 'app', 'window-app', 'dialog'],
            });
    }
}