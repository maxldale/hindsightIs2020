import { StyleSheet, View } from "react-native";
import { Direction, InvertedCornerDirection, InvertedCorners, NoInvertedCorners, NoWalls, WallData, WallType } from "./WallData";
import { ColorPalette } from "./ColorPalette";
import { useState } from "react";

const VoidCellType = 'VOID_CELL';
const UnrevealedCellType = 'UNREVEALED_CELL';
const PathCellType = 'PATH_CELL';

type ActualCellType = typeof VoidCellType | typeof PathCellType;
type CellType = typeof UnrevealedCellType | ActualCellType;

interface CellConfig {
    cellType: ActualCellType;
    wallData: WallData;
    invertedCorners: InvertedCorners;
}

interface CellProps {
    cellIndex: number;
    width: number;
    height: number;
    borderThickness: number;
    isRevealed: boolean;
    cellConfig: CellConfig;
    colorPalette: ColorPalette;
}

const renderUnrevealedCell = (cellIndex: number, width: number, height: number, unrevealedColor: string) => {
    const unrevealedStyle = {
        ...styles.cell,
        width,
        height,
        backgroundColor: unrevealedColor,
    };
    return (
        <View key={cellIndex} style={unrevealedStyle} />
    );
}

const renderVoidCell = (cellIndex: number, width: number, height: number, voidColor: string) => {
    return (
        <View key={cellIndex} style={{
            ...styles.cell,
            width,
            height,
            backgroundColor: voidColor,
        }} />
    );
}


const Cell: React.FC<CellProps> = (props) => {
    let {
        cellIndex,
        width,
        height,
        borderThickness,
        cellConfig: {
            wallData,
            invertedCorners,
        },
        isRevealed,
        colorPalette: {
            path: pathColor,
            unrevealed: unrevealedColor,
            void: voidColor,
            wall: wallColor,
            start: startColor,
            finish: finishColor,
        }
    } = props;

    if (!isRevealed) {
        return renderUnrevealedCell(cellIndex, width, height, unrevealedColor);
    }

    let borderRadius = borderThickness / 2;

    if (wallData === NoWalls) {
        return renderVoidCell(cellIndex, width, height, voidColor);
    }

    let calcInvertedCorners = (direction: InvertedCornerDirection) => invertedCorners === NoInvertedCorners ? false : invertedCorners[direction];
    
    let startTopNeedsInvertedCorner = calcInvertedCorners(InvertedCornerDirection.TOP_START);
    let startBottomNeedsInvertedCorner = calcInvertedCorners(InvertedCornerDirection.BOTTOM_START);
    let endTopNeedsInvertedCorner = calcInvertedCorners(InvertedCornerDirection.TOP_END);
    let endBottomNeedsInvertedCorner = calcInvertedCorners(InvertedCornerDirection.BOTTOM_END);

    let calcWallColor = (direction: Direction) => wallData[direction] === WallType.WALL ? wallColor : pathColor;

    let backgroundColor = pathColor;
    let borderBottomColor = wallData[Direction.BOTTOM] === WallType.BEGIN_EDGE ? startColor : calcWallColor(Direction.BOTTOM);
    let borderTopColor = wallData[Direction.TOP] === WallType.FINISH_EDGE ? finishColor : calcWallColor(Direction.TOP);
    let borderStartColor = calcWallColor(Direction.START);
    let borderEndColor = calcWallColor(Direction.END);

    let nextDirection: (direction: Direction) => Direction = (direction: Direction) => (direction + 1) % 4;

    let calcCornerRadius = (direction: Direction) => wallData[direction] !== WallType.NO_WALL && wallData[nextDirection(direction)] !== WallType.NO_WALL? borderRadius : 0;

    let borderTopStartRadius = calcCornerRadius(Direction.START);
    let borderTopEndRadius = calcCornerRadius(Direction.TOP);
    let borderBottomEndRadius = calcCornerRadius(Direction.END);
    let borderBottomStartRadius = calcCornerRadius(Direction.BOTTOM);

    return (
        <View key={cellIndex} style={{
            ...styles.cell,
            width,
            height,
            backgroundColor,
            borderStartWidth: borderThickness,
            borderTopWidth: borderThickness,
            borderEndWidth: borderThickness,
            borderBottomWidth : borderThickness,
            borderBottomColor,
            borderStartColor,
            borderTopColor,
            borderEndColor,
            borderTopStartRadius,
            borderTopEndRadius,
            borderBottomStartRadius,
            borderBottomEndRadius,
        }}>
            { /**
             * {startBottomNeedsInvertedCorner && <View style={{
                backgroundColor: wallColor,
                height: borderThickness,
                width: borderThickness,
                marginTop: height - 2 * borderThickness,
                marginEnd: width - 2 * borderThickness,
                alignSelf: 'center',
                borderTopEndRadius: borderRadius,
            }} />}
            {startTopNeedsInvertedCorner && <View style={{
                backgroundColor: wallColor,
                height: borderThickness,
                width: borderThickness,
                marginBottom: height - 2 * borderThickness,
                marginEnd: width - 2 * borderThickness,
                alignSelf: 'center',
                borderBottomEndRadius: borderRadius,
            }} />}
            {endBottomNeedsInvertedCorner && <View style={{
                backgroundColor: wallColor,
                height: borderThickness,
                width: borderThickness,
                marginTop: height - 2 * borderThickness,
                marginStart: width - 2 * borderThickness,
                alignSelf: 'center',
                borderTopStartRadius: borderRadius,
            }} />}
            {endTopNeedsInvertedCorner && <View style={{
                backgroundColor: wallColor,
                height: borderThickness,
                width: borderThickness,
                marginBottom: height - 2 * borderThickness,
                marginStart: width - 2 * borderThickness,
                alignSelf: 'center',
                borderBottomStartRadius: borderRadius,
            }} />}
             */}
        </View>
    )
}

const styles = StyleSheet.create({
    cell: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 1,
    },
});

export type { CellConfig, CellProps, CellType };

export { VoidCellType, UnrevealedCellType, PathCellType, Cell };