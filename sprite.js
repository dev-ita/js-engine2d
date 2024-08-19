export default class Sprite {

    static scale = 2
    static debugRect = false;

    constructor(ctx, image, px, py, width, height, path) {
        this.ctx = ctx;
        this.image = image;
        this.px = px;
        this.py = py;
        this.width = width;
        this.height = height;
        this.image.src = path;
    }

    getBounds() {
        return {
            x: this.px,
            y: this.py,
            width: this.width,
            height: this.height
        };
    }

    draw(sx, sy) {
        this.ctx.drawImage(this.image, sx, sy, this.width, this.height, this.px, this.py, this.width * Sprite.scale, this.height * Sprite.scale);

        if (Sprite.debugRect) {
            this.ctx.strokeStyle = 'red'; // Cor do retângulo
            this.ctx.lineWidth = 2; // Largura da linha
            this.ctx.strokeRect(this.px, this.py, this.width * Sprite.scale, this.height * Sprite.scale); // Desenha o retângulo
        }
    }

    getPosAnimSheet = (x, y, w, animations) => {
        let frames = {
            loc: [],
        };
        for (let i = 0, j = x; i < animations; i++, j += 16) {
            frames.loc.push({ x: j, y: y });
        }
        return frames;
    }

    isCollidingWith(otherSprite) {
        const thisLeft = this.px;
        const thisRight = this.px + this.width * Sprite.scale;
        const thisTop = this.py;
        const thisBottom = this.py + this.height * Sprite.scale;

        const otherLeft = otherSprite.px;
        const otherRight = otherSprite.px + otherSprite.width * Sprite.scale;
        const otherTop = otherSprite.py;
        const otherBottom = otherSprite.py + otherSprite.height * Sprite.scale;

        return !(thisRight <= otherLeft ||
            thisLeft >= otherRight ||
            thisBottom <= otherTop ||
            thisTop >= otherBottom);
    }


    /*
    ex:
    anim {
        'down': {
            loc: [
                {0, 32},
                {0, 48},
                ...
            ]
        }
    }
    * */
    animate(gameFrame, speed, anim, key) {
        let position = Math.floor(gameFrame/speed) % anim[key].loc.length;
        return {frameX: anim[key].loc[position].x, frameY: anim[key].loc[position].y}
    }
}