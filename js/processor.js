
class ImageProcessor {

    constructor(canvas){

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

    }

    getImageData(){

        return this.ctx.getImageData(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

    }

    simplify(level = 64){

        const imageData = this.getImageData();

        const data = imageData.data;

        for(let i=0;i<data.length;i+=4){

            data[i] =
                Math.round(data[i]/level)*level;

            data[i+1] =
                Math.round(data[i+1]/level)*level;

            data[i+2] =
                Math.round(data[i+2]/level)*level;

        }

        this.ctx.putImageData(imageData,0,0);

        return imageData;

    }

}
