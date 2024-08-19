import Sprite from "./sprite.js";
import Player from "./player.js";

class Game {
    constructor() {
        this.previousTime = Date.now()

        this.keysPressed = {}

        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext('2d');

        this.CANVAS_WIDTH = (this.canvas.width = 320);
        this.CANVAS_HEIGHT = (this.canvas.height = 240);

        this.cameraX = 0;
        this.cameraY = 0;
        this.cameraWidth = this.CANVAS_WIDTH;
        this.cameraHeight = this.CANVAS_HEIGHT;

        this.ctx.imageSmoothingEnabled = false;

        //light
        // Crie um canvas menor para a luz pixelada
        this.lightCanvasSmall = document.createElement("canvas");
        this.lightCanvasSmall.width = 64;  // Pequeno para pixelar a luz
        this.lightCanvasSmall.height = 64;
        this.lightCtxSmall = this.lightCanvasSmall.getContext("2d");

        // Crie um canvas normal para desenhar a luz final
        this.lightCanvas = document.createElement("canvas");
        this.lightCanvas.width = this.CANVAS_WIDTH;
        this.lightCanvas.height = this.CANVAS_HEIGHT;
        this.lightCtx = this.lightCanvas.getContext("2d");

        this.gameFrame = 0;

        // entities
        this.hero = new Player(this.ctx, new Image(), 5 * 16 * (Sprite.scale * 16) / 16, 7 * 16 * (Sprite.scale * 16) / 16, 16, 16, './assets/spritesheet.png');
        this.npc = new Sprite(this.ctx, new Image(), 3 * 16 * (Sprite.scale * 16) / 16, 0, 16, 16, './assets/spritesheet.png');

        // itens
        this.sword = new Sprite(this.ctx, new Image(), 6 * 16 * (Sprite.scale*16) / 16, 7 * 16 * (Sprite.scale*16) / 16, 16, 16, './assets/spritesheet.png');
        this.shield = new Sprite(this.ctx, new Image(), 16 * (Sprite.scale * 16) / 16, 0, 16, 16, './assets/spritesheet.png');
        this.chest = new Sprite(this.ctx, new Image(), 0, 0, 16, 16, './assets/spritesheet.png');

        // structures
        this.town = new Sprite(this.ctx, new Image(), 3 * 16 * (Sprite.scale * 16) / 16, 2 * 16 * (Sprite.scale * 16) / 16, 20, 48, './assets/spritesheet.png');
        this.castle = new Sprite(this.ctx, new Image(), 5 * 16 * (Sprite.scale * 16) / 16, 4 * 16 * (Sprite.scale * 16) / 16, 48, 48, './assets/spritesheet.png');

        // ambient
        this.tree = new Sprite(this.ctx, new Image(), 0, 0, 16, 31, './assets/spritesheet.png');
        this.ground = new Sprite(this.ctx, new Image(), 0, 0, 16, 16, './assets/spritesheet.png');
        this.bornfire = new Sprite(this.ctx, new Image(), 0, 0, 16, 16, './assets/spritesheet.png');
        this.bush = new Sprite(this.ctx, new Image(), 0, 0, 16, 16, './assets/spritesheet.png');

        // 20x20
        this.map = [
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,2,6,3,0,0,8,0,0,8,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,4,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,8,0,0,8,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        ]

        this.run();
    }



    handleKeyDown = (event) => {
        if (!this.keysPressed[event.key]) {
            this.keysPressed[event.key] = true;
            if (event.key === 'w') {
                this.hero.animState = 'up';
                this.hero.py -= this.hero.heroStep;
            }
            else if (event.key === 's') {
                this.hero.animState = 'down';
                this.hero.py += this.hero.heroStep;
            }
            else if (event.key === 'a') {
                this.hero.animState = 'left';
                this.hero.px -= this.hero.heroStep;
            }
            else if (event.key === 'd') {
                this.hero.animState = 'right';
                this.hero.px += this.hero.heroStep;
            }
        }
    }

    handleKeyUp = (event) => {
        // Marca a tecla como não pressionada ao soltar
        this.keysPressed[event.key] = false;
    };


    drawMap = () => {

        // Desenhe primeiro todo o ground
        for (let eachRow = 0; eachRow < 20; eachRow++) {
            for (let eachCol = 0; eachCol < 20; eachCol++) {
                this.ground.px = 16 * eachCol * Sprite.scale - this.cameraX;
                this.ground.py = 16 * eachRow * Sprite.scale - this.cameraY;
                this.ground.draw(16, 16);
            }
        }

        // Agora desenhe as sprites maiores por cima do ground
        for (let eachRow = 0; eachRow < 20; eachRow++) {
            for (let eachCol = 0; eachCol < 20; eachCol++) {
                let arrayIndex = eachRow * 20 + eachCol;

                let x = 16 * eachCol * Sprite.scale - this.cameraX;
                let y = 16 * eachRow * Sprite.scale - this.cameraY;

                if (this.map[arrayIndex] === 1) {
                    this.tree.px = x;
                    this.tree.py = y;
                    this.tree.draw(80, 48);
                }
                if (this.map[arrayIndex] === 2) {
                    this.sword.px = x;
                    this.sword.py = y;
                    this.sword.draw(384, 64);
                }
                if (this.map[arrayIndex] === 3) {
                    this.shield.px = x;
                    this.shield.py = y;
                    this.shield.draw(368, 64);
                }
                if (this.map[arrayIndex] === 4) {
                    this.castle.px = x;
                    this.castle.py = y;
                    this.castle.draw(256, 144);
                }
                if (this.map[arrayIndex] === 5) {
                    this.town.px = x;
                    this.town.py = y;
                    this.town.draw(302, 96);
                }
                if (this.map[arrayIndex] === 6) {
                    this.chest.px = x;
                    this.chest.py = y;
                    this.chest.draw(320, 48);
                }
                if (this.map[arrayIndex] === 7) {
                    this.bornfire.px = x;
                    this.bornfire.py = y;
                    let bornAnim = [];
                    bornAnim["fire"] = this.bornfire.getPosAnimSheet(320, 192, 16, 3);
                    const bornFrames = this.bornfire.animate(this.gameFrame, 30, bornAnim, 'fire')
                    this.bornfire.draw(bornFrames.frameX, bornFrames.frameY)
                }
                if (this.map[arrayIndex] === 8) {
                    this.bush.px = x;
                    this.bush.py = y;
                    this.bush.draw(64, 144);
                }
            }
        }
    }

    updateCamera() {
        // Centraliza a câmera no player
        this.cameraX = this.hero.px - this.CANVAS_WIDTH / 2 + (this.hero.width * Sprite.scale) / 2;
        this.cameraY = this.hero.py - this.CANVAS_HEIGHT / 2 + (this.hero.height * Sprite.scale) / 2;
    }

    applyLighting() {
        // Limpe o canvas pequeno da luz
        this.lightCtxSmall.clearRect(0, 0, this.lightCanvasSmall.width, this.lightCanvasSmall.height);

        // Preencha tudo com uma cor semitransparente para simular a escuridão
        this.lightCtxSmall.fillStyle = "rgba(0, 0, 0, 0.9)";
        this.lightCtxSmall.fillRect(0, 0, this.lightCanvasSmall.width, this.lightCanvasSmall.height);

        // Desenhe um gradiente radial de luz em torno do player
        let lightRadius = 20;  // Menor raio para luz pixelada
        let lightX = (this.hero.px - this.cameraX + this.hero.width / 2 + 6) / (this.CANVAS_WIDTH / this.lightCanvasSmall.width);
        let lightY = (this.hero.py - this.cameraY + this.hero.height / 2 + 6) / (this.CANVAS_HEIGHT / this.lightCanvasSmall.height);

        let gradient = this.lightCtxSmall.createRadialGradient(lightX, lightY, 0, lightX, lightY, lightRadius);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");  // Centro da luz (mais claro)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");        // Bordas (transparente)

        this.lightCtxSmall.globalCompositeOperation = "destination-out";
        this.lightCtxSmall.fillStyle = gradient;
        this.lightCtxSmall.beginPath();
        this.lightCtxSmall.arc(lightX, lightY, lightRadius, 0, Math.PI * 2);
        this.lightCtxSmall.fill();
        this.lightCtxSmall.globalCompositeOperation = "source-over";

        // Adicionar um efeito de granulação para a área escura
        this.addGrain();

        // Desenhe o canvas pequeno no canvas principal ampliando-o
        this.ctx.drawImage(this.lightCanvasSmall, 0, 0, this.lightCanvasSmall.width, this.lightCanvasSmall.height, 0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
    }

    addGrain() {
        let grainSize = 10;  // Tamanho dos grãos menor para pixelar a granulação
        let imageData = this.lightCtxSmall.getImageData(0, 0, this.lightCanvasSmall.width, this.lightCanvasSmall.height);
        let pixels = imageData.data;

        for (let i = 0; i < pixels.length; i += 4 * grainSize) {
            let noise = Math.random() * 50 - 25;
            pixels[i] = pixels[i] + noise;
            pixels[i + 1] = pixels[i + 1] + noise;
            pixels[i + 2] = pixels[i + 2] + noise;
        }

        this.lightCtxSmall.putImageData(imageData, 0, 0);
    }


    draw = () => {
        this.ctx.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
        this.ctx.fillStyle = 'green'
        this.ctx.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT)

        this.updateCamera();

        // draw map
        this.drawMap();

        // debug rect
        Sprite.debugRect = false;

         // player
        const h = this.hero.animate(this.gameFrame, 10, this.hero.animationSheets, this.hero.animState);
        this.hero.px -= this.cameraX;
        this.hero.py -= this.cameraY;
        this.hero.draw(h.frameX, h.frameY);
        this.hero.px += this.cameraX;
        this.hero.py += this.cameraY;

        this.applyLighting()
    }

    update = (dt) => {
        // Atualizar posição da câmera
        this.cameraX = this.hero.px - this.cameraWidth / 2;
        this.cameraY = this.hero.py - this.cameraHeight / 2;

        // Manter a câmera dentro dos limites do mapa
        this.cameraX = Math.max(0, Math.min(this.cameraX, this.CANVAS_WIDTH * 16 - this.cameraWidth));
        this.cameraY = Math.max(0, Math.min(this.cameraY, this.CANVAS_HEIGHT * 16 - this.cameraHeight));

    }

    run = () => {
        let newTime = Date.now();
        let dt = (newTime - this.previousTime) / 1000;
        this.previousTime = newTime;

        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);

        this.gameFrame++;

        this.update(dt);
        this.draw();

        requestAnimationFrame(this.run);
    };
}

window.addEventListener("DOMContentLoaded", () => {
    new Game();
});
