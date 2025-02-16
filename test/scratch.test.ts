import { Black } from "../src/cell/ColorData";
import { defaultGenerator, GeneratorConfig } from "../src/generator/MazeGenerator";

describe( "blah", () => {
    test("blub", () => {
        let cfg: GeneratorConfig = {
            height: 6,
            width: 6,
            directionLikelihoods: {
                up: 60,
                left: 20,
                right: 20,
            },
        };

        let result = defaultGenerator.generate(cfg);

        console.log(result.path);
    });
})