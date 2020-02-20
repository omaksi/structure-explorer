import * as React from 'react';
import styled from '@emotion/styled';

export interface MainCanvasWidgetProps {
	color?: string;
	background?: string;
}

	export const Container = styled.div<{ color: string; background: string }>`
		height: 100%;
		background-color:#fcfcfc !important;
		background-size: 50px 50px;
		display: flex;

		> * {
			height: 100%;
			min-height: 100%;
			width: 100%;
		}
		background-image: linear-gradient(
				0deg,
				transparent 24%,
				${p => p.color} 25%,
				${p => p.color} 26%,
				transparent 27%,
				transparent 74%,
				${p => p.color} 75%,
				${p => p.color} 76%,
				transparent 77%,
				transparent
			),
			linear-gradient(
				90deg,
				transparent 24%,
				${p => p.color} 25%,
				${p => p.color} 26%,
				transparent 27%,
				transparent 74%,
				${p => p.color} 75%,
				${p => p.color} 76%,
				transparent 77%,
				transparent
			);
	`;

export class MainCanvasWidget extends React.Component<MainCanvasWidgetProps> {
	render() {
		return (
			<Container
				background={this.props.background || 'rgb(60, 60, 60)'}
				color={this.props.color || 'rgba(0,0,0, 0.07)'}>
				{this.props.children}
			</Container>
		);
	}
}
