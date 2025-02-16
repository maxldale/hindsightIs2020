import { FlatList, StyleSheet, View } from "react-native";
import Cell, { CellProps } from "./Cell";


interface GridData {
    cellData: Array<Array<CellProps>>
}

const Grid: React.FC<GridData> = (gameGrid: GridData) => {
    return (
    <View style={styles.gridContainer}>
      {gameGrid.cellData.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cellProps, colIndex) => {
            let cellIndex = rowIndex * row.length + colIndex;
            return (
            <View key={cellIndex} style={styles.gridItem}>
              <Cell {... cellProps} />
            </View>
            )
        })}
        </View>
      ))}
    </View>
    );
}

const styles = StyleSheet.create({
    gridContainer: {
      flexDirection: 'column',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    gridItem: {
      width: 100,
      height: 100,
      margin: 1,
      padding: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#e0e0e0',
    },
    gridItemText: {
      fontSize: 18,
    },
  });

export type { GridData };

export default Grid;