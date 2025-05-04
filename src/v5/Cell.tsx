import { ActualCellType, CellType, isPathCellType, VirtualCellType } from "./CellType";
import { ColorPalette } from "./ColorPalette";
import { BasicWallType, BeginWall, FinishWall, isNoWalls, NoWalls, WallType, WallTypes } from "./WallType";
import { StyleSheet, View } from "react-native";

interface CellProps {
    width: number;
    height: number;
    cellType: CellType;
    wallTypes?: WallTypes;
    borderThickness?: number;
    colorPallette: ColorPalette;
}

interface SimpleCellProps {
    width: number;
    height: number;
    color: string;
}

interface PathCellProps {
    width: number;
    height: number;
    wallTypes: WallTypes;
    borderThickness: number;
    colorPallette: ColorPalette;
}

const SimpleCell: React.FC<SimpleCellProps> = ({ width, height, color }) => {
    let unreachableStyle = {
        ...styles.cell,
        width,
        height,
        backgroundColor: color,
    };

    return ( <View style={unreachableStyle} /> );
}

const PathCell: React.FC<PathCellProps> = ({ width, height, wallTypes, borderThickness, colorPallette }) => {
    let startWallType = wallTypes[0];
    let topWallType = wallTypes[1];
    let endWallType = wallTypes[2];
    let bottomWallType = wallTypes[3];

    let calcWallColor = (wallType: WallType) => wallType === BasicWallType.Normal ? colorPallette.wall : colorPallette.path;
    
    let borderStartColor = calcWallColor(startWallType);
    let borderTopColor = topWallType === FinishWall ? colorPallette.finish : calcWallColor(topWallType);
    let borderEndColor = calcWallColor(endWallType);
    let borderBottomColor = bottomWallType === BeginWall ? colorPallette.begin : calcWallColor(bottomWallType);

    let pathStyle = {
        ...styles.cell,
        width,
        height,
        backgroundColor: colorPallette.path,
        borderWidth: borderThickness,
        borderBottomColor,
        borderStartColor,
        borderTopColor,
        borderEndColor,
    };

    return ( <View style={pathStyle} /> );
}

const colorPicker = (cellType: VirtualCellType | ActualCellType.Void, colorPallette: ColorPalette): string => {
    switch (cellType) {
        case VirtualCellType.Inaccessible:
            return colorPallette.inaccessible;
        case VirtualCellType.Unrevealed:
            return colorPallette.unrevealed;
        case ActualCellType.Void:
            return colorPallette.void;
        default:
            throw new Error('Invalid cell type');
    }
}

const Cell: React.FC<CellProps> = ({ width, height, cellType, wallTypes, borderThickness, colorPallette }) => {
    if (isPathCellType(cellType)) {
        if (wallTypes === undefined) {
            wallTypes = NoWalls;
        }
        if (borderThickness === undefined) {
            if (!isNoWalls(wallTypes)) {
                throw new Error('Border thickness must be provided for cells with walls');
            };
            borderThickness = 0;
        }

        return (<PathCell width={width} height={height} wallTypes={wallTypes} borderThickness={borderThickness} colorPallette={colorPallette} /> );
    } else {
        let color = colorPicker(cellType, colorPallette);
        return (<SimpleCell width={width} height={height} color={color} /> );
    }
}

const styles = StyleSheet.create({
    cell: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 1,
    },
});

export type { CellProps };

export { Cell };
