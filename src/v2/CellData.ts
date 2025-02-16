import { WallData } from "./WallData";

interface CellData {
    startWall: WallData,
    endWall: WallData,
    topWall: WallData,
    bottomWall: WallData,
    isInPath: boolean,
}

interface CellDataBuilder {
    setStartWall: (startWall: WallData) => CellDataBuilder;
    setEndWall: (endWall: WallData) => CellDataBuilder;
    setTopWall: (topWall: WallData) => CellDataBuilder;
    setBottomWall: (bottomWall: WallData) => CellDataBuilder;
    setIsInPath: (isInPath: boolean) => CellDataBuilder;
    build: () => CellData;
}

/**
 * Functional CellData Builder
 * 
 * NOTE: all walls will default to `NoWall` if not set
 * NOTE: isInPath will default to `false` if not set
 * @param cellData Partial cell data
 * @throws {Error} If the partial cell data does not have a startWall, endWall, topWall, or bottomWall
 */
const cellDataBuilder = (cellData: Partial<CellData> = {}): CellDataBuilder => ({
    setStartWall: (startWall: WallData) => cellDataBuilder({ ...cellData, startWall }),
    setEndWall: (endWall: WallData) => cellDataBuilder({ ...cellData, endWall }),
    setTopWall: (topWall: WallData) => cellDataBuilder({ ...cellData, topWall }),
    setBottomWall: (bottomWall: WallData) => cellDataBuilder({ ...cellData, bottomWall }),
    setIsInPath: (isInPath: boolean) => cellDataBuilder({ ...cellData, isInPath }),
    build: () => {
        if (!cellData.startWall) {
            throw new Error('CellData requires a startWall!');
        };
        if (!cellData.endWall) {
            throw new Error('CellData requires a endWall!');
        };
        if (!cellData.topWall) {
            throw new Error('CellData requires a topWall!');
        };
        if (!cellData.bottomWall) {
            throw new Error('CellData requires a bottomWall!');
        };

        return {
            ...cellData,
            isInPath: cellData.isInPath || false,
        } as CellData;
    },
})

export { CellData, CellDataBuilder, cellDataBuilder };
