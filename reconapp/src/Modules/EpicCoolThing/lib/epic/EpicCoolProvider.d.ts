import React from 'react';
import { EpicCool } from './types';
interface EpicCoolContextProps {
    enabled: EpicCool;
    toggleEnabled(enabled?: EpicCool): void;
}
export declare function useEpicCool(): EpicCoolContextProps;
interface EpicCoolProviderProps extends EpicCoolContextProps {
    children: React.ReactNode;
}
export declare function EpicCoolProvider({ enabled, toggleEnabled, children, }: EpicCoolProviderProps): JSX.Element;
export declare namespace EpicCoolProvider {
    var displayName: string;
}
export { };