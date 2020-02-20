import styled from "@emotion/styled";
import * as React from 'react';
import _ from "lodash";
import {PortWidget} from "@projectstorm/react-diagrams-core";
import {Port} from "../nodes/UnBinaryNode/UnBinaryPortLabelWidget";

export const NodeU = styled.div`
		background-color: black;
		border-radius: 5px;
		font-family: sans-serif;
		color: white;
		border: solid 2px black;
		overflow: visible;
		font-size: 11px;
		border: solid 2px rgb(0,192,255);
	`;

export const TitleU = styled.div`
		background: rgba(0, 0, 0, 0.3);
		display: flex;
		white-space: nowrap;
		justify-items: center;
	`;

export const TitleNameU = styled.div`
		flex-grow: 1;
		padding: 5px 5px;
	`;

export const PortsU = styled.div`
		display: flex;
		background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2));
	`;

export const PortU = styled.div`
		height:20px;
        width:20px;
		background: rgba(white, 0.1);
		color: black;
		text-align:center;
	`;




export const PortsContainerU = styled.div`
		flex-grow: 1;
		display: flex;
		flex-direction: column;

		&:first-of-type {
			margin-right: 10px;
		}

		&:only-child {
			margin-right: 0px;
		}
	`;

export const Unbinary = () =>{
    return(
        <NodeU>
            <TitleU>
                <TitleNameU>
                    Node
                </TitleNameU>
            </TitleU>

            <PortsU>
            <PortsContainerU>
                    <PortU>+</PortU>
            </PortsContainerU>
        </PortsU>
        </NodeU>
    )
}

export const Diamond = () => {
    return(
        <div>

        </div>
    )
}

/*export const Diamond = () =>{
    return(
        <Node>
            <Title>
                <TitleName>
                </TitleName>
            </Title>
            <Ports>
                <PortsContainer>
                    <PortWidget>
                        <Port height={20} width={this.props.node.getOptions().name.length * 10}>+</Port>
                    </PortWidget>
                </PortsContainer>
            </Ports>
        </Node>
    )
}
*/