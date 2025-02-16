import { CellConfig } from "../cell/CellConfig";
import { ColorData } from "../cell/ColorData";
import { NoWall, wallConfig, WallConfig } from "../cell/WallConfig";

interface GeneratorConfig {
    height: number,
    width: number,
    directionLikelihoods: {
        up: number,
        left: number,
        right: number,
    }
}

interface MazeData {
    height: number,
    width: number,
    path: Array<number>
}

interface MazeGenerator {
    generate: (cfg: GeneratorConfig) => MazeData
}


let throwIllegalThresholdException = (cfg: GeneratorConfig): never => {
    throw Error(
        "Illegal argument exception!", 
        {
            cause: {
                description:"`cfg.directionLikelihoods` is causing internal errors!",
                directionLikelihoods: cfg.directionLikelihoods,
            }
        }
    );
};

let throwIllegalStateException = (path: Array<number>): never => {
    throw Error(
        "Illegal argument exception!", 
        {
            cause: {
                description:"`path.length` must be greater than 0!",
                length: path.length,
                path,
            }
        }
    );
};

let throwIllegalArgumentException = (cfg: GeneratorConfig): never => {
    throw Error(
        "Illegal argument exception!", 
        {
            cause: {
                description:"`cfg.directionLikelihoods` values cannot sum to 0!",
                likelihoodTotal: 0,
                likelihoods: cfg.directionLikelihoods,
            }
        }
    );
};

let randomNumber = (ceiling: number): number => {
    return Math.floor(Math.random() * ceiling);
};


type PositionIndexMapper = (positionIndex: number) => number | undefined;
let positionIndexRel = (wouldBeOutOfBounds: (positionIndex: number) => boolean, positionMapper: (positionIndex: number) => number): PositionIndexMapper => {
    return ((positionIndex: number) => {
        if (wouldBeOutOfBounds(positionIndex)) {
            return undefined;
        }
        return positionMapper(positionIndex);
    })
};

let defaultGenerator: MazeGenerator = {
    generate: (cfg: GeneratorConfig): MazeData => {
        let { 
            height,
            width,
            directionLikelihoods,
        } = cfg;

        let {
            up: rawUpLikelihood,
            left: rawLeftLikelihood,
            right: rawRightLikelihood,
        } = directionLikelihoods;

        let totalLikelihood: number = rawUpLikelihood + rawLeftLikelihood + rawRightLikelihood;

        if (totalLikelihood === 0) {
            return throwIllegalArgumentException(cfg);
        }

        let upLikelihood: number = rawUpLikelihood / totalLikelihood;
        let leftLikelihood: number = rawLeftLikelihood / totalLikelihood;

        let firstThreshold: number = 0;
        let secondThreshold: number = firstThreshold + upLikelihood;
        let thirdThreshold: number = secondThreshold + leftLikelihood;

        let indexFromCoord = (col: number, row: number): number => {
            return col + (row * width);
        }

        let coordFromIndex = (index: number): [col: number, row: number] => {
            let col = index % width;
            let row = Math.floor(index / width);
            return [col, row];
        }

        
        let positionIndexRight: PositionIndexMapper = positionIndexRel(
            (positionIndex: number) => {
                let [col, _] = coordFromIndex(positionIndex);
                return col + 1 >= width;
            },
            (positionIndex: number) => { 
                let [col, row] = coordFromIndex(positionIndex);
                return indexFromCoord(col + 1, row)
            }
        );

        let positionIndexLeft: PositionIndexMapper = positionIndexRel(
            (positionIndex: number) => {
                let [col, _] = coordFromIndex(positionIndex);
                return col <= 0;
            },
            (positionIndex: number) => { 
                let [col, row] = coordFromIndex(positionIndex);
                return indexFromCoord(col - 1, row)
            }
        );
        
        let positionIndexUp: PositionIndexMapper = positionIndexRel(
            (positionIndex: number) => {
                let [_, row] = coordFromIndex(positionIndex);
                return row + 1 >= width;
            },
            (positionIndex: number) => { 
                let [col, row] = coordFromIndex(positionIndex);
                return indexFromCoord(col, row + 1);
            }
        );
        
        let iteratePath = (path: Array<number>): Array<number> => {
            if (path.length < 1) {
                // This should not be possible, serves as a guard before indexing into the first element
                return throwIllegalStateException(path);
            }

            let pathTail: Array<number> = path.slice(1);

            let currentPositionIndex: number = path[0];
            let [currentRow, currentCol] = coordFromIndex(currentPositionIndex);

            let randomValue: number = randomNumber(10) / 10.0;

            let currentPositionIndexRight: number | undefined = positionIndexRight(currentPositionIndex);
            let currentPositionIndexLeft: number | undefined = positionIndexLeft(currentPositionIndex);
            let currentPositionIndexUp: number | undefined = positionIndexUp(currentPositionIndex); // This value should always be correct, otherwise we would have already exited our iteration!

            let rightMoveAlreadyInPath = (): boolean => {
                return pathTail.findIndex((positionIndex) => positionIndex !== currentPositionIndexRight) !== -1;
            };

            let leftMoveAlreadyInPath = (): boolean => {
                return pathTail.findIndex((positionIndex) => positionIndex !== currentPositionIndexLeft) !== -1;
            };

            if (randomValue >= thirdThreshold && currentPositionIndexRight !== undefined && !rightMoveAlreadyInPath()) {
                return iteratePath([currentPositionIndexRight, ...path]);
            } else if (randomValue >= secondThreshold && currentPositionIndexLeft !== undefined && !leftMoveAlreadyInPath()) {
                return iteratePath([currentPositionIndexLeft, ...path]);
            } else if (randomValue >= firstThreshold) {
                if (currentPositionIndexUp !== undefined) {
                    return iteratePath([currentPositionIndexUp, ...path]);
                }
                return path;
            } else {
                return throwIllegalThresholdException(cfg);
            }
        }

        let randomStartX: number = randomNumber(cfg.width);

        let mazeData: MazeData;
        
        mazeData = {
            path: iteratePath([randomStartX]),
            height,
            width,
        };

        return mazeData;
    }
}

export {
    GeneratorConfig,
    MazeData,
    MazeGenerator,
    defaultGenerator,
}