import { ClassMetadata } from '@vgerbot/ioc';
import { Signal } from '../../src/annotations';

describe('hello', () => {
    it('casual', () => {
        class A {
            public a: number = 0;
            public get times() {
                return this.a * 2;
            }
            @Signal
            public get aa() {
                return this.a + 1;
            }
            public set aa(aa: number) {
                this.a - 1;
            }
        }
        const reader = ClassMetadata.getInstance(A).reader();
        const members = reader.getAllMarkedMembers();
        console.log(
            members,
            Object.getOwnPropertyDescriptor(A.prototype, 'aa'),
            Object.getOwnPropertyNames(A.prototype)
        );
    });
});
