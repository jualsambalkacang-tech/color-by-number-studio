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

                const startIndex = this.getIndex(x, y);

                if(this.visited[startIndex]){
                    continue;
                }

                const region = this.floodFill(
                    x,
                    y,
                    startIndex
                );

                if(region.pixels.length >= this.minRegionSize){

                    this.regions.push(region);

                }

            }

        }

        console.log(
            "Jumlah region:",
            this.regions.length
        );

        return this.regions;
    }

    floodFill(startX, startY, startIndex){

        const queue = [];

        const pixels = [];

        let queuePosition = 0;

        queue.push(startIndex);

        this.visited[startIndex] = 1;

        const color = this.getColor(startIndex);

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

        return {

            id: this.regions.length + 1,

            color: color,

            pixels: pixels,

            size: pixels.length

        };

    }

}
