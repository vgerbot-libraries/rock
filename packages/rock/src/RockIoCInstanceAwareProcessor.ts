import {
    PartialInstAwareProcessor,
    ClassMetadata,
    ClassMetadataReader,
    MemberKey,
    Newable
} from '@vgerbot/ioc';
import { AUTO_SIGNAL_MARK_KEY, SIGNAL_MARK_KEY } from './annotations';
import { SignalMap } from './SignalMap';

export class RockIoCInstanceAwareProcessor
    implements PartialInstAwareProcessor
{
    beforeInstantiation<T>(constructor: Newable<T>): void | T | undefined {
        const metadata = ClassMetadata.getInstance(constructor).reader();
        const ctorMarkInfo = metadata.getCtorMarkInfo();
        const isAutoSignalClass = !!ctorMarkInfo[AUTO_SIGNAL_MARK_KEY];

        if (isAutoSignalClass) {
            return;
        } else {
            const members = metadata.getAllMarkedMembers();
            this.defineSignalProperties<T>(members, metadata, constructor);
        }
    }

    private defineSignalProperties<T>(
        members: Set<MemberKey>,
        metadata: ClassMetadataReader<unknown>,
        constructor: Newable<T>
    ) {
        const signalsMap = new SignalMap();
        members.forEach(key => {
            const markInfo = metadata.getMembersMarkInfo(key);
            const signalMarkInfo = markInfo[SIGNAL_MARK_KEY];
            if (!signalMarkInfo) {
                return;
            }
            const descriptor = Object.getOwnPropertyDescriptor(
                constructor.prototype,
                key
            );
            const hasGetter = !!descriptor?.get;
            const hasSetter = !!descriptor?.set;
            const hasValue = !!descriptor && 'value' in descriptor;
            if ((hasGetter || hasSetter) && !hasValue) {
                // IGNORE
            } else {
                Object.defineProperty(constructor.prototype, key, {
                    get: function () {
                        const [get] = signalsMap.get(this, key);
                        return get();
                    },
                    set: function (value: unknown) {
                        const [, set] = signalsMap.get(this, key);
                        set(value);
                    }
                });
            }
        });
    }
}
