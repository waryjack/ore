const { StringField, HTMLField, NumberField, SchemaField, ArrayField, BooleanField } = foundry.data.fields;
import OreBaseItemData from "./baseitemmodel.mjs";

export default class OrePoolData extends OreBaseItemData {
    static defineSchema() {
        const baseSchema = super.defineSchema();
        return {
            ...baseSchema,
            min: new NumberField({integer:true, min:0, initial:0, required:true}),
            max: new NumberField({integer:true, min:0, initial:1, required:true}),
            current: new NumberField({integer:true, min:0, initial:0, required:true})
        }
    }
}