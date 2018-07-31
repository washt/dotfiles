"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("./ast");
class Section {
    constructor(sectionType, type, typeLocation, name, nameLocation, location, node) {
        this.references = [];
        this.sectionType = sectionType;
        this.type = type;
        this.typeLocation = typeLocation;
        this.name = name;
        this.nameLocation = nameLocation;
        this.location = location;
        this.node = node;
        if (node)
            this.attributes = ast_1.getMapValue(node.Val, { stripQuotes: true });
        else
            this.attributes = new Map();
    }
    match(options) {
        if (!options)
            return true;
        if (options.id && !this.id().match(options.id))
            return false;
        if (options.section_type && this.sectionType !== options.section_type)
            return false;
        if (this.type) {
            if (options.type && !this.type.match(options.type))
                return false;
        }
        else {
            if (options.type)
                return false;
        }
        if (options.name && !this.name.match(options.name))
            return false;
        if (options.name_position && !this.nameLocation.range.contains(options.name_position))
            return false;
        if (options.position && !this.location.range.contains(options.position))
            return false;
        return true;
    }
    id(rename) {
        let name = rename || this.name;
        if (this.sectionType === "variable") {
            return `var.${name}`;
        }
        if (this.sectionType === "local") {
            return `local.${name}`;
        }
        if (this.sectionType === "data")
            return [this.sectionType, this.type, name].join(".");
        if (this.sectionType === "output")
            return this.name;
        return [this.type, name].join(".");
    }
}
exports.Section = Section;

//# sourceMappingURL=section.js.map
