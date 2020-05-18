import * as React from 'react';
import {Node as UnbinaryNode, Ports as UnbinaryPorts, PortsContainer as UnbinaryPortsContainer, Title as UnbinaryTittle, TitleName as UnbinaryTittleName} from "../nodes/unbinary/UnBinaryNodeWidget";
import {Port as UnbinaryPort} from "../nodes/unbinary/UnBinaryPortLabelWidget";
import {Node as ConstantNode, Title as ConstantTitle, TitleName as ConstantTitleName} from "../nodes/constant/ConstantNodeWidget";
import {Node as QuaternaryNode} from "../nodes/quaternary/QuaternaryNodeWidget";
import {Node as TernaryNode} from "../nodes/ternary/TernaryNodeWidget";
import {ADDPORT} from "../nodes/ConstantNames";
import {NodeWidget as NodeWidgetForTernary} from "../nodes/ternary/TernaryNodeWidget";
import {NodeWidget as NodeWidgetForQuaternary} from "../nodes/quaternary/QuaternaryNodeWidget";

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
            <NodeWidgetForTernary size={size} color={"rgb(255,255,0)"} isSelected={false}/>
        </TernaryNode>
    )
};

export const QuaternaryIcon = () =>{
    let size = 50;
    return(
        <QuaternaryNode size={50}>
            <NodeWidgetForQuaternary size={size} color={"rgb(255,255,0)"} isSelected={false}/>
        </QuaternaryNode>
    )
};

