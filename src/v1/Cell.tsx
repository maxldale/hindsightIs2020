import { TouchableOpacity, View } from "react-native";
import { CellData } from "./cell/CellData";
import { isNoWallConfig } from "./cell/WallConfig";
import { Green, Red } from "./cell/ColorData";


interface CellProps {
    cellData: CellData
    isStartCell?: boolean
    isEndCell?: boolean
    width: number,
    height: number,
    borderThickness: number,
}

const Cell: React.FC<CellProps> = (props: CellProps) => {
    let width = props.width;
    let height = props.height;
    let backgroundColor = props.cellData.config.backgroundColor.value;
    let borderStartWidth = isNoWallConfig(props.cellData.config.startWall) ? 0 : props.borderThickness;
    let borderTopWidth = isNoWallConfig(props.cellData.config.topWall) ? 0 : props.borderThickness;
    let borderEndWidth = isNoWallConfig(props.cellData.config.endWall) ? 0 : props.borderThickness;
    let borderBottomWidth = isNoWallConfig(props.cellData.config.bottomWall) ? 0 : props.borderThickness;
    let borderStartColor = isNoWallConfig(props.cellData.config.startWall) ? undefined : props.cellData.config.startWall.color.value;
    let borderTopColor = isNoWallConfig(props.cellData.config.topWall) ? (props.isStartCell ? Red.value : undefined) : props.cellData.config.topWall.color.value;
    let borderEndColor = isNoWallConfig(props.cellData.config.endWall) ? undefined : props.cellData.config.endWall.color.value;
    let borderBottomColor = isNoWallConfig(props.cellData.config.bottomWall) ? (props.isEndCell ? Green.value : undefined): props.cellData.config.bottomWall.color.value;
    let borderTopStartRadius = isNoWallConfig(props.cellData.config.topWall) || isNoWallConfig(props.cellData.config.startWall) ? props.borderThickness / 2 : 0;
    let borderTopEndRadius = isNoWallConfig(props.cellData.config.topWall) || isNoWallConfig(props.cellData.config.endWall)  ? props.borderThickness / 2 : 0;
    let borderBottomStartRadius = isNoWallConfig(props.cellData.config.bottomWall) || isNoWallConfig(props.cellData.config.startWall)  ? 0 : props.borderThickness / 2;
    let borderBottomEndRadius = isNoWallConfig(props.cellData.config.bottomWall) || isNoWallConfig(props.cellData.config.endWall)  ? 0 : props.borderThickness / 2;

    let revealCell = () => {
        console.log(props);
    };

    return (
        <TouchableOpacity onPress={revealCell} >
            <View style={{
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
            }}/>
        </TouchableOpacity>
    );
}

export type { CellProps };

export default Cell;