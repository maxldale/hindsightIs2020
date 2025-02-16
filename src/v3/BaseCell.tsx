import React from "react";
import { BottomWallType, TopWallType } from "./WallType";
import { CellColorPallette } from "./CellColorPalette";
import { StyleSheet, View } from "react-native";


interface BaseCellProps {
    key: React.Key;
    width: number;
    height: number;
    colorPalette: CellColorPallette;
    borderThickness: number;
    isRevealed: boolean;
    isPath: boolean;
    hasStartWall: boolean;
    hasEndWall: boolean;
    topWall: TopWallType;
    bottomWall: BottomWallType;
    startTopNeedsInvertedCorner: boolean;
    startBottomNeedsInvertedCorner: boolean;
    endTopNeedsInvertedCorner: boolean;
    endBottomNeedsInvertedCorner: boolean;
}

const BaseCell: React.FC<BaseCellProps> = (props: BaseCellProps) => {
    let {
        key,
        width,
        height,
        colorPalette: {
            pathColor,
            unrevealedColor,
            voidColor,
            wallColor,
            startColor,
            finishColor,
        },
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
        endBottomNeedsInvertedCorner
    } = props;

    let borderRadius = borderThickness / 2;

    let backgroundColor = isRevealed ? isPath ? pathColor : voidColor : unrevealedColor;
    let borderStartWidth = isRevealed ? hasStartWall ? borderThickness : 0 : 0;
    let borderTopWidth = isRevealed ? topWall === 'Wall' ? borderThickness : topWall === 'BordersEnd' ? borderThickness : 0 : 0;
    let borderEndWidth = isRevealed ? hasEndWall ? borderThickness : 0 : 0;
    let borderBottomWidth = isRevealed ? bottomWall === 'Wall' ? props.borderThickness : bottomWall === 'BordersStart' ? borderThickness : 0 : 0;
    let borderBottomColor = isRevealed ? bottomWall === 'BordersStart' ? startColor : bottomWall === 'Wall' ? wallColor : undefined : undefined;
    let borderStartColor = isRevealed ? hasStartWall ? wallColor : undefined : undefined;
    let borderTopColor = isRevealed ? topWall === 'BordersEnd' ? finishColor : topWall === 'Wall' ? wallColor : undefined : undefined;
    let borderEndColor = isRevealed ? hasEndWall ? wallColor : undefined : undefined;
    let borderTopStartRadius = isRevealed ? topWall !== 'NoWall' && hasStartWall ? borderRadius : 0 : 0;
    let borderTopEndRadius = isRevealed ? topWall !== 'NoWall' && hasEndWall ? borderRadius : 0 : 0;
    let borderBottomStartRadius = isRevealed ? bottomWall !== 'NoWall' && hasStartWall ? borderRadius : 0 : 0;
    let borderBottomEndRadius = isRevealed ? bottomWall !== 'NoWall' && hasEndWall ? borderRadius : 0 : 0;

    return (
        <View key={key} style={{
            ...styles.baseCell,
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
        }}>
            {startBottomNeedsInvertedCorner && <View style={{
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
        </View>
    );
}

const styles = StyleSheet.create({
    baseCell: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 1,
    },
});

export type { BaseCellProps };

export { BaseCell };