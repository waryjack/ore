const { StringField, HTMLField, NumberField, SchemaField, ArrayField, BooleanField } = foundry.data.fields;
import OreBaseItemData from "./baseitemmodel.mjs";

export default class OreWeaponData extends OreBaseItemData {
    static defineSchema() {
        const baseSchema = super.defineSchema();
        return {
            ...baseSchema,
            damage: new SchemaField(super._damageSchema()),
            type: new StringField({required:true, initial:"melee"}),
            hands: new StringField({required:true, initial:"one"}),
            linkto: new TypeDataModel(foundry.abstract.document.BaseItem),
            range: new SchemaField({
                min: new NumberField({required:true, integer:true, min:0}),
                max: new NumberField({required:true, integer:true, min:0})
            }),
            ammo: new SchemaField({
                magtype: new StringField({required:true, initial:""}),
                capacity: new NumberField({required:true, integer:true, min: 0, initial:0}),
                current: new NumberField({required:true, integer:true, min:0, initial:0})
            }),
            qualities: new SchemaField({
                rof: new NumberField({integer:true, initial:1, min:0}),
                spray: new NumberField({integer:true, initial:0, min:0}),
                area: new NumberField({integer:true, initial:0, min:0}),
                pen: new NumberField({integer:true, initial:0, min:0}),
                burn: new NumberField({integer:true, initial:0, min:0}),
                slow: new NumberField({integer:true, initial:0, min:0})
            })
        }
    }
}