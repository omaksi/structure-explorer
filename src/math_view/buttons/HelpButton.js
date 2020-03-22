import React from 'react';

const HelpButton = ({dataTarget}) => (
    <button className={"btn btn-secondary"} title="Pomoc" data-toggle="collapse" data-target={dataTarget} aria-expanded="false" aria-controls="collapseExample">?</button>
);

export default HelpButton;
