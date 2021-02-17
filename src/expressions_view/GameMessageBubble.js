import React from "react";
import styled from 'styled-components';
import FontAwesome from "react-fontawesome";
import {Button} from "react-bootstrap";

export const GameMessage = styled.div`
  padding: .5rem;
  background: #eee;
  width: max-content;
  max-width: 500px;
  display: inline-block;
  border-radius: 0 15px 15px 15px;
  font-weight: 100;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", Arial, sans-serif;
  margin-bottom: 0.5rem;
`;

export class GameMessageBubble extends React.Component {
    constructor(props) {
        super(props);
        this.state = {entered: false};
    }

    renderReturnButton(){
        if(this.state.entered){
            return (
                <Button onClick={() => this.props.onClick()} size={"sm"} className={'text-secondary bg-transparent border-0 mb-auto'}>
                    <FontAwesome name={'fas fa-undo'}/>
                </Button>
            );
        }
    }

    render(){
        return(
            <div onMouseEnter={() => this.setState({entered: true})} onMouseLeave={() => this.setState({entered: false})}>
                <GameMessage>
                    {this.props.children}
                </GameMessage>
                {this.renderReturnButton()}
            </div>
        );
    }
}