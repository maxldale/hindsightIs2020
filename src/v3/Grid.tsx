import { GestureResponderEvent, Pressable, StyleSheet, View } from "react-native";
import { BaseCell, BaseCellProps } from "./BaseCell"
import { CellColorPallette } from "./CellColorPalette";
import { CompoundCell, CompoundCellProps, isCompoundCellProps } from "./CompoundCell";
import { BottomWallType, TopWallType } from "./WallType";
import { useEffect, useState } from "react";

interface BaseCellGenArgs {
    rows: number;
    columns: number;
    cellWidth: number;
    cellHeight: number;
    colorPalette: CellColorPallette;
    borderThickness: number;
    isRevealed: boolean;
    pathIndices: Array<number>;
}

const genBaseCellProps: (args: BaseCellGenArgs) => Array<Array<BaseCellProps>> = (args: BaseCellGenArgs) => {
    let {
        rows,
        columns,
        cellWidth: width,
        cellHeight: height,
        colorPalette,
        borderThickness,
        isRevealed,
        pathIndices,
    } = args;

    type WallChecker = (cellIndex: number) => boolean;

    const cellIsOnStartBoundary: WallChecker = (cellIndex: number) => { return cellIndex % columns === 0; }
    const cellIsOnEndBoundary: WallChecker = (cellIndex: number) => { return cellIndex % columns === columns - 1; }

    const cellStartNeighborInPath: WallChecker = (cellIndex: number) => { return pathIndices.includes(cellIndex - 1); }
    const cellEndNeighborInPath: WallChecker = (cellIndex: number) => { return pathIndices.includes(cellIndex + 1); }

    const cellIsOnFinishBoundary: WallChecker = (cellIndex: number) => { return cellIndex === pathIndices[0]; }
    const cellIsOnRealStartBoundary: WallChecker = (cellIndex: number) => { return cellIndex === pathIndices[pathIndices.length - 1]; }

    const cellTopNeighborInPath: WallChecker = (cellIndex: number) => { return pathIndices.includes(cellIndex - columns); }
    const cellBottomNeighborInPath: WallChecker = (cellIndex: number) => { return pathIndices.includes(cellIndex + columns); }

    return Array.from({ length: rows }, (_, rowIndex) => {
        return Array.from({ length: columns }, (_, columnIndex) => {
            let cellIndex = rowIndex * columns + columnIndex;
            let isPath = pathIndices.includes(cellIndex);
            let hasStartWall = isPath && (cellIsOnStartBoundary(cellIndex) || !cellStartNeighborInPath(cellIndex));
            let hasEndWall = isPath && (cellIsOnEndBoundary(cellIndex) || !cellEndNeighborInPath(cellIndex));
            let topWall: TopWallType = isPath ? cellIsOnFinishBoundary(cellIndex) ? 'BordersEnd' : !cellTopNeighborInPath(cellIndex) ? 'Wall' : 'NoWall' : 'NoWall';
            let bottomWall: BottomWallType = isPath ? cellIsOnRealStartBoundary(cellIndex) ? 'BordersStart' : !cellBottomNeighborInPath(cellIndex) ? 'Wall' : 'NoWall' : 'NoWall';
            let startTopNeedsInvertedCorner = isPath ? !cellIsOnStartBoundary(cellIndex) && !cellIsOnFinishBoundary(cellIndex) && cellStartNeighborInPath(cellIndex) && cellTopNeighborInPath(cellIndex) : false;
            let startBottomNeedsInvertedCorner = isPath ? !cellIsOnStartBoundary(cellIndex) && !cellIsOnRealStartBoundary(cellIndex) && cellStartNeighborInPath(cellIndex) && cellBottomNeighborInPath(cellIndex) : false;
            let endTopNeedsInvertedCorner = isPath ? !cellIsOnEndBoundary(cellIndex) && !cellIsOnFinishBoundary(cellIndex) && cellEndNeighborInPath(cellIndex) && cellTopNeighborInPath(cellIndex) : false;
            let endBottomNeedsInvertedCorner = isPath ? !cellIsOnEndBoundary(cellIndex) && !cellIsOnRealStartBoundary(cellIndex) && cellEndNeighborInPath(cellIndex) && cellBottomNeighborInPath(cellIndex) : false;

            let newCell: BaseCellProps = {
                key: cellIndex,
                width,
                height,
                colorPalette,
                borderThickness,
                isRevealed,
                isPath,
                hasStartWall,
                hasEndWall,
                topWall,
                bottomWall,
                startTopNeedsInvertedCorner,
                startBottomNeedsInvertedCorner,
                endTopNeedsInvertedCorner,
                endBottomNeedsInvertedCorner,
            };

            return newCell;
        });
    });
}

interface BaseCellWrapArgs {
    baseCells: Array<Array<BaseCellProps>>;
    colorPalette: CellColorPallette;
    branchingFactor: number;
    isRevealed: boolean;
}

const wrapBaseCellProps: (args: BaseCellWrapArgs) => Array<Array<CompoundCellProps>> = (args: BaseCellWrapArgs) => {
    let {
        baseCells,
        colorPalette,
        branchingFactor,
        isRevealed,
    } = args;

    let baseRowCount = baseCells.length;


    if (baseRowCount % branchingFactor !== 0) {
        throw new Error('Rows must be divisible by the branching factor');
    }

    let firstRow = baseCells[0];
    let baseColumnCount = firstRow.length;

    if (baseColumnCount % branchingFactor !== 0) {
        throw new Error('Columns must be divisible by the branching factor');
    }

    let rows = baseRowCount / branchingFactor;
    let columns = baseColumnCount / branchingFactor;

    let firstBaseCell = firstRow[0];
    let height = firstBaseCell.height * branchingFactor;
    let width = firstBaseCell.width * branchingFactor;

    const collectBaseCells = (startRow: number, startColumn: number) => {
        return Array.from({ length: branchingFactor }, (_, relChildRowIndex) => {
            let relRow = startRow + relChildRowIndex;
            return Array.from({ length: branchingFactor }, (_, relChildColumnIndex) => {
                let relColumn = startColumn + relChildColumnIndex;
                return baseCells[relRow][relColumn];
            });
        });
    }

    return Array.from({ length: rows }, (_, rowIndex) => {
        let startRow = rowIndex * branchingFactor;
        return Array.from({ length: columns }, (_, columnIndex) => {
            let startColumn = columnIndex * branchingFactor;
            let childrenProps = collectBaseCells(startRow, startColumn);

            let newCell: CompoundCellProps = {
                key: `${rowIndex * columns + columnIndex}-${startRow * columns + startColumn}`,
                width,
                height,
                colorPalette,
                isRevealed,
                childrenProps,
            }

            return newCell;
        });
    });
}

interface CompoundCellWrapArgs {
    baseCells: Array<Array<CompoundCellProps>>;
    colorPalette: CellColorPallette;
    branchingFactor: number;
    isRevealed: boolean;

}

const wrapCompoundCellProps: (args: CompoundCellWrapArgs) => Array<Array<CompoundCellProps>> = (args: CompoundCellWrapArgs) => {
    let {
        baseCells,
        colorPalette,
        branchingFactor,
        isRevealed,
    } = args;

    let baseRowCount = baseCells.length;


    if (baseRowCount % branchingFactor !== 0) {
        throw new Error('Rows must be divisible by the branching factor');
    }

    let firstRow = baseCells[0];
    let baseColumnCount = firstRow.length;

    if (baseColumnCount % branchingFactor !== 0) {
        throw new Error('Columns must be divisible by the branching factor');
    }

    let rows = baseRowCount / branchingFactor;
    let columns = baseColumnCount / branchingFactor;

    let firstBaseCell = firstRow[0];
    let height = firstBaseCell.height * branchingFactor;
    let width = firstBaseCell.width * branchingFactor;

    const collectBaseCells = (startRow: number, startColumn: number) => {
        return Array.from({ length: branchingFactor }, (_, relChildRowIndex) => {
            let relRow = startRow + relChildRowIndex;
            return Array.from({ length: branchingFactor }, (_, relChildColumnIndex) => {
                let relColumn = startColumn + relChildColumnIndex;
                return baseCells[relRow][relColumn];
            });
        });
    }

    return Array.from({ length: rows }, (_, rowIndex) => {
        let startRow = rowIndex * branchingFactor;
        return Array.from({ length: columns }, (_, columnIndex) => {
            let startColumn = columnIndex * branchingFactor;
            let childrenProps = collectBaseCells(startRow, startColumn);

            let newCell: CompoundCellProps = {
                key: `${rowIndex * columns + columnIndex}-${startRow * columns + startColumn}`,
                width,
                height,
                colorPalette,
                isRevealed,
                childrenProps,
            }

            return newCell;
        });
    });
}

interface GridProps {
    width: number;
    height: number;
    rows: number;
    columns: number;
    borderThickness: number;
    branchingFactor: number;
    branchingDepth: number;
    colorPalette: CellColorPallette;
    isRevealed: boolean;
    pathIndices: Array<number>;
}

const Grid: React.FC<GridProps> = (props: GridProps) => {
    let {
        width,
        height,
        rows,
        columns,
        borderThickness,
        branchingFactor,
        branchingDepth,
        colorPalette,
        isRevealed,
        pathIndices,
    } = props;
    
    const [hasRegisteredPressIn, setHasRegisteredPressIn] = useState(false);

    let requiredCommonFactor = Math.pow(branchingFactor, branchingDepth);
    if (rows % requiredCommonFactor !== 0) {
        throw new Error("The number of rows must be divisible by the branching factor to the power of the branching depth!");
    }

    if (columns % requiredCommonFactor !== 0) {
        throw new Error("The number of columns must be divisible by the branching factor to the power of the branching depth!");
    }

    let cellWidth = width / columns;
    let cellHeight = height / rows;

    const generateInitialState = () => {
        let baseCells = genBaseCellProps({
            borderThickness,
            cellHeight,
            cellWidth,
            colorPalette,
            columns,
            rows,
            isRevealed,
            pathIndices,
        });
    
        let initialCompoundCells = wrapBaseCellProps({
            baseCells,
            branchingFactor,
            colorPalette,
            isRevealed,
        });
    
        if (branchingDepth === 1) {
            return initialCompoundCells;
        }
    
        const iterateCompounding: (currentCompoundCells: Array<Array<CompoundCellProps>>, remainingIterations: number) => Array<Array<CompoundCellProps>> = (currentCompoundCells: Array<Array<CompoundCellProps>>, remainingIterations: number) => {
            if (remainingIterations === 0) {
                return currentCompoundCells
            }
    
            let nextIterationOfCells = wrapCompoundCellProps({
                baseCells: currentCompoundCells,
                branchingFactor,
                colorPalette,
                isRevealed,
            });
    
            return iterateCompounding(nextIterationOfCells, remainingIterations - 1);
        }
    
        return iterateCompounding(initialCompoundCells, branchingDepth - 1);
    }

    const [gridCells, setGridCells] = useState(generateInitialState());
    
    const onGridPressIn = (event: GestureResponderEvent) => {
        setHasRegisteredPressIn(_ => true);
    };

    //console.log(JSON.stringify(gridCells));

    useEffect(() => {

    }, [gridCells]);
    
    const onGridPressOut = (event: GestureResponderEvent) => {
        if (hasRegisteredPressIn) {
            const { locationX, locationY } = event.nativeEvent;
            if (locationX >= 0 && locationX <= cellWidth * props.columns && locationY >= 0 && locationY <= cellHeight * props.rows) {
                console.log(`Touch End - X: ${locationX}, Y: ${locationY}`);
                let firstCell = gridCells[0][0];
                console.log(firstCell.width);
                console.log(firstCell.height);
                let row = Math.floor(locationY / firstCell.height);
                let column = Math.floor(locationX / firstCell.width);
                let yOffset = firstCell.height * column;
                let xOffset = firstCell.width * row; 
                console.log(`Grid position: (c: ${column}, r: ${row})`);
                setGridCells(currentGridCells => {
                    return currentGridCells.map((cellRow, rowIndex) => {
                        return cellRow.map((cell, columnIndex) => {
                            if (rowIndex === row && columnIndex === column) {
                                const cascadeReveals = <A extends CompoundCellProps | BaseCellProps,>(targetedCell: A, xOffset: number, yOffset: number): A => {
                                    targetedCell.isRevealed = true;
            
                                    if (isCompoundCellProps(targetedCell)) {
                                        let firstCell = targetedCell.childrenProps[0][0];
                                        console.log(firstCell.width);
                                        console.log(firstCell.height);
                                        let row = Math.floor(yOffset / firstCell.height);
                                        let column = Math.floor(xOffset / firstCell.width);
                                        
                                        console.log(`Row: ${row}`);
                                        console.log(`Column: ${column}`);
                                        let newYOffset = firstCell.height * column;
                                        let newXOffset = firstCell.width * row;
                                        
                                        console.log(`newDeltaY: ${newYOffset}`);
                                        console.log(`newDeltaX: ${newXOffset}`);
            
                                        console.log(firstCell.width);
                                        console.log(firstCell.height);
                                        targetedCell.childrenProps[row][column] = cascadeReveals(targetedCell.childrenProps[row][column], xOffset - newXOffset, yOffset - newYOffset);
                                    } else {
                                        console.log(targetedCell.key);
                                        targetedCell.isRevealed = true;
                                    }
            
                                    return targetedCell;
                                }
                                
                                if (isCompoundCellProps(cell)) {
                                    cell = cascadeReveals(cell, locationX - xOffset, locationY - yOffset);
                                }
                                return cell;
                            }
                        });
                    });
                })
            } // otherwise, the touch event ended outside the grid, discard it
            setHasRegisteredPressIn(_ => false);
        }
    };

    

    return (
        <Pressable onPressIn={onGridPressIn} onPressOut={onGridPressOut} style={styles.container}>
            {gridCells.map((row, rowIndex) => {
                return (
                    <View key={`grid-${rowIndex}`} style={styles.row}>
                        {row.map(cellProps => {
                            return CompoundCell(cellProps);
                        })}
                    </ View>
                )
            })}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: "100%",
        flexWrap: "nowrap",
    },
});

export type { BaseCellGenArgs, BaseCellWrapArgs, CompoundCellProps, GridProps }

export { genBaseCellProps, wrapBaseCellProps, wrapCompoundCellProps, Grid }