import { CellData } from "./CellData";

interface GridData {
    cellData: Array<Array<CellData>>;
}

interface GridDataBuilder {
    setCellData: (row: number, column: number, cellData: CellData) => GridDataBuilder;
    build: () => GridData;
}

const gridDataBuilder = (gridData: Partial<GridData> = {}): GridDataBuilder => ({
    setCellData: (row: number, column: number, cellData: CellData) => {
        let newCellData = gridData.cellData || [];
        newCellData[row] = newCellData[row] || [];
        newCellData[row][column] = cellData;
        return gridDataBuilder({ ...gridData, cellData: newCellData });
    },
    build: () => {
        return gridData as GridData;
    },
})

export type { GridData, GridDataBuilder };