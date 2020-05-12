import * as React from 'react';
import styled from '@emotion/styled';

export const Tray = styled.div`
background: white !important;
`;

export class TrayWidget extends React.Component {
	render() {
		return <Tray>{this.props.children}</Tray>;
	}
}
