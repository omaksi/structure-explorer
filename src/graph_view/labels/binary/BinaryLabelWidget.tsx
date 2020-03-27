import * as React from 'react';
import { BinaryLabelModel } from './BinaryLabelModel';
import styled from '@emotion/styled';
import {DiagramEngine} from '@projectstorm/react-diagrams';
import {ADDPORT, INPORT, OUTPORT} from "../../nodes/ConstantNames";
import _ from "lodash";

export interface BinaryLabelWidgetProps {
	model: BinaryLabelModel;
	engine: DiagramEngine;
	name?:string;
	size?: number;
}

export const PredicatesNode = styled.div`
		pointer-events: auto;
		width:100%;
		height:100%;
		background-color: yellow;
		border-radius: 5px;
		font-family: sans-serif;
		color: black;
		border: solid 2px black;
		overflow: visible;
		font-size: 11px;
		font-weight: bold;

	`;

export const Predicate = styled.div`
		min-width: 2em;
		width: 100%;
		height: 20px;
		background: rgba(white, 0.1);
		color: black;
		text-align:center;

		&:hover {
			background: #00ff80;
		}
	`;

export const Predicates = styled.div`
		display: flex;
		background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2));
	`;

export const PredicateContainer = styled.div`
		display: flex;
		flex-direction: column;

		&:first-of-type {
			margin-right: 10px;
		}

		&:only-child {
			margin-right: 0px;
		}
	`;

interface BinaryNodeWidgetState {
	renameActive?:boolean;
	titleChanged?:boolean;
	nodeName?:string;
}

export class BinaryLabelWidget extends React.Component<BinaryLabelWidgetProps,BinaryNodeWidgetState> {
	counter: number;

	constructor(props: BinaryLabelWidgetProps) {
		super(props);

		this.counter = 0;
	}

	generatePredicate = (predicate: string) => {
			return (
				<Predicate onDoubleClick={() => {
					this.props.model.removePredicate(predicate);
					this.props.engine.repaintCanvas();
				}}>
					{predicate}
				</Predicate>
			)
		};

	componentDidUpdate() {
		window.requestAnimationFrame(this.calculateLabelPosition);
	}

	componentDidMount() {
		window.requestAnimationFrame(this.calculateLabelPosition);
	}

	findPathAndRelativePositionToRenderLabel = (index: number): { path: SVGPathElement; position: number } => {
		// an array to hold all path lengths, making sure we hit the DOM only once to fetch this information
		const link = this.props.model.getParent();
		const lengths = link.getRenderedPath().map((path: any) => path.getTotalLength());

		// calculate the point where we want to display the label
		let labelPosition =
			lengths.reduce((previousValue: number, currentValue: number) => previousValue + currentValue, 0) *
			(index / (link.getLabels().length + 1));

		// find the path where the label will be rendered and calculate the relative position
		let pathIndex = 0;
		while (pathIndex < link.getRenderedPath().length) {
			if (labelPosition - lengths[pathIndex] < 0) {
				return {
					path: link.getRenderedPath()[pathIndex],
					position: labelPosition
				};
			}

			// keep searching
			labelPosition -= lengths[pathIndex];
			pathIndex++;
		}
	};

	calculateLabelPosition = () => {
		const found = this.findPathAndRelativePositionToRenderLabel(1);
		if (!found) {
			return;
		}

		const {path, position} = found;

		const labelDimensions = {
			//width: this.ref.current.offsetWidth,
			//height: this.ref.current.offsetHeight
			width: this.props.model.getOptions().offsetX,
			height: this.props.model.getOptions().offsetY
		};

		const pathCentre = path.getPointAtLength(position);

		const labelCoordinates = {
			x: pathCentre.x - labelDimensions.width / 2 + this.props.model.getOptions().offsetX,
			y: pathCentre.y - labelDimensions.height / 2 + this.props.model.getOptions().offsetY
		};

		//this.ref.current.style.transform = `translate(${labelCoordinates.x}px, ${labelCoordinates.y}px)`;
	};

	render() {
		return (
			<PredicatesNode>
				<Predicates>
					<PredicateContainer>
						{_.map(Array.from(this.props.model.getPredicates()), this.generatePredicate)}
						<Predicate onClick={() => {
							this.props.model.addPredicate(`Pred${this.props.model.predicateIndex}`);
							this.props.engine.repaintCanvas();
						}}>
							{ADDPORT}
						</Predicate>
					</PredicateContainer>
				</Predicates>
			</PredicatesNode>)
	}
}
