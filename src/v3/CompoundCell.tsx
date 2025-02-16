import React from "react";
import { BaseCell, BaseCellProps } from "./BaseCell";
import { CellColorPallette } from "./CellColorPalette";
import { StyleSheet, View } from "react-native";

interface CompoundCellProps {
    key: React.Key;
    width: number;
    height: number;
    colorPalette: CellColorPallette;
    isRevealed: boolean;
    childrenProps: Array<Array<BaseCellProps>> | Array<Array<CompoundCellProps>>;
}

const isCompoundCellProps = (props: BaseCellProps | CompoundCellProps): props is CompoundCellProps => {
    return (props as CompoundCellProps).childrenProps !== undefined;
}

const containsCompoundCellProps = (childrenProps: Array<Array<BaseCellProps>> | Array<Array<CompoundCellProps>>): childrenProps is Array<Array<CompoundCellProps>> => {
    return isCompoundCellProps(childrenProps[0][0]);
}

const CompoundCell: React.FC<CompoundCellProps> = (props: CompoundCellProps) => {
    let {
        key,
        width,
        height,
        colorPalette,
        isRevealed,
        childrenProps
    } = props;

    if (!isRevealed) {
        return (
            <View key={key} style={{
                ...styles.grid,
                backgroundColor: colorPalette.unrevealedColor,
                width,
                height,
            }} />
        );
    }

    if (containsCompoundCellProps(childrenProps)) {
        return childrenProps.map((row, rowIndex) => {
            return (
                <View key={`${key}-${rowIndex}`} style={styles.row}>
                    { row.map((cellProps) => {
                        return CompoundCell(cellProps);
                    })}
                </View>
            );
        });
    }

    return childrenProps.map((row, rowIndex) => {
        return (
            <View key={`${key}-${rowIndex}`} style={styles.row}>
                { row.map((cellProps) => {
                    return BaseCell(cellProps);
                })}
            </View>
        );
    });
}

const styles = StyleSheet.create({
    grid: {
        flex: 1,
        alignItems: "center",
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: "wrap",
    },
});

export type { CompoundCellProps };

export { isCompoundCellProps, CompoundCell };