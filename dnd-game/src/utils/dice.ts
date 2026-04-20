export function rollDice(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

export function rollD20(): number {
  return rollDice(20);
}

export function rollD6(): number {
  return rollDice(6);
}

export function rollMultiple(count: number, sides: number): number[] {
  return Array.from({ length: count }, () => rollDice(sides));
}

export function rollStat(): number {
  const rolls = rollMultiple(4, 6).sort((a, b) => b - a);
  return rolls[0] + rolls[1] + rolls[2];
}

export function skillCheck(stat: number, dc: number): { success: boolean; roll: number; total: number } {
  const roll = rollD20();
  const modifier = Math.floor((stat - 10) / 2);
  const total = roll + modifier;
  return { success: total >= dc, roll, total };
}

export function attackRoll(attackStat: number, defenseStat: number): { hit: boolean; roll: number; critical: boolean } {
  const roll = rollD20();
  const attackMod = Math.floor((attackStat - 10) / 2);
  const defenseMod = Math.floor((defenseStat - 10) / 2);
  const critical = roll === 20;
  return { hit: critical || (roll + attackMod > 10 + defenseMod), roll, critical };
}

export function calculateDamage(baseDamage: number, strength: number, critical: boolean): number {
  const modifier = Math.floor((strength - 10) / 2);
  const damage = Math.max(1, baseDamage + modifier + rollD6());
  return critical ? damage * 2 : damage;
}

export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
