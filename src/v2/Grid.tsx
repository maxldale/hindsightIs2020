import { useState } from "react";
import { GestureResponderEvent, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { WallData } from "./WallData";
import { BaseNon, Non, OmNomNom, OmNonNonProps } from "./OmNonNon";

interface GridProps {
    rows: number;
    columns: number;
    cellWidth: number;
    cellHeight: number;
    branchingFactor: number;
    branchDepth: number;
    pathIndices: Array<number>;
    borderThickness: number;
    pathColor: string;
    voidColor: string;
    unrevealedColor: string;
    startColor: string;
    finishColor: string;
    wallColor: string;
}

interface BaseGridCell {
    isRevealed: boolean;
    isPath: boolean;
    hasStartWall: boolean;
    hasEndWall: boolean;
    hasTopWall: boolean;
    hasBottomWall: boolean;
    bordersStart: boolean;
    bordersFinish: boolean;
}

interface GridCell {
    isRevealed: boolean;
    children: Array<Array<GridCell | BaseGridCell>>;
}

const isBaseGridCell = (cell: GridCell | BaseGridCell): cell is BaseGridCell => {
    return (cell as BaseGridCell).isPath !== undefined;
}

const Grid: React.FC<GridProps> = (props: GridProps) => {
    let omNonNonProps: OmNonNonProps = {
        rows: props.rows,
        columns: props.columns,
        branchingFactor: props.branchingFactor,
        branchDepth: props.branchDepth,
        pathIndices: props.pathIndices,
        cellWidth: props.cellWidth,
        cellHeight: props.cellHeight,
        borderThickness: props.borderThickness,
        startColor: props.startColor,
        finishColor: props.finishColor,
        pathColor: props.pathColor,
        unrevealedColor: props.unrevealedColor,
        voidColor: props.voidColor,
        wallColor: props.wallColor,
    }
    const [gridCells, setGridCells] = useState(OmNomNom(omNonNonProps));
    const [hasRegisteredPressIn, setHasRegisteredPressIn] = useState(false);

    const onGridPressIn = (event: GestureResponderEvent) => {
        setHasRegisteredPressIn(_ => true);
    };

    const onGridPressOut = (event: GestureResponderEvent) => {
        if (hasRegisteredPressIn) {
            const { locationX, locationY } = event.nativeEvent;
            if (locationX >= 0 && locationX <= props.cellWidth * props.columns && locationY >= 0 && locationY < props.cellHeight * props.rows) {
                console.log(`Touch End - X: ${locationX}, Y: ${locationY}`);
                let row = Math.floor(locationY / props.cellHeight);
                let column = Math.floor(locationX / props.cellWidth);
                setGridCells(currentGridCells => {
                    let cellIndex = row * props.columns + column;
                    currentGridCells[cellIndex].isRevealed = true;

                    return currentGridCells;
                })
            } // otherwise, the touch event ended outside the grid, discard it
            setHasRegisteredPressIn(_ => false);
        }
    };

    const renderBaseGridCell = (cell: BaseNon, cellIndex: number) => {
        let width = props.cellWidth;
        let height = props.cellHeight;
        let backgroundColor = cell.isRevealed ? cell.isPath ? props.pathColor : props.voidColor : props.unrevealedColor;
        let borderStartWidth = cell.isRevealed ? cell.hasStartWall ? props.borderThickness : 0 : 0;
        let borderTopWidth = cell.isRevealed ? cell.topWall === 'Wall' ? props.borderThickness : cell.topWall === 'EndBorder' ? props.borderThickness : 0 : 0;
        let borderEndWidth = cell.isRevealed ? cell.hasEndWall ? props.borderThickness : 0 : 0;
        let borderBottomWidth = cell.isRevealed ? cell.bottomWall === 'Wall' ? props.borderThickness : cell.bottomWall === 'StartBorder' ? props.borderThickness : 0 : 0;
        let borderBottomColor = cell.isRevealed ? cell.bottomWall === 'StartBorder' ? props.startColor : cell.bottomWall === 'Wall' ? props.wallColor : undefined : undefined;
        let borderStartColor = cell.isRevealed ? cell.hasStartWall ? props.wallColor : undefined : undefined;
        let borderTopColor = cell.isRevealed ? cell.topWall === 'EndBorder' ? props.finishColor : cell.topWall === 'Wall' ? props.wallColor : undefined : undefined;
        let borderEndColor = cell.isRevealed ? cell.hasEndWall ? props.wallColor : undefined : undefined;
        let borderTopStartRadius = cell.isRevealed ? cell.topWall !== 'NoWall' || cell.hasStartWall ? props.borderThickness / 2 : 0 : 0;
        let borderTopEndRadius = cell.isRevealed ? cell.topWall !== 'NoWall' || cell.hasEndWall ? props.borderThickness / 2 : 0 : 0;
        let borderBottomStartRadius = cell.isRevealed ? cell.bottomWall !== 'NoWall' || cell.hasStartWall ? props.borderThickness / 2 : 0 : 0;
        let borderBottomEndRadius = cell.isRevealed ? cell.bottomWall !== 'NoWall' || cell.hasEndWall ? props.borderThickness / 2 : 0 : 0;
        return (
            <View key={cellIndex} style={{
                ...styles.gridItem,
                width,
                height,
                backgroundColor,
                borderStartWidth,
                borderTopWidth,
                borderEndWidth,
                borderBottomWidth,
                borderBottomColor,
                borderStartColor,
                borderTopColor,
                borderEndColor,
                borderTopStartRadius,
                borderTopEndRadius,
                borderBottomStartRadius,
                borderBottomEndRadius,
            }}
            />
        );
    }

    const renderGridCells = (gridCells: Array<Non>, keyPrefix: string) => {
        return gridCells.map((cell, cellIndex) => (
            <View key={`${keyPrefix}-${cellIndex}`} style={styles.row}>
                {
                    row.map((cell, columnIndex) => {
                        const cellIndex = rowIndex * row.length + columnIndex;

                        if (isBaseGridCell(cell)) {
                            renderBaseGridCell(cell, cellIndex);
                        } else {
                            if (cell.isRevealed) {
                                return renderGridCells(cell.children, `${keyPrefix}-${cellIndex}`);
                            }

                            let width = props.cellWidth;
                            let height = props.cellHeight;
                            let backgroundColor = props.unrevealedColor;
                            return (
                                <View key={`${keyPrefix}-${cellIndex}`} style={{
                                    ...styles.gridItem,
                                    width,
                                    height,
                                    backgroundColor,
                                }}
                                />
                            );
                        }
                    })
                }
            </View>
        ));
    }

    return (
        <Pressable onPressIn={onGridPressIn} onPressOut={onGridPressOut}>
            {
                renderGridCells(gridCells, '')
            }
        </Pressable>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    gridItem: {
        width: 100,
        height: 100,
        margin: 2,
        padding: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridItemText: {
        fontSize: 18,
    },
});

export { Grid, GridProps };