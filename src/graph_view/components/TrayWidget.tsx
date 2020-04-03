import * as React from 'react';
import styled from '@emotion/styled';

export const Tray = styled.div`
min-width: 10%;
background: white !important;
flex:0 0 0;

@media (max-width: 990px) and  (min-width: 750px){
min-width: 10vw;
}

@media (max-width: 749px) and  (min-width: 481px){
min-width: 15vw;
}

@media (max-width: 480px){
min-width: 20vw;
}

`;

export class TrayWidget extends React.Component {
	render() {
		return <Tray>{this.props.children}</Tray>;
	}
}
