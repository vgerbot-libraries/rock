export class MissingSolidiumContextError extends Error {
    constructor() {
        super(
            '<Solidium> not found. Please ensure it is added to the parent node.'
        );
        this.name = 'MissingSolidiumContextError';
    }
}
