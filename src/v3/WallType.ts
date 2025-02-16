
type WallType = 'Wall' | 'NoWall';

type TopWallType = WallType | 'BordersEnd';

type BottomWallType = WallType | 'BordersStart';

export type { WallType, TopWallType, BottomWallType };