import React from 'react';
import {Button, Collapse} from "react-bootstrap";
import FontAwesome from "react-fontawesome";

export class HelpGraphButton extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            collapsed:false
        };

        this.toggleStateCollapsed = this.toggleStateCollapsed.bind(this);
    }

    toggleStateCollapsed(){
        this.setState({collapsed:!this.state.collapsed});
    }

    render() {
        return (
            <div>
                <Button variant={'secondary'} title='Pomoc s grafom' size='lg' onClick={() => this.toggleStateCollapsed()}
                        aria-controls="#help-graph"
                        aria-expanded={this.state.collapsed}>
                    <FontAwesome name='fas fa-question'/>
                    <span className={'hidden-on-medium-and-lower'}>&nbsp;Pomoc s grafom</span>
                </Button>
                <Collapse in={this.state.collapsed}>
                    <div id="#help-graph">
                        Graf sa ovláda dvomi režimami. Pohybovací režim (P) dovoľuje presúvať alebo mazať jednotlivé vrcholy. Pre ostatné akcie ako sú pridávanie predikátov a funkcií, zmena mien vrcholov alebo na vytváranie hrán slúži Editovací režim (E).
                        Medzi týmito režimami sa dá meniť stlačením na tlačidlá alebo stlačením kláves P a E, respektívne je možné využiť klávesu ; ,ktorou je možné prepínať medzi jednotlivými režimami.
                        Graf nedovoluje pridať funkciu do vrcholu ak by sa mal nastať stav, že funkcia by bola viackrát definovaná pre rovnaké parametre. V takom prípade v buď nejde vôbec danú funkciu pridať a tlačidlo na pridanie nedovolí funkciu pridať alebo
                        v prípade binárne vzťahu ak už je funkcia zaradená v zozname tak nejde zmeniť jej smer (resp. je možné vyberať iba z obmedzeného počtu smerov).
                    </div>
                </Collapse>
            </div>
        );
    }
}