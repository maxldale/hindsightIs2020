
const enum BasicWallType {
    None = 'NONE',
    Normal = 'NORMAL',
}

const BeginWall = 'BEGIN';

const FinishWall = 'FINISH';

type SideWallType = BasicWallType;

type TopWallType = BasicWallType | typeof FinishWall;

type BottomWallType = BasicWallType | typeof BeginWall;

type WallType = TopWallType | typeof BeginWall;

type WallTypes = [SideWallType, TopWallType, SideWallType, BottomWallType];

const NoWalls: WallTypes = [BasicWallType.None, BasicWallType.None, BasicWallType.None, BasicWallType.None];

const isNoWalls = (wallTypes: WallTypes): wallTypes is typeof NoWalls => {
    return wallTypes.every(wallType => wallType === BasicWallType.None);
}

export type {
    SideWallType,
    TopWallType,
    BottomWallType,
    WallType,
    WallTypes,
};

export {
    BasicWallType,
    BeginWall,
    FinishWall,
    NoWalls,
    isNoWalls,
};
