import React from 'react';
import Switch from '@mui/material/Switch';

const DebugSwitch = ({ checked, onChange }) => {
    return (
        <Switch 
            checked={checked} 
            onChange={onChange}
            focusVisibleClassName=".Mui-focusVisible" 
            disableRipple 
        />
    );
};

export default DebugSwitch;
