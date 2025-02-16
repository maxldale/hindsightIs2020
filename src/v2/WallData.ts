import { ColorData } from "@/cell/ColorData";
import { WallDirection } from "./WallDirection";

const NoWall = 'NoWall';

interface SomeWallData {
    direction: WallDirection,
    color: ColorData,
}

type WallData = SomeWallData | typeof NoWall;

interface WallDataBuilder {
    setDirection: (direction: WallDirection) => WallDataBuilder;
    setColor: (color: ColorData) => WallDataBuilder;
    build: () => WallData;
}

const isNoWall = (wallData: WallData): wallData is typeof NoWall => wallData === NoWall;
const isNoWallInternal = (wallData: Partial<WallData> | typeof NoWall): wallData is typeof NoWall => wallData === NoWall;

/**
 * Functional WallData Builder
 * 
 * NOTE: all walls will default to `NoWall` if not set
 * @param wallData Partial wall data
 * @throws {Error} If the partial wall data does not have a color or direction
 */
const wallDataBuilder = (wallData: Partial<WallData> | typeof NoWall = {}): WallDataBuilder => ({
    setDirection: (direction: WallDirection) => {
        if (isNoWallInternal(wallData)) {
            return wallDataBuilder({ direction });
        }
        return wallDataBuilder({ ...wallData, direction });
    },
    setColor: (color: ColorData) => {
        if (isNoWallInternal(wallData)) {
            return wallDataBuilder({ color });
        }
        return wallDataBuilder({ ...wallData, color });
    },
    build: () => {
        if (!isNoWallInternal(wallData)) {
            if (!wallData.color) {
                throw new Error('WallData requires a color!');
            };
            if (!wallData.direction) {
                throw new Error('WallData requires a direction!');
            };
        };

        return wallData as WallData;
    },
})

export { WallData, WallDataBuilder, isNoWall, wallDataBuilder };
