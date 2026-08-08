class ColorQuantizer {

    constructor(level = 6){
        this.level = level;
    }

    quantize(imageData){

        const data = imageData.data;

        const step = Math.floor(256 / this.level);

        for(let i=0;i<data.length;i+=4){

            data[i] =
                Math.floor(data[i] / step) * step;

            data[i+1] =
                Math.floor(data[i+1] / step) * step;

            data[i+2] =
                Math.floor(data[i+2] / step) * step;

        }

        return imageData;

    }

}
