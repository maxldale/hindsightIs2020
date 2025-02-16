# HindsightIs2020

HindsightIs2020 is a maze game built with React Native and Expo. The game generates a random maze and allows the player to navigate through it by revealing cells. The goal is to find the path from the start to the finish in the fewest moves possible.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [License](#license)

## Installation

To get started with the project, clone the repository and install the dependencies:

```sh
git clone https://github.com/yourusername/HindsightIs2020.git
cd HindsightIs2020
npm install
```

## Usage

To start the development server, run:

```sh
npm run start
```

You can also run the project on specific platforms:

```sh
npm run android
npm run ios
npm run web
```

## Project Structure

```
.expo/
.gitignore
app.config.ts
app.json
AppEntry.js
assets/
babel.config.js
package.json
src/
  App.tsx
  v1/
  v2/
  v3/
  v4/
test/
tsconfig.json
```

- **.expo/**: Expo configuration files.
- **assets/**: Contains images and icons used in the project.
- **src/**: Contains the source code of the project.
  - **App.tsx**: The main entry point of the application.
  - **v1/**, **v2/**, **v3/**, **v4/**: Different versions of the maze generation and rendering logic.
- **test/**: Contains test files.
- **app.config.ts**: Expo configuration file.
- **app.json**: Expo configuration file.
- **AppEntry.js**: Entry point for the Expo application.
- **babel.config.js**: Babel configuration file.
- **package.json**: Project dependencies and scripts.
- **tsconfig.json**: TypeScript configuration file.

## Scripts

- `npm run start`: Starts the development server.
- `npm run android`: Runs the project on an Android emulator or device.
- `npm run ios`: Runs the project on an iOS simulator or device.
- `npm run web`: Runs the project in a web browser.

## License

This project is licensed under a proprietary license. All rights are reserved. You may not use, distribute, or modify this code without explicit permission from the author.

# Proprietary License

All rights reserved. This code is the property of Maximilian H. Dale. You may not use, distribute, or modify this code without explicit permission from the author.

For inquiries, please contact maxl.dale.11@gmail.com.
