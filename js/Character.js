import { DiceHandler } from "./DiceHandler.js";

export class Character {
    #name;
    #REF;
    #DEX
    #shoulder_arms;
    #handgun;
    #autofire;
    #role; // role name if PC, "NPC" if not PC
    #HPTotal;
    #HPCurrent;
    #armorSP;
    #armorSPCurrent;

    constructor(name, REF, DEX, shoulder_arms, handgun, autofire, role, HPTotal, HPCurrent, armorSP) {
        this.#name = name;
        this.#REF = REF;
        this.#DEX = DEX;
        this.#shoulder_arms = shoulder_arms;
        this.#handgun = handgun;
        this.#autofire = autofire;
        this.#role = role;
        this.#HPTotal = HPTotal;
        this.#HPCurrent = HPCurrent;
        this.#armorSP = armorSP;
        this.#armorSPCurrent = armorSP;
    }

    get name() { return this.#name; }
    get REF() { return this.#REF; }
    get DEX() { return this.#DEX; }
    get shoulder_arms() { return this.#shoulder_arms; }
    get handgun() { return this.#handgun; }
    get autofire() { return this.#autofire; }
    get role() { return this.#role; }
    get HPTotal() { return this.#HPTotal; }
    get HPCurrent() { return this.#HPCurrent; }
    get armorSP() { return this.#armorSP; }
    get armorSPCurrent() { return this.#armorSPCurrent; }

    set name(name) { this.#name = name; }
    set REF(REF) { this.#REF = REF; }
    set DEX(DEX) { this.#DEX = DEX; }
    set shoulder_arms(shoulder_arms) { this.#shoulder_arms = shoulder_arms; }
    set handgun(handgun) { this.#handgun = handgun; }
    set autofire(autofire) { this.#autofire = autofire; }
    set role(role) { this.#role = role; }
    set HPTotal(HPTotal) { this.#HPTotal = HPTotal; }
    set HPCurrent(HPCurrent) { this.#HPCurrent = HPCurrent; }
    set armorSP(armorSP) { this.#armorSP = armorSP; }
    set armorSPCurrent(armorSPCurrent) { this.#armorSPCurrent = armorSPCurrent; }

    makeAttack(skillUsed, target, rangeDV) {
        let attackRollResult;
        let damageResult;
        let attackModifiers;

        const result = {
            rolls: [],
            description: '',
            total: 0
        };

        switch (skillUsed) {
            case 'shoulderArms':
                attackModifiers = this.#REF + this.#shoulder_arms;
                attackRollResult = DiceHandler.rollDices(1, 10, attackModifiers);
                result.description = `Attacking with shoulder arms: ${attackRollResult.description} vs ${rangeDV}.`;

                if (attackRollResult.total >= rangeDV) {
                    result.description += '(HIT)';
                    damageResult = DiceHandler.rollDices(5, 6);
                    let damage = Math.max(damageResult.total, 0);

                    result.description += `\n${damageResult.description} damage`;
                    // Check for Critical Injuriess
                    const numSixes = damageResult.rolls.filter((value) => value == 6);
                    if (numSixes.length >= 2) {
                        damage += 5;
                        result.description += ', (+5 damage from CRITICAL HIT) = ' + damage;
                    }
                    damage = Math.max(damageResult.total - target.armorSPCurrent, 0);
                    result.description += `, ${target.armorSPCurrent} stopped, total ${damage}.`;
                    target.HPCurrent -= damage;
                    result.description += ` \n${target.name} now has ${target.HPCurrent} health.\n`;
                    if (damage > 0) {
                        target.ablateArmorSP(1);
                    }
                } else {
                    result.description += '(MISS)';
                }

                break;

            case 'handgun':
                // TODO: implement
                break;
            case 'autofire':
                attackModifiers = this.#REF + this.#autofire;
                attackRollResult = DiceHandler.rollDices(1, 10, attackModifiers);
                result.description = `Attacking with Autofire: ${attackRollResult.description} vs ${rangeDV}.`;

                if (attackRollResult.total >= rangeDV) {
                    let margin = attackRollResult.total - rangeDV;
                    
                    // Margin between 0 and 4 based on success of attack roll
                    if (margin > 4) { margin = 4; }
                    if (margin < 0) { margin = 0; }

                    result.description += '(HIT, Margin: x' + margin + ')';
                    damageResult = DiceHandler.rollDices(2, 6);
                    let damage = Math.max(damageResult.total, 0);
                    damage *= margin;
                    result.description += `\n${damageResult.description} damage`;
                    result.description += ` (x${margin}) = ${damage}`;
                    // Check for Critical Injuriess
                    const numSixes = damageResult.rolls.filter((value) => value == 6);
                    if (numSixes.length >= 2) {
                        damage += 5;
                        result.description += ', (+5 damage from CRITICAL HIT) = ' + damage;
                    }
                    damage = Math.max(damage - target.armorSPCurrent, 0);
                    result.description += `, ${target.armorSPCurrent} stopped, total ${damage}.`;
                    target.HPCurrent -= damage;
                    result.description += ` \n${target.name} now has ${target.HPCurrent} health.\n`;
                    if (damage > 0) {
                        target.ablateArmorSP(1);
                    }
                } else {
                    result.description += '(MISS)';
                }

                break;

            default:
                break;
        }

        return result;
    }

    ablateArmorSP(value) {
        this.#armorSPCurrent -= value;
    }
}