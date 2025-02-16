import { Children } from "react";

type WallType = 'NoWall' | 'Wall';
type TopWallType = WallType | 'EndBorder';
type BottomWallType = WallType | 'StartBorder';

interface OmNonNonProps {
    // The total number of rows in the grid
    rows: number;

    // The total number of columns in the grid
    columns: number;

    // The branching factor of the grid
    branchingFactor: number;

    // The depth of the branches in the grid
    branchDepth: number;

    // The path indices for the grid
    pathIndices: Array<number>;

    // The width of each cell in the grid
    cellWidth: number;

    // The height of each cell in the grid
    cellHeight: number;

    // The thickness of the border of each cell in the grid
    borderThickness: number;

    // The color of the start edge of the path
    startColor: string;

    // The color of the finish edge of the path
    finishColor: string;

    // The color of the path
    pathColor: string;

    // The color of the unrevealed cells
    unrevealedColor: string;

    // The color of the void cells
    voidColor: string;

    // The color of the walls
    wallColor: string;
}

interface BaseNon {
    // Whether the cell is revealed to the player or not
    isRevealed: boolean;

    // Whether the cell is part of the path or not
    isPath: boolean;

    // The wall type for the 'start' (left or right depending on locality) of this cell
    hasStartWall: boolean;

    // The wall type for the 'end' (right or left depending on locality) of this cell
    hasEndWall: boolean;

    // The wall type for the top of this cell
    topWall: TopWallType;

    // The wall type for the bottom of this cell
    bottomWall: BottomWallType;
}

interface Non {
    // Whether the cell is revealed to the player or not
    isRevealed: boolean;

    // The children that make up the contents of this cell
    children: Array<Non|BaseNon>;
}

const isBaseNon = (non: Non|BaseNon): non is BaseNon => {
    return (non as BaseNon).hasStartWall !== undefined;
}

const isNon = (non: Non|BaseNon): non is Non => {
    return (non as Non).children !== undefined;
}

const OmNomNom: (props: OmNonNonProps) => Array<Non> = (props: OmNonNonProps) => {
    let {
        rows,
        columns,
        branchingFactor,
        branchDepth,
        pathIndices,
        cellWidth,
        cellHeight,
        borderThickness,
        startColor,
        finishColor,
        pathColor,
        unrevealedColor,
        voidColor,
        wallColor,
    } = props;
    let requiredCommonFactor: number = Math.pow(branchingFactor, branchDepth);
    if (rows % requiredCommonFactor !== 0) {
        throw new Error('Rows must be divisible by the branching factor raised to the branch depth');
    }

    if (columns % requiredCommonFactor !== 0) {
        throw new Error('Columns must be divisible by the branching factor raised to the branch depth');
    }

    let branchFactorSquared: number = Math.pow(branchingFactor, 2);

    let isRevealed: boolean = false; // Nothing starts revealed, for testing reveal all cells
    
    let genBaseNon = (cellIndex: number): BaseNon => {
        let isPath = pathIndices.includes(cellIndex);
        let hasStartWall = isPath && (cellIndex % columns === 0 || !pathIndices.includes(cellIndex - 1));
        let hasEndWall = isPath && (cellIndex % columns === columns - 1 || !pathIndices.includes(cellIndex + 1));
        let topWall: TopWallType = isPath ? cellIndex === pathIndices[0] ? 'EndBorder' : !pathIndices.includes(cellIndex - columns) ? 'Wall' : 'NoWall' : 'NoWall';
        let bottomWall: BottomWallType = isPath ? cellIndex === pathIndices[pathIndices.length - 1] ? 'StartBorder' : !pathIndices.includes(cellIndex + columns) ? 'Wall' : 'NoWall' : 'NoWall';
        return {
            isRevealed,
            isPath,
            hasStartWall,
            hasEndWall,
            topWall,
            bottomWall,
        }
    }

    let wrapBaseNons = (baseNons: Array<BaseNon>): Array<Non> => {
        let scaledRows = rows / branchingFactor;
        let scaledColumns = columns / branchingFactor;
        let scaledNumNons = scaledRows * scaledColumns;
        return Array.from({ length: scaledNumNons}, (_, cellIndex) => {
            let startRow = Math.floor(cellIndex / scaledColumns) * branchingFactor;
            let startColumn = (cellIndex % scaledColumns) * branchingFactor;
            let startIndex = startRow * columns + startColumn;
            let children = Array.from({ length: branchFactorSquared }, (_, index) => {
                let mappedIndex = startIndex + Math.floor(index / branchingFactor) * columns + (index % branchingFactor);
                return baseNons[mappedIndex];
            });
            return {
                isRevealed,
                children,
            };
        });
    }

    let wrapNons = (nons: Array<Non>): Array<Non> => {
        let scaledRows = rows / branchingFactor;
        let scaledColumns = columns / branchingFactor;
        let scaledNumNons = scaledRows * scaledColumns;
        return Array.from({ length: scaledNumNons}, (_, cellIndex) => {
            let startRow = Math.floor(cellIndex / scaledColumns) * branchingFactor;
            let startColumn = (cellIndex % scaledColumns) * branchingFactor;
            let startIndex = startRow * columns + startColumn;
            let children = Array.from({ length: branchFactorSquared }, (_, index) => {
                let mappedIndex = startIndex + Math.floor(index / branchingFactor) * columns + (index % branchingFactor);
                return nons[mappedIndex];
            });
            return {
                isRevealed,
                children,
            };
        });
    }

    let baseNons = Array.from({ length: rows * columns }, (_, cellIndex) => genBaseNon(cellIndex));
    let nons = wrapBaseNons(baseNons);

    if (branchDepth <= 1) {
        return nons;
    } else {
        let non = wrapNons(nons);
        for (let depth = 2; depth < branchDepth; depth++) {
            non = wrapNons(non);
        }
        return non;
    }
}

export type { OmNonNonProps, BaseNon, Non };
export { OmNomNom }