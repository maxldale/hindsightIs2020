import { ColorData } from "./ColorData";
import { WallConfig } from "./WallConfig";

interface CellConfig {
    backgroundColor: ColorData,
    topWall: WallConfig,
    bottomWall: WallConfig,
    startWall: WallConfig,
    endWall: WallConfig,
}

export { CellConfig };
