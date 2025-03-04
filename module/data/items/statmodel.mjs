const { StringField, HTMLField, NumberField, SchemaField, ArrayField, BooleanField } = foundry.data.fields;
import OreBaseItemData from "./baseitemmodel.mjs";

export default class OreStatData extends OreBaseItemData {
    static defineSchema() {
        const baseSchema = super.defineSchema();
        return {
            ...baseSchema,
            mod: new NumberField({required:true, initial:0, integer:true}),
            isInit: new BooleanField({required:true, initial:false})
        }
    }
}