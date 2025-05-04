

function generateValidMazePaths(width: number, height: number): number[][] {
    const paths: number[][] = [];

    const visited = Array.from({ length: height }, () => Array(width).fill(false));

    function dfs(x: number, y: number, path: number[]) {
        // If we've reached the top row and "exit" above it
        if (y === height) {
            paths.push([...path]);
            return;
        }

        // If out of bounds
        if (x < 0 || x >= width || y < 0 || y >= height) {
            return;
        }

        if (visited[y][x]) return;

        // Visit current cell
        visited[y][x] = true;
        path.push(y * width + x);

        // Move up
        dfs(x, y + 1, path);

        // Move left
        dfs(x - 1, y, path);

        // Move right
        dfs(x + 1, y, path);

        // Backtrack
        visited[y][x] = false;
        path.pop();
    }

    // Start from each cell in the bottom row (y = 0)
    for (let x = 0; x < width; x++) {
        dfs(x, 0, []);
    }

    return paths;
}

export interface MazeConfigMapper {
    setSeed: (seed: number) => void;
    getNextPath: () => number[];
}

function mazeConfigMapper(width: number, height: number, seed: number, stride: number): MazeConfigMapper {
    const paths = generateValidMazePaths(width, height).toSorted((a, b) => a.length - b.length);
    console.log(paths.length);
    let currentIndex = seed;
    return {
        setSeed: (newSeed: number) => {
            currentIndex = newSeed;
        },
        getNextPath: () => {

            if (currentIndex >= paths.length) {
                currentIndex = (currentIndex + seed) % paths.length; // Reset to within bounds
            }
            let nextPath = paths[currentIndex];
            currentIndex += stride; // Move to the next path based on the stride
            return nextPath;
        }
    };
}

export const DefaultConfigMapper: MazeConfigMapper = mazeConfigMapper(5, 5, 1337, 11111);