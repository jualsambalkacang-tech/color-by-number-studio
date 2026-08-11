class RegionDetector {

    constructor(imageData, minRegionSize = 20){

        this.imageData = imageData;
        this.width = imageData.width;
        this.height = imageData.height;
        this.data = imageData.data;

        this.minRegionSize = minRegionSize;

        this.regions = [];
        this.palette = [];

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

    colorKey(color){

        return `${color.r},${color.g},${color.b}`;
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

        this.visited.fill(0);

        for(let y = 0; y < this.height; y++){

            for(let x = 0; x < this.width; x++){

                const index = this.getIndex(x, y);

                if(this.visited[index]){
                    continue;
                }

                const region =
                    this.floodFill(x, y, index);

                if(region.pixels.length >= this.minRegionSize){

                    this.regions.push(region);
                }
            }
        }

        this.createPalette();

        console.log(
            "Jumlah bidang:",
            this.regions.length
        );

        console.log(
            "Jumlah warna:",
            this.palette.length
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

            id: 0,

            color: this.getColor(startIndex),

            pixels: pixels,

            size: size,

            centerX:
                Math.round(totalX / size),

            centerY:
                Math.round(totalY / size)

        };
    }

    createPalette(){

        const paletteMap = new Map();

        for(const region of this.regions){

            const key =
                this.colorKey(region.color);

            if(!paletteMap.has(key)){

                paletteMap.set(
                    key,
                    {
                        number:
                            paletteMap.size + 1,

                        color:
                            region.color
                    }
                );
            }

            region.number =
                paletteMap.get(key).number;
        }

        this.palette =
            Array.from(
                paletteMap.values()
            );
    }

    drawBoundaries(ctx){

        ctx.save();

        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;

        for(const region of this.regions){

            for(const index of region.pixels){

                const x =
                    index % this.width;

                const y =
                    Math.floor(
                        index / this.width
                    );

                if(x < this.width - 1){

                    const right =
                        this.getIndex(x + 1, y);

                    if(!this.sameColor(index, right)){

                        ctx.fillRect(
                            x,
                            y,
                            1,
                            1
                        );
                    }
                }

                if(y < this.height - 1){

                    const bottom =
                        this.getIndex(x, y + 1);

                    if(!this.sameColor(index, bottom)){

                        ctx.fillRect(
                            x,
                            y,
                            1,
                            1
                        );
                    }
                }
            }
        }

        ctx.restore();
    }

    drawNumbers(ctx){

        ctx.save();

        ctx.font = "bold 14px Arial";

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillStyle = "#000000";

        for(const region of this.regions){

            if(region.size <
                this.minRegionSize){

                continue;
            }

            ctx.fillText(

                region.number,

                region.centerX,

                region.centerY

            );
        }

        ctx.restore();
    }

}
