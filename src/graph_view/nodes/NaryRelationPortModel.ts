import {BinaryLinkModel} from "../links/binary/BinaryLinkModel";
import {ADDPORT} from "./ConstantNames";
import {UnBinaryNodeModel} from "./unbinary/UnBinaryNodeModel";
import { PortModelAlignment, PortModel, LinkModel } from "@projectstorm/react-diagrams";

export class NaryRelationPortModel extends PortModel {
    constructor(name:string ="default",alignment: PortModelAlignment = PortModelAlignment.LEFT) {
        super({
            type: 'nary',
            name: name,
            alignment: alignment
        });
    }

    createLinkModel(): LinkModel {
        if (this.getMaximumLinks() === 0) {
            return null;
        }
        return new BinaryLinkModel();
    }

    canLinkToPort(port: PortModel): boolean {
        return port.getNode() instanceof UnBinaryNodeModel && port.getName() !== ADDPORT;
    }
}