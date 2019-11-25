export function distanceToVictim(victim, citizen) {
  return Math.sqrt((victim.posX-citizen.posX) ** 2 + (victim.posY-citizen.posY) ** 2);
}
