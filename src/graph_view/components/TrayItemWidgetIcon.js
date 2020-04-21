import * as React from 'react';
import {Node as UnbinaryNode, Ports as UnbinaryPorts, PortsContainer as UnbinaryPortsContainer, Title as UnbinaryTittle, TitleName as UnbinaryTittleName} from "../nodes/unbinary/UnBinaryNodeWidget";
import {Port as UnbinaryPort} from "../nodes/unbinary/UnBinaryPortLabelWidget";
import {Node as ConstantNode, Title as ConstantTitle, TitleName as ConstantTitleName} from "../nodes/constant/ConstantNodeWidget";
import {Node as QuaternaryNode} from "../nodes/quaternary/QuaternaryNodeWidget";
import {Node as TernaryNode} from "../nodes/ternary/TernaryNodeWidget";
import {ADDPORT} from "../nodes/ConstantNames";

export const UnbinaryIcon = () =>{
    return(
        <UnbinaryNode style={{pointerEvents:"none"}}>
            <UnbinaryTittle>
                <UnbinaryTittleName>
                    Node
                </UnbinaryTittleName>
            </UnbinaryTittle>

            <UnbinaryPorts>
            <UnbinaryPortsContainer>
                <UnbinaryPort>{ADDPORT}</UnbinaryPort>
            </UnbinaryPortsContainer>
        </UnbinaryPorts>
        </UnbinaryNode>
    )
};

export const ConstantIcon = () =>{
    return(
        <ConstantNode style={{pointerEvents:"none"}}>
            <ConstantTitle>
                <ConstantTitleName>
                    Const
                </ConstantTitleName>
            </ConstantTitle>
        </ConstantNode>
    )
};

export const TernaryIcon = () =>{
    let size = 50;
    return(
        <TernaryNode size={size}>
            <svg
                width={size}
                height={27}
                dangerouslySetInnerHTML={{
                    __html:
                        `
          <g id="Layer_1">
          </g>
          <g id="Layer_2">
            <polygon fill="rgb(255,255,0)" stroke="#000000" stroke-width="2.5" stroke-miterlimit="10" points="5,` +
                        size / 2 +
                        ` ` +
                        size / 2 +
                        `,0 ` +
                        (size) +
                        `,` +
                        size / 2 +
                        ` ` +
                        size / 2 +
                        `,` +
                        (size/2) +
                        `"/>
          </g>
        `
                }}
            />

        </TernaryNode>
    )
};

export const QuaternaryIcon = () =>{
    let size = 50;
    return(
        <QuaternaryNode size={50}>
            <svg
                width={size}
                height={size}
                dangerouslySetInnerHTML={{
                    __html:
                        `
          <g id="Layer_1">
          </g>
          <g id="Layer_2">
            <polygon fill="rgb(255,255,0)" stroke="#000000" stroke-width="2.5" stroke-miterlimit="10" points="10,` +
                        size / 2 +
                        ` ` +
                        size / 2 +
                        `,10 ` +
                        (size - 10) +
                        `,` +
                        size / 2 +
                        ` ` +
                        size / 2 +
                        `,` +
                        (size - 10) +
                        ` "/>
          </g>
        `
                }}
            />
        </QuaternaryNode>
    )
};

