export class MissingRockContextError extends Error {
    constructor() {
        super(
            '<Rock> not found. Please ensure it is added to the parent node.'
        );
        this.name = 'MissingRockContextError';
    }
}
