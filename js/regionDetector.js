class RegionDetector {

    constructor(imageData, minRegionSize = 20){

        this.imageData = imageData;
        this.width = imageData.width;
        this.height = imageData.height;
        this.data = imageData.data;

        this.minRegionSize = minRegionSize;
        this.regions = [];

        this.visited = new Uint8Array(
            this.width * this.height
        );
    }

    getIndex(x, y){
        return y * this.width + x;
    }

    getColor(index){

        const i = index * 4;

        return {
            r: this.data[i],
            g: this.data[i + 1],
            b: this.data[i + 2]
        };
    }

    sameColor(indexA, indexB){

        const a = indexA * 4;
        const b = indexB * 4;

        return (
            this.data[a] === this.data[b] &&
            this.data[a + 1] === this.data[b + 1] &&
            this.data[a + 2] === this.data[b + 2]
        );
    }

    detect(){

        this.regions = [];

        for(let y = 0; y < this.height; y++){

            for(let x = 0; x < this.width; x++){

                const index = this.getIndex(x, y);

                if(this.visited[index]){
                    continue;
                }

                const region = this.floodFill(x, y, index);

                if(region.pixels.length >= this.minRegionSize){

                    this.regions.push(region);

                }
            }
        }

        console.log(
            "Jumlah bidang:",
            this.regions.length
        );

        return this.regions;
    }

    floodFill(startX, startY, startIndex){

        const queue = [startIndex];
        const pixels = [];

        let queuePosition = 0;

        this.visited[startIndex] = 1;

        let totalX = 0;
        let totalY = 0;

        while(queuePosition < queue.length){

            const currentIndex =
                queue[queuePosition++];

            pixels.push(currentIndex);

            const x =
                currentIndex % this.width;

            const y =
                Math.floor(
                    currentIndex / this.width
                );

            totalX += x;
            totalY += y;

            const neighbors = [

                [x - 1, y],
                [x + 1, y],
                [x, y - 1],
                [x, y + 1]

            ];

            for(const [nx, ny] of neighbors){

                if(
                    nx < 0 ||
                    nx >= this.width ||
                    ny < 0 ||
                    ny >= this.height
                ){
                    continue;
                }

                const neighborIndex =
                    this.getIndex(nx, ny);

                if(this.visited[neighborIndex]){
                    continue;
                }

                if(
                    this.sameColor(
                        startIndex,
                        neighborIndex
                    )
                ){

                    this.visited[neighborIndex] = 1;

                    queue.push(neighborIndex);
                }
            }
        }

        const size = pixels.length;

        return {

            id: this.regions.length + 1,

            color: this.getColor(startIndex),

            pixels: pixels,

            size: size,

            centerX: Math.round(totalX / size),

            centerY: Math.round(totalY / size)

        };
    }
    
    drawBoundaries(ctx){

        const output =
            ctx.createImageData(
                this.width,
                this.height
            );

        const outputData = output.data;

        for(let y = 0; y < this.height; y++){

            for(let x = 0; x < this.width; x++){

                const index =
                    this.getIndex(x, y);

                let boundary = false;

                if(x < this.width - 1){

                    const right =
                        this.getIndex(x + 1, y);

                    if(!this.sameColor(index, right)){
                        boundary = true;
                    }
                }

                if(y < this.height - 1){

                    const bottom =
                        this.getIndex(x, y + 1);

                    if(!this.sameColor(index, bottom)){
                        boundary = true;
                    }
                }

                if(boundary){

                    const i = index * 4;

                    outputData[i] = 0;
                    outputData[i + 1] = 0;
                    outputData[i + 2] = 0;
                    outputData[i + 3] = 255;

                }
            }
        }

        ctx.putImageData(output, 0, 0);
    }
}
