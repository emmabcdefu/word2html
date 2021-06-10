import React from 'react';
import fs from 'fs';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button/Button';
import { AddCircle } from '@material-ui/icons';
import Information from './Transform';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    input: {
        display: 'none',
    },
}));

const StepOne = () => {
    const classes = useStyles();

    const onInputClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        const element = event.target as HTMLInputElement;
        element.value = '';
    };

    const readFile = (event: any/* Typescript don't support input file */) => {
        fs.readFile(event.target.files[0].path, 'utf8', (_, data: string) => {
            const file = new Information(data);
            file.clean();
        });
    };

    return (
        <div>
            <div className="divstyle">
                <h3>Step 1 : Save a copy of your word report as a "Web Page, Filtered (*.htm, *html)"</h3>
                <p>Warning: Do not try to delete the folder of image that has been created</p>
            </div>
            <div className="divstyle">
                <h3>Step 2 : Select the htm file of your report"</h3>
                <input
                    accept=".htm"
                    className={classes.input}
                    id="contained-button-file"
                    type="file"
                    onChange={readFile}
                    onClick={onInputClick}
                />
                <label htmlFor="contained-button-file">
                    <Button
                        variant="contained"
                        color="primary"
                        component="span"
                        startIcon={<AddCircle />}
                    >
                        Select
                    </Button>
                </label>
            </div>
        </div>
    );
};

export default StepOne;
