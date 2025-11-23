import { EventEmitter } from 'events';
export declare const apiFailureEmitter: EventEmitter<[never]>;
export declare function handleApiRequest(prompt: string): Promise<string>;
