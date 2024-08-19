export default class Light {
    constructor(CANVAS_WIDTH, CANVAS_HEIGHT) {

        // canvas menor para a luz pixelada
        this.lightCanvasSmall = document.createElement("canvas");
        this.lightCanvasSmall.width = 64;  // Pequeno para pixelar a luz
        this.lightCanvasSmall.height = 64;
        this.lightCtxSmall = this.lightCanvasSmall.getContext("2d");

        //canvas normal para desenhar a luz final
        this.lightCanvas = document.createElement("canvas");
        this.lightCanvas.width = CANVAS_WIDTH;
        this.lightCanvas.height = CANVAS_HEIGHT;
        this.lightCtx = this.lightCanvas.getContext("2d");
    }

    applyLighting(ctx, CANVAS_WIDTH, CANVAS_HEIGHT, hero, cameraX, cameraY) {
        // limpar o canvas pequeno da luz
        this.lightCtxSmall.clearRect(0, 0, this.lightCanvasSmall.width, this.lightCanvasSmall.height);

        // preencher tudo com uma cor semitransparente para simular a escuridão
        this.lightCtxSmall.fillStyle = "rgba(0, 0, 0, 0.9)";
        this.lightCtxSmall.fillRect(0, 0, this.lightCanvasSmall.width, this.lightCanvasSmall.height);

        // desenhar um gradiente radial de luz em torno do player
        let lightRadius = 20;  // Menor raio para luz pixelada
        let lightX = (hero.px - cameraX + hero.width / 2 + 6) / (CANVAS_WIDTH / this.lightCanvasSmall.width);
        let lightY = (hero.py - cameraY + hero.height / 2 + 6) / (CANVAS_HEIGHT / this.lightCanvasSmall.height);

        let gradient = this.lightCtxSmall.createRadialGradient(lightX, lightY, 0, lightX, lightY, lightRadius);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");  // Centro da luz (mais claro)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");        // Bordas (transparente)

        this.lightCtxSmall.globalCompositeOperation = "destination-out";
        this.lightCtxSmall.fillStyle = gradient;
        this.lightCtxSmall.beginPath();
        this.lightCtxSmall.arc(lightX, lightY, lightRadius, 0, Math.PI * 2);
        this.lightCtxSmall.fill();
        this.lightCtxSmall.globalCompositeOperation = "source-over";

        // adicionar um efeito de granulação para a área escura
        this.addGrain();

        // desenhar o canvas pequeno no canvas principal ampliando-o
        ctx.drawImage(this.lightCanvasSmall, 0, 0, this.lightCanvasSmall.width, this.lightCanvasSmall.height, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
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
}