import { Candle } from './candle';
import { DebutCore } from './debut';
import { ExecutedOrder, OrderOptions } from './order';
export interface PluginDriverInterface {
    register(plugins: PluginInterface[]): void;
    getPublicAPI(): unknown;
    syncReduce<T extends SyncHooks>(hookName: T, ...args: Parameters<HookToArgumentsMap[T]>);
    asyncSkipReduce<T extends SkippingHooks>(hookName: T, ...args: Parameters<HookToArgumentsMap[T]>);
    asyncReduce<T extends AsyncHooks>(hookName: T, ...args: Parameters<HookToArgumentsMap[T]>): Promise<void>;
}

/**
 * Base plugin type
 */
export type Plugin = (api: PluginDriverInterface) => void;

/**
 * Plugin hook names
 */
export const enum PluginHook {
    onBeforeOpen = 'onBeforeOpen',
    onOpen = 'onOpen',
    onBeforeClose = 'onBeforeClose',
    onClose = 'onClose',
    onTick = 'onTick',
    onCandle = 'onCandle',
    onAfterCandle = 'onAfterCandle',
    onInit = 'onInit',
    onStart = 'onStart',
    onDispose = 'onDispose',
}

/**
 * Hooks with skip operation support
 */
export type SkippingHooks = PluginHook.onTick | PluginHook.onBeforeOpen | PluginHook.onBeforeClose;

/**
 * Synchronious hooks
 */
export type SyncHooks = PluginHook.onInit;

/**
 * Asynchronious hooks
 */
export type AsyncHooks =
    | PluginHook.onCandle
    | PluginHook.onAfterCandle
    | PluginHook.onClose
    | PluginHook.onDispose
    | PluginHook.onOpen
    | PluginHook.onStart;

/**
 * Map hook to typed function
 */
export declare type HookToArgumentsMap = {
    [PluginHook.onInit]: () => void;
    [PluginHook.onStart]: () => Promise<void>;
    [PluginHook.onDispose]: () => Promise<void>;
    [PluginHook.onBeforeClose]: (order: OrderOptions, closing: ExecutedOrder) => Promise<boolean | void>;
    [PluginHook.onBeforeOpen]: (order: OrderOptions) => Promise<boolean | void>;
    [PluginHook.onOpen]: (order: ExecutedOrder) => Promise<void>;
    [PluginHook.onClose]: (order: ExecutedOrder, closing: ExecutedOrder) => Promise<void>;
    [PluginHook.onCandle]: (candle: Candle) => Promise<void>;
    [PluginHook.onAfterCandle]: (candle: Candle) => Promise<void>;
    [PluginHook.onTick]: (tick: Candle) => Promise<boolean | void>;
};

/**
 * Interface for plugin, should be implemented
 */
export interface PluginInterface {
    name: string;
    api?: unknown;
    [PluginHook.onInit]?: HookToArgumentsMap[PluginHook.onInit];
    [PluginHook.onStart]?: HookToArgumentsMap[PluginHook.onStart];
    [PluginHook.onDispose]?: HookToArgumentsMap[PluginHook.onDispose];
    [PluginHook.onBeforeClose]?: HookToArgumentsMap[PluginHook.onBeforeClose];
    [PluginHook.onBeforeOpen]?: HookToArgumentsMap[PluginHook.onBeforeOpen];
    [PluginHook.onOpen]?: HookToArgumentsMap[PluginHook.onOpen];
    [PluginHook.onClose]?: HookToArgumentsMap[PluginHook.onClose];
    [PluginHook.onCandle]?: HookToArgumentsMap[PluginHook.onCandle];
    [PluginHook.onAfterCandle]?: HookToArgumentsMap[PluginHook.onAfterCandle];
    [PluginHook.onTick]?: HookToArgumentsMap[PluginHook.onTick];
}

/**
 * Runtime context for working plugin
 */
export interface PluginCtx {
    findPlugin<T extends PluginInterface>(name: string): T;
    debut: DebutCore;
}
