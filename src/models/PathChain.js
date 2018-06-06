export class PathChainNode {
    constructor(model) {
        this.level = model.level || 0;
        this.seo = model.seo;
        this.title = model.title;
        this.path = model.path;
    }
}

export class PathChain {
    constructor(model) {
        this.nodes = _.map(model.nodes, node => new PathChainNode(node));
    }
}