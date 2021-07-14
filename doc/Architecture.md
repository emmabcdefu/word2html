# Code architecture

The application has been built with [Electron](https://www.electronjs.org/) using [Typescript](https://www.typescriptlang.org/) with the framework [React](https://reactjs.org/) with some [material-ui](https://material-ui.com/) components.
The repository has been created with the [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate). The code source you are going to edit is located in `./src`.

## Structure

The application load `index.tsx` that render `App.tsx`(`./src/component/App.tsx`) inside a div in `index.html`.
The app, therefore, renders different components that are located here `./src/component/` like that :

|                                                                     |
|---------------------------------------------------------------------|
| Stepper (`./src/component/Custom/stepper.tsx`)                      |
| StepOne or StepTwo or StepThree (`./src/component/Steps/Step*.tsx`) |
| Footer (`./src/component/Custom/footer.tsx`)                        |

For the stepThree, the screen is split into 2 sections. A left one to edit the document and a right one to visualize a pre-render. Each box on the left section has its own id (it is quite useful if you want to dev the tool).

Every text transformations (for the pre-render inside the app or for the HTML output) are made in `./src/component/TextTransformation/`. Script and style that are added inside the HTML output are stored in `./src/component/TextTransformation/website_src/`.

Types are defined in `./src/types/`.

## Style

The app is wrapped inside a `<ThemeProvider theme={Theme}>`; a component from material-ui that style on every component rendered inside it. This theme is defined at `./src/theme/theme.tsx`.

Some components are completely from material-ui but some components use more style defined in each `.tsx` file using `withStyles()` from material-ui.
