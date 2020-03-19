import styled from "@emotion/styled";
import * as React from 'react';

export const NodeU = styled.div`
		background-color: green;
		border-radius: 5px;
		font-family: sans-serif;
		color: black;
		border: solid 2px black;
		overflow: visible;
		font-size: 11px;
		border: solid 2px black;
	`;

export const TitleU = styled.div`
    	background: rgba(0, 0, 0, 0.3);
		display: flex;
		white-space: nowrap;
		justify-items: center;
		text-align:center;
	`;

export const TitleNameU = styled.div`
		flex-grow: 1;
		padding: 5px 5px;
	`;

export const PortsU = styled.div`
		display: flex;
		background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2));
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

export const PortU = styled.div`
		background: rgba(white, 0.1);
		color: black;
		text-align:center;
		justify-content:center;
		width:100%;
		height:20px;
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
};



export const PortD = styled.div`
		width: 16px;
		height: 16px;
		z-index: 10;
		background: rgba(0, 0, 0, 0.5);
		border-radius: 8px;
		cursor: pointer;

		&:hover {
			background: rgba(0, 0, 0, 1);
		}
	`;

export const Quaternary = () => {
    return(
        <NodeU>
        <div
            style={{
                position: 'relative',
                width: 20,
                height: 20
            }}>
            <svg
                width={20}
                height={20}
                dangerouslySetInnerHTML={{
                    __html:
                        `
          <g id="Layer_1">
          </g>
          <g id="Layer_2">
            <polygon fill="mediumpurple" stroke="'#000000'" stroke-width="3" stroke-miterlimit="10" points="10,` +
                        20 / 2 +
                        ` ` +
                        20 / 2 +
                        `,10 ` +
                        (20 - 10) +
                        `,` +
                        20 / 2 +
                        ` ` +
                        20 / 2 +
                        `,` +
                        (20 - 10) +
                        ` "/>
          </g>
        `
                }}
            />
        </div>
        </NodeU>
    )
};


/*<PortWidget
    style={{
        top: 20 / 2 - 8,
        left: -8,
        position: 'absolute'
    }}
>
    <Port />
</PortWidget>
<PortWidget
style={{
    left: 20 / 2 - 8,
        top: -8,
        position: 'absolute'
}}>
<Port />
</PortWidget>
<PortWidget
    style={{
        left: 20 - 8,
        top: 20 / 2 - 8,
        position: 'absolute'
    }}>
    <Port />
</PortWidget>
<PortWidget
style={{
    left: 20 / 2 - 8,
        top: 20 - 8,
        position: 'absolute'
}}
>
<Port />
</PortWidget>*/

/*export const Quaternary = () =>{
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