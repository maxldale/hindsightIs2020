import { ColorData } from "./ColorData";

interface SomeWallConfig {
    color: ColorData
};

const wallConfig = (color: ColorData): WallConfig => {
    let newConfig: SomeWallConfig = {
        color,
    }

    return newConfig;
}

const NoWall: unique symbol = Symbol('no_wall');

type NoWallConfig = typeof NoWall;

type WallConfig = SomeWallConfig | NoWallConfig;

function isNoWallConfig( wallConfig: WallConfig ): wallConfig is NoWallConfig {
    return wallConfig === NoWall;
}

export { 
    wallConfig,
    NoWall,
    NoWallConfig,
    WallConfig,
    isNoWallConfig,
};
