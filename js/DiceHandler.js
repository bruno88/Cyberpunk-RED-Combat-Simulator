export class DiceHandler {
    static rollDices(numDices, diceSides, modifier = 0, armorSP = 0) {
        const rollResult = {
            rolls: [],
            description: '',
            total: 0
        };

        if (modifier) {
            rollResult.description += `Rolling ${numDices}d${diceSides}+${modifier}: (`;
        } else {
            rollResult.description += `Rolling ${numDices}d${diceSides}: (`;
        }


        for (let i = 0; i < numDices; i++) {
            const singleRoll = Math.floor(Math.random() * diceSides) + 1;
            rollResult.rolls.push(singleRoll);
            rollResult.total += singleRoll;
            rollResult.description += `${singleRoll}, `;
        }

        rollResult.description = rollResult.description.slice(0, -2);

        if (modifier) {
            rollResult.total += modifier;
            rollResult.description += `) + ${modifier} = ${rollResult.total}`;

        } else {
            rollResult.description += `) = ${rollResult.total}`;
        }

        return rollResult;
    }
}