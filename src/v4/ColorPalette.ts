
/**
 * Defines all the colors required to render a maze.
 */
interface ColorPalette {
    path: string;
    unrevealed: string;
    void: string;
    wall: string;
    start: string;
    finish: string;
}

// TODO: Use a color palette that allows for an array of colors to choose from, maybe even an additional otption for how the colors are chosen (random, sequential, using noise, etc.)

export type { ColorPalette };