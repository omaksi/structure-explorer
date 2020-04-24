import {BinaryLinkModel} from "../links/binary/BinaryLinkModel";
import {ADDPORT} from "./ConstantNames";
import {UnBinaryNodeModel} from "./unbinary/UnBinaryNodeModel";
import { PortModelAlignment, PortModel, LinkModel } from "@projectstorm/react-diagrams";

export class NaryRelationPortModel extends PortModel {
    constructor(alignment: PortModelAlignment = PortModelAlignment.LEFT) {
        super({
            type: 'nary',
            name: alignment,
            alignment: alignment
        });
    }

    createLinkModel(): LinkModel {
        return new BinaryLinkModel();
    }

    canLinkToPort(port: PortModel): boolean {
        return port.getNode() instanceof UnBinaryNodeModel && port.getName() !== ADDPORT;
    }
}