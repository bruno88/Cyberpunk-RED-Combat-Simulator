import { Character } from "./Character.js";

const combatLogText = document.getElementById("combat-log-text");
const pcSelect = document.getElementById("pc-select");
const npcSelect = document.getElementById("npc-select");
const btnStartSimulation = document.getElementById("btnStartSimulation");
const btnRunMultipleSimulations = document.getElementById("btnRunMultipleSimulations");
const rangeDV = document.getElementById("rangeDV");
const numSimulations = document.getElementById("numSimulations");
const attackSkill = document.getElementById("attack-skill");

const vetPC = [];
vetPC.push(new Character("Phillip Milliner", 8, 5, 6, 6, 6, "Exec", 40, 11));

const vetNPC = [];
vetNPC.push(new Character("Heavily Armored Cyber-Enhanced Enforced", 8, 8, null, null, null, "NPC", 30, 30, 14));
vetNPC.push(new Character("Cyberpsycho", 8, 8, null, null, null, "NPC", 55, 55, 11));

fillSelects("PC");
fillSelects("NPC");

pcSelect.value = "Phillip Milliner";
npcSelect.value = "Heavily Armored Cyber-Enhanced Enforced";
btnStartSimulation.focus();

btnStartSimulation.addEventListener("click", () => {
    combatLogText.textContent = "";
    runSimulation();
});

btnRunMultipleSimulations.addEventListener("click", () => {
    combatLogText.textContent = "";
    let averageRounds = 0;

    for (let i = 0; (numSimulations.value > 0 && i < numSimulations.value); i++) {
        const summary = runSimulation() -1;
        averageRounds += summary;
    }
    averageRounds /= Math.round(numSimulations.value,2);
    addCombatLogText(`In a total of ${numSimulations.value} simulations, on average ${pcSelect.value} won in ${averageRounds} rounds of combat.`);
})

function runSimulation() {
    if (pcSelect.value !== "none" && npcSelect.value !== "none") {
        const PC = vetPC[pcSelect.selectedIndex - 1];
        const NPC = vetNPC[npcSelect.selectedIndex - 1];
        return startSimulation(PC, NPC);
    }
}
function startSimulation(PC, NPC) {
    let numTurns = 1;
    const maxTurns = 30;

    // Refresh starting values
    PC.HPCurrent = PC.HPTotal;
    NPC.HPCurrent = NPC.HPTotal;
    NPC.armorSPCurrent = NPC.armorSP;
    //

    addCombatLogText(`Starting Combat:\n${PC.name} vs. ${NPC.name} (${NPC.HPCurrent} HP, ${NPC.armorSP} SP) at Range of DV ${rangeDV.value}\n`);

    while (NPC.HPCurrent > 0 && numTurns < maxTurns) {
        numTurns++;
        //const rollAttack = PC.makeAttack('shoulderArms', NPC, rangeDV.value);
        const rollAttack = PC.makeAttack(attackSkill.value, NPC, rangeDV.value);
        addCombatLogText(rollAttack['description']);
    }
    addCombatLogText(`\nEnd of combat:\n${PC.name} defeated ${NPC.name} in ${numTurns - 1} turns\n`);
    return numTurns;
}

function addCombatLogText(text) {
    combatLogText.textContent += `${text}\n`;
}

function fillSelects(select) {
    switch (select) {
        case 'PC':
            for (let i = 0; i < vetPC.length; i++) {
                let option = document.createElement("option");
                option.value = vetPC[i].name;
                option.textContent = vetPC[i].name;
                pcSelect.appendChild(option);
            }
            break;
        case 'NPC':
            for (let i = 0; i < vetNPC.length; i++) {
                let option = document.createElement("option");
                option.value = vetNPC[i].name;
                option.textContent = vetNPC[i].name;
                npcSelect.appendChild(option);
            }
            break;

        default:
            break;
    }

}