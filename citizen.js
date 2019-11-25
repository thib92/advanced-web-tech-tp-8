export class Citizen {
  /**
   * Citizen constructor
   * @param {number|undefined} id
   * @param {string} name
   * @param {int} posX
   * @param {int} posY
   * @param {boolean} isVictim
   */
  constructor(id, name, posX, posY, isVictim) {
    this.id = id;
    this.name = name;
    this.posX = posX;
    this.posY = posY;
    this.isVictim = isVictim;
  }
}
