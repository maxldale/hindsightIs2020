import { ColorPalette } from "./ColorPalette";
import React, { useEffect, useMemo, useState } from "react";
import { Direction, InvertedCorners, NoInvertedCorners, NoWalls, RequiresInvertedCorners, WallData, WallType, WallTypes } from "./WallData";
import { Cell, CellConfig, CellProps, CellType, PathCellType, UnrevealedCellType, VoidCellType } from "./Cell";
import { Pressable, StyleSheet, View } from "react-native";

interface GridConfig {
    columnCount: number;
    rowCount: number;
    pathData: Array<number>;
}

type ActionResponse = 'ALLOWED' | 'ABORTED';

interface GridProps {
    width: number;
    height: number;
    wallThickness: number;
    gridConfig: GridConfig;
    colorPalette: ColorPalette;
    playerActionConsumer: (cellIndex: number) => ActionResponse;
    playerActionResultConsumer: (wasAborted: boolean, cellType: CellType) => void;
}

const MemoizedCell = React.memo(Cell);

type WallChecker = (cellIndex: number) => boolean;

const VoidCellConfig: CellConfig = {
    cellType: VoidCellType,
    wallData: NoWalls,
    invertedCorners: NoInvertedCorners,
}

const Grid: React.FC<GridProps> = (props) => {
    let {
        width,
        height,
        wallThickness,
        gridConfig: {
            columnCount,
            rowCount,
            pathData,
        },
        colorPalette,
        playerActionConsumer,
        playerActionResultConsumer,
    } = props;


    const [gridVisibility, setGridVisibility] = useState(Array.from({ length: columnCount * rowCount }, () => false));

    

    useEffect(() => {
        setGridVisibility(Array.from({ length: columnCount * rowCount }, () => false));
    }, [pathData]);

    const cellWidth = width / columnCount;
    const cellHeight = height / rowCount;

    const cellIsOnStartBoundary: WallChecker = (cellIndex: number) => { return cellIndex % columnCount === 0; }
    const cellIsOnEndBoundary: WallChecker = (cellIndex: number) => { return cellIndex % columnCount === columnCount - 1; }

    const cellStartNeighborInPath: WallChecker = (cellIndex: number) => { return pathData.includes(cellIndex - 1); }
    const cellEndNeighborInPath: WallChecker = (cellIndex: number) => { return pathData.includes(cellIndex + 1); }

    const cellIsOnFinishBoundary: WallChecker = (cellIndex: number) => { return cellIndex === pathData[0]; }
    const cellIsOnRealStartBoundary: WallChecker = (cellIndex: number) => { return cellIndex === pathData[pathData.length - 1]; }

    const cellTopNeighborInPath: WallChecker = (cellIndex: number) => { return pathData.includes(cellIndex - columnCount); }
    const cellBottomNeighborInPath: WallChecker = (cellIndex: number) => { return pathData.includes(cellIndex + columnCount); }
    
    const cellIsOnTopBoundary: WallChecker = (cellIndex: number) => { return cellIndex < columnCount; }
    const cellIsOnBottomBoundary: WallChecker = (cellIndex: number) => { return (rowCount - 1) * columnCount <= cellIndex; }

    const cellConfigs: Array<CellConfig> = useMemo(() => {

        const calcWallData: (cellIndex: number) => WallTypes = (cellIndex: number) => {
            return [
                cellIsOnStartBoundary(cellIndex) || !cellStartNeighborInPath(cellIndex) ? WallType.WALL : WallType.NO_WALL,
                cellIsOnFinishBoundary(cellIndex) ? WallType.FINISH_EDGE : !cellTopNeighborInPath(cellIndex) ? WallType.WALL : WallType.NO_WALL,
                cellIsOnEndBoundary(cellIndex) || !cellEndNeighborInPath(cellIndex) ? WallType.WALL : WallType.NO_WALL,
                cellIsOnRealStartBoundary(cellIndex) ? WallType.BEGIN_EDGE : !cellBottomNeighborInPath(cellIndex) ? WallType.WALL : WallType.NO_WALL,
            ];
        }

        const calcInvertedCorners: (cellIndex: number) => InvertedCorners = (cellIndex: number) => {
            let startTopNeedsInvertedCorner = !cellIsOnStartBoundary(cellIndex) && !cellIsOnTopBoundary(cellIndex) && cellStartNeighborInPath(cellIndex) && cellTopNeighborInPath(cellIndex);
            let startBottomNeedsInvertedCorner = !cellIsOnStartBoundary(cellIndex) && !cellIsOnBottomBoundary(cellIndex) && cellStartNeighborInPath(cellIndex) && cellBottomNeighborInPath(cellIndex);
            let endTopNeedsInvertedCorner = !cellIsOnEndBoundary(cellIndex) && !cellIsOnTopBoundary(cellIndex) && cellEndNeighborInPath(cellIndex) && cellTopNeighborInPath(cellIndex);
            let endBottomNeedsInvertedCorner = !cellIsOnEndBoundary(cellIndex) && !cellIsOnBottomBoundary(cellIndex) && cellEndNeighborInPath(cellIndex) && cellBottomNeighborInPath(cellIndex);

            if (!startTopNeedsInvertedCorner && !startBottomNeedsInvertedCorner && !endTopNeedsInvertedCorner && !endBottomNeedsInvertedCorner) {
                return NoInvertedCorners;
            } else {
                return [startTopNeedsInvertedCorner, endTopNeedsInvertedCorner, endBottomNeedsInvertedCorner, startBottomNeedsInvertedCorner];
            }
        }


        return Array.from({ length: columnCount * rowCount }, (_, index) => {
            let column = index % columnCount;
            let row = Math.floor(index / columnCount);

            if (pathData.includes(index)) {

                return {
                    cellType: PathCellType,
                    wallData: calcWallData(index),
                    invertedCorners: calcInvertedCorners(index),
                }
            } else {
                return VoidCellConfig;
            }
        });
    }, [columnCount, rowCount, pathData]);

    const revealCell = (cellIndex: number) => {
        let cellType: CellType = cellConfigs[cellIndex].cellType;
        let actionAborted: boolean = playerActionConsumer(cellIndex) === 'ABORTED';
        if (actionAborted) {
            if (!gridVisibility[cellIndex]) {
                cellType = UnrevealedCellType;
            }
        } else {
            setGridVisibility((prevGridVisibility) => {
                let newGridVisibility = [...prevGridVisibility];
                newGridVisibility[cellIndex] = true;
                return newGridVisibility;
            });
        }
        playerActionResultConsumer(actionAborted, cellType);
    }
    
    const cellStartNeighborRevealed: WallChecker = (cellIndex: number) => { return gridVisibility[cellIndex - 1]; }
    const cellEndNeighborRevealed: WallChecker = (cellIndex: number) => { return gridVisibility[cellIndex + 1]; }

    const cellTopNeighborRevealed: WallChecker = (cellIndex: number) => { return gridVisibility[cellIndex - columnCount]; }
    const cellBottomNeighborRevealed: WallChecker = (cellIndex: number) => { return gridVisibility[cellIndex + columnCount]; }

    const renderCells = () => {
        let cells = cellConfigs.map((cellConfig, cellIndex) => {
            let isRevealed = gridVisibility[cellIndex];
            let neighborsRevealed = [
                cellIsOnStartBoundary(cellIndex) || cellStartNeighborRevealed(cellIndex),
                cellIsOnTopBoundary(cellIndex)|| cellTopNeighborRevealed(cellIndex),
                cellIsOnEndBoundary(cellIndex) || cellEndNeighborRevealed(cellIndex),
                cellIsOnBottomBoundary(cellIndex) || cellBottomNeighborRevealed(cellIndex),
            ];
            let cornersRevealed = [
                !cellIsOnStartBoundary(cellIndex) && !cellIsOnTopBoundary(cellIndex) && cellStartNeighborRevealed(cellIndex) && cellTopNeighborRevealed(cellIndex) && gridVisibility[cellIndex - columnCount - 1],
                !cellIsOnTopBoundary(cellIndex) && !cellIsOnEndBoundary(cellIndex) && cellTopNeighborRevealed(cellIndex) && cellEndNeighborRevealed(cellIndex) && gridVisibility[cellIndex - columnCount + 1],
                !cellIsOnEndBoundary(cellIndex) && !cellIsOnBottomBoundary(cellIndex) && cellEndNeighborRevealed(cellIndex) && cellBottomNeighborRevealed(cellIndex) && gridVisibility[cellIndex + columnCount + 1],
                !cellIsOnBottomBoundary(cellIndex) && !cellIsOnStartBoundary(cellIndex) && cellBottomNeighborRevealed(cellIndex) && cellStartNeighborRevealed(cellIndex) && gridVisibility[cellIndex + columnCount - 1],
            ];
            let augmentedWallData: WallData = cellConfig.wallData === NoWalls ? cellConfig.wallData : cellConfig.wallData.map((wallType, index) => {
                return neighborsRevealed[index] ? wallType : WallType.NO_WALL;
            }) as WallTypes;
            let augmentedInvertedCorners: InvertedCorners = cellConfig.invertedCorners === NoInvertedCorners ? cellConfig.invertedCorners : cellConfig.invertedCorners.map((requiresInvertedCorner, index) => {
                return cornersRevealed[index] ? requiresInvertedCorner : false;
            }) as RequiresInvertedCorners;
            let augmentedCellConfig: CellConfig = {
                cellType: cellConfig.cellType,
                wallData: augmentedWallData,
                invertedCorners: augmentedInvertedCorners,
            }
            let cellProps: CellProps = {
                cellIndex: cellIndex,
                width: cellWidth,
                height: cellHeight,
                borderThickness: wallThickness,
                cellConfig: augmentedCellConfig,
                isRevealed,
                colorPalette,
            };
            return (
                <MemoizedCell {...cellProps} />
            );
        });

        return (
            <View style={styles.grid}>
                {
                    Array.from({ length: rowCount }, (_, rowIndex) => {
                        let start = rowIndex * columnCount;
                        let end = start + columnCount;
                        return (
                            <View key={`row-${rowIndex}`} style={styles.row}>
                                {cells.slice(start, end).map((cell, columnIndex) => {
                                    let cellIndex = start + columnIndex;
                                    let isStartCell = cellConfigs[cellIndex].wallData[Direction.BOTTOM] === WallType.BEGIN_EDGE;
                                    let isNeighborRevealed = (!cellIsOnStartBoundary(cellIndex) && gridVisibility[cellIndex - 1] && cellConfigs[cellIndex - 1].cellType === PathCellType) ||
                                    (!cellIsOnTopBoundary(cellIndex) && gridVisibility[cellIndex - columnCount] && cellConfigs[cellIndex - columnCount].cellType === PathCellType) ||
                                    (!cellIsOnEndBoundary(cellIndex) && gridVisibility[cellIndex + 1] && cellConfigs[cellIndex + 1].cellType === PathCellType) ||
                                    (!cellIsOnBottomBoundary(cellIndex) && gridVisibility[cellIndex + columnCount] && cellConfigs[cellIndex + columnCount].cellType === PathCellType);
                                    return (
                                        <Pressable key={`cell-${cellIndex}`} disabled={!isStartCell && !isNeighborRevealed} onPress={() => revealCell(cellIndex)}>
                                            {cell}
                                        </Pressable>
                                    );
                                })}
                            </View>
                        );
                    })
                }
            </View>
        );
    }

    return renderCells();
}

const styles = StyleSheet.create({
    grid: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    item: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export type { ActionResponse, GridProps, GridConfig };

export { Grid };
