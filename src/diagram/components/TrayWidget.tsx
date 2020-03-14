import * as React from 'react';
import styled from '@emotion/styled';

export const Tray = styled.div`
min-width: 10%;
background: #fcfcfc !important;
flex:0 0 0;
`;

export class TrayWidget extends React.Component {
	render() {
		return <Tray>{this.props.children}</Tray>;
	}
}
