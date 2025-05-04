import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { ActionResponse, Grid, GridConfig, GridProps } from './v4/Grid';
import { ColorPalette } from './v4/ColorPalette';
import { Fragment, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { CellType, VoidCellType } from './v4/Cell';
import Crown from './v4/Crown';
import RestartIcon from './v4/RestartIcon';
import { DefaultConfigMapper } from './v5/MazeConfigs';

type LimitedDirection = 'S' | 'D' | 'E';

const iteratePath = (columnCount: number, rowCount: number, currentPath: Array<number>, availableDirections: Array<LimitedDirection>): Array<number> => {
  let current = currentPath[currentPath.length - 1];
  let nextDirection = availableDirections[Math.floor(Math.random() * availableDirections.length)];
  if (nextDirection === 'S') {
    let nextIndex = current - 1;
    currentPath.push(nextIndex);
    let newAvailableDirections: Array<LimitedDirection> = [];
    if (nextIndex % columnCount > 0) {
      newAvailableDirections.push('S');
    }

    newAvailableDirections.push('D');

    return iteratePath(columnCount, rowCount, currentPath, newAvailableDirections);
  } else if (nextDirection === 'D') {
    let nextIndex = current + columnCount;
    if (nextIndex >= columnCount * rowCount) {
      return currentPath;
    }
    currentPath.push(nextIndex);

    let newAvailableDirections: Array<LimitedDirection> = [];
    if (nextIndex % columnCount > 0) {
      newAvailableDirections.push('S');
    }

    newAvailableDirections.push('D');

    if (nextIndex % columnCount !== 0) {
      newAvailableDirections.push('E');
    }
    return iteratePath(columnCount, rowCount, currentPath, newAvailableDirections);
  } else if (nextDirection === 'E') {
    let nextIndex = current + 1;
    currentPath.push(nextIndex);
    let newAvailableDirections: Array<LimitedDirection> = [];
    if (nextIndex % columnCount !== 0) {
      newAvailableDirections.push('E');
    }

    newAvailableDirections.push('D');

    return iteratePath(columnCount, rowCount, currentPath, newAvailableDirections);
  } else {
    throw new Error('Invalid direction');
  }
}

let columnCount: number = 5;
let rowCount: number = 5;
let pathIndices = DefaultConfigMapper.getNextPath();

export default function App() {
  let [userPath, setUserPath] = useState<Array<number>>([]);
  let [moveCount, setMoveCount] = useState<number>(0);
  let [isGameOver, setIsGameOver] = useState<boolean>(false);

  let colorPalette: ColorPalette = {
    path: '#A9A9A9',
    unrevealed: '#D3D3D3',
    void: '#2F4F4F',
    wall: '#696969',
    start: '#32CD32',
    finish: '#FFD700'
  };
  let gridConfig: GridConfig = {
    columnCount,
    rowCount,
    pathData: pathIndices,
  };

  let playerActionConsumer: (cellIndex: number) => ActionResponse = (cellIndex: number) => {
    if (isGameOver) {
      return 'ABORTED';
    }

    if (pathIndices.includes(cellIndex)) {
      setUserPath(currentUserPath => {
        let newPath = [...currentUserPath];
        newPath.push(cellIndex);
        newPath.sort((a: number, b: number) => a - b);
        if (newPath.includes(pathIndices[0])) {
          if (newPath.includes(pathIndices[pathIndices.length - 1])) {
            setIsGameOver(_ => true);
          }
        }
        return newPath;
      });
    }

    setMoveCount(currentMoveCount => currentMoveCount + 1);

    return 'ALLOWED';
  }

  let playerActionResultConsumer = (wasAborted: boolean, cellType: CellType) => {
    let impactStyle = cellType === VoidCellType ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Medium;

    if (!wasAborted && Platform.OS !== 'web') {
      Haptics.impactAsync(impactStyle);
      return;
    }
    console.log(`wasAborted: ${wasAborted}, cellType: ${cellType}`);
  }

  let { width, height } = useWindowDimensions();

  let minSize = 600;
  let widthFactor = Platform.OS === 'web' ? 0.36 : 0.62;
  let heightFactor = Platform.OS === 'web' ? 0.72 : 0.58;
  let gridWidth = Math.min(width, Math.max(Math.floor(widthFactor * minSize), Math.floor(widthFactor * width)));
  let gridHeight = Math.min(height, Math.max(Math.floor(heightFactor * minSize), Math.floor(heightFactor * height)));

  let gridProps: GridProps = {
    width: gridWidth,
    height: gridHeight,
    wallThickness: 10,
    gridConfig,
    colorPalette,
    playerActionConsumer,
    playerActionResultConsumer,
  }


  let restartGame = () => {
    setUserPath(_ => []);
    setMoveCount(_ => 0);
    setIsGameOver(_ => false);
    pathIndices = DefaultConfigMapper.getNextPath();
    gridConfig = {
      columnCount,
      rowCount,
      pathData: pathIndices
    };
    gridProps = {
      width: gridWidth,
      height: gridHeight,
      wallThickness: 10,
      gridConfig,
      colorPalette,
      playerActionConsumer,
      playerActionResultConsumer,
    };
  };

  return (
    <Fragment>
      <View style={styles.container}>
        <Text style={styles.title}>Hindsight Is 2020</Text>
        <View style={{ ...styles.scoreCard, width: isGameOver ? 240 : 120 }}>
          {isGameOver && <Crown visible={isGameOver} />}
          <Text style={styles.scoreText}>{moveCount}</Text>
          {isGameOver && <Pressable onPress={restartGame} disabled={!isGameOver} >
            <RestartIcon visible={isGameOver} />
          </Pressable>}
        </View>
        <View style={styles.gridContainer}>
          <Grid {...gridProps} />
          <StatusBar style="auto" />
        </View>
      </View>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    justifyContent: 'center',
    marginTop: 80,
    marginBottom: 20,
  },
  scoreCard: {
    backgroundColor: '#A9A9A9',
    flexDirection: 'row',
    padding: 10,
    width: 120,
    height: 80,
    borderRadius: 40,
    marginTop: 10,
    marginBottom: 20,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    width: '90%',
    backgroundColor: '#606060',
    alignItems: 'center',
  },
  gridContainer: {
    flex: 1,
    width:'80%',
    backgroundColor: '#606060',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  }
});
