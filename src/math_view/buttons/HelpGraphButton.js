import React from 'react';
import {Button} from "react-bootstrap";
import FontAwesome from "react-fontawesome";

const HelpGraphButton = ({setCollapseHelpGraphButton,collapseHelpGraphButton}) => (
            <div>
                <Button variant={'secondary'} title='Pomoc s grafom' size='lg'
                        onClick={() => setCollapseHelpGraphButton(!collapseHelpGraphButton)}
                        aria-controls="help-graph"
                        aria-expanded={collapseHelpGraphButton}>
                    <FontAwesome name='fas fa-question'/>
                    <span className={'hidden-on-medium-and-lower'}>&nbsp;Pomoc s grafom</span>
                </Button>
            </div>
);

export default HelpGraphButton;