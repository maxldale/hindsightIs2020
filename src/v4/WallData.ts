
/**
 * Direction of the wall relative to the center of the cell
 */
const enum Direction {
    START,
    TOP,
    END,
    BOTTOM,
};

/**
 * Type of the wall
 * 
 * NOTE: Begin and Finish Edges are used to mark the start and finish of the maze
 */
const enum WallType {
    NO_WALL,
    WALL,
    BEGIN_EDGE,
    FINISH_EDGE,
}

/**
 * Represents the walls of the cell, each `Direction` is represented by the respective array index
 */
type WallTypes = [WallType, WallType, WallType, WallType];

/**
 * Represents a cell with no walls
 */
const NoWalls = 'NO_WALLS';

/**
 * Represents either the wall types or the absence of walls
 */
type WallData = WallTypes | typeof NoWalls;

/**
 * Direction of the inverted corner relative to the center of the cell
 */
const enum InvertedCornerDirection {
    TOP_START,
    TOP_END,
    BOTTOM_END,
    BOTTOM_START,
};
/**
 * Represents the required inverted corners of a cell (to help the maze walls look more continuous and smooth), each `InvertedCornerDirection` is represented by the respective array index
 */
type RequiresInvertedCorners = [boolean, boolean, boolean, boolean];

const NoInvertedCorners = 'NO_INVERTED_CORNERS';

type InvertedCorners = RequiresInvertedCorners | typeof NoInvertedCorners;

export type { WallTypes, WallData, RequiresInvertedCorners, InvertedCorners };

export { Direction, WallType, InvertedCornerDirection, NoWalls, NoInvertedCorners };
