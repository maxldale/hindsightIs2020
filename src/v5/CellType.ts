
const enum ActualCellType {
    Void = 'VOID',
    Path = 'PATH',
};

const enum VirtualCellType {
    Unrevealed = 'UNREVEALED',
    Inaccessible = 'INACCESSIBLE',
};

type CellType = ActualCellType | VirtualCellType;

const isPathCellType = (cellType: CellType): cellType is ActualCellType.Path => {
    return cellType === ActualCellType.Path;
}

export type { CellType };

export {
    ActualCellType,
    VirtualCellType,
    isPathCellType,
};
