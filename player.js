import Sprite from "./sprite.js";

export default class Player extends Sprite {
    constructor(ctx, image, px, py, width, height, path) {
        super(ctx, image, px, py, width, height, path);

        this.animationSheets = [];

        this.animState = 'up';

        this.heroStep = 16 * (Sprite.scale * 16) / 16; // Multiplica pelo fator de escala

        this.animationSheets['down'] = this.getPosAnimSheet(0, 384, 16, 4);
        this.animationSheets['right'] = this.getPosAnimSheet(0, 400, 16, 4);
        this.animationSheets['up'] = this.getPosAnimSheet(0, 416, 16, 4);
        this.animationSheets['left'] = this.getPosAnimSheet(0, 432, 16, 4);
    }


}