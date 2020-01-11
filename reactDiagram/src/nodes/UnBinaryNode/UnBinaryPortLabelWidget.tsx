import * as React from 'react';
import { DiagramEngine, PortWidget } from '@projectstorm/react-diagrams-core';
import styled from '@emotion/styled';
import { DefaultPortModel } from '@projectstorm/react-diagrams';

export interface DefaultPortLabelProps {
    port: DefaultPortModel;
    engine: DiagramEngine;
    width: number;
}

    export const PortLabel = styled.div`
		display: flex;
		margin-top: 1px;
		align-items: center;
	`;

    export const Label = styled.div`
		padding: 0 5px;
		flex-grow: 1;
	`;

    export const Port = styled.div<{ width: number; height: number }>`
		width: ${p => p.width}px;
		height: ${p => p.height}px;
		background: rgba(white, 0.1);
		color: black;
		text-align:center;

		&:hover {
			background: white;
		}
	`;

export class UnBinaryPortLabelWidget extends React.Component<DefaultPortLabelProps> {
    render() {
        const port = (
            <PortWidget engine={this.props.engine} port={this.props.port}>
                <Port width={this.props.width} height={20} />
            </PortWidget>
        );
        const label = <Label>{this.props.port.getOptions().label}</Label>;

        return (
            <PortLabel>
                {port}
            </PortLabel>
        );
    }
}
