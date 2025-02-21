const { StringField, HTMLField, NumberField, SchemaField, ArrayField, BooleanField } = foundry.data.fields;
import OreBaseItemData from "./baseitemmodel.mjs";

export default class OrePowerData extends OreBaseItemData {
    static defineSchema() {
        const baseSchema = super.defineSchema();
        return {
            ...baseSchema,
            qualities: new StringField({initial:""}),
            restrictions: new StringField({initial:""}),
            prereqs: new StringField({initial:""}),
            damage: new SchemaField(super._damageSchema())
        }
    }
}