import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles: any = makeStyles(() => ({
  div: {
    'max-width': 'calc(100% - 50px)',
    'background-color': '#424242',
    'border-radius': '16px',
    padding: '16px',
    margin: '10px auto 10px auto',
  },
}));

const StepOne: React.FC = () => {

  const classes = useStyles();

  return (
    <div className={classes.div}>
      <h3>
        Save a copy of your word report as a &quot;Web Page, Filtered (*.htm, *html)&quot;
      </h3>
      <p>
        Warning: Do not try to delete the folder of image that has been created
      </p>
      {/* TODO: 
        * - add images
        * - tell to put the htm file into the folder
        */}
    </div>
  );
};

export default StepOne;
