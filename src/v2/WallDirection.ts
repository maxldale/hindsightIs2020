
const enum WallDirection {
    START,
    END,
    TOP,
    BOTTOM
}

const isStart = (direction: WallDirection) => direction === WallDirection.START;
const isEnd = (direction: WallDirection) => direction === WallDirection.END;
const isTop = (direction: WallDirection) => direction === WallDirection.TOP;
const isBottom = (direction: WallDirection) => direction === WallDirection.BOTTOM;

export { WallDirection, isStart, isEnd, isTop, isBottom };
