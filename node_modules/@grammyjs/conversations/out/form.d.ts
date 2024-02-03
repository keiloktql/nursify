import { type Context } from "./deps.node.js";
/**
 * Form building utilities that are exposed on `conversation.form`.
 *
 * All methods of this class behave similarly. They all follow these steps:
 * 1. Wait for an update.
 * 2. Validate the contained data.
 * 3. Skip the update if validation fails.
 * 4. Extract the data if the validation succeeds, and return the data.
 *
 * Moreover, you are able to pass a handler to each method that will be called
 * if the user sends an update that fails validation.
 */
export declare class ConversationForm<C extends Context> {
    private readonly conversation;
    /** This class is constructed internally by the plugin. */
    constructor(conversation: {
        wait: () => Promise<C>;
        skip: () => Promise<never>;
    });
    /**
     * Waits until the user sends some text, and returns this text. If the user
     * does something else, these updates will be skipped. You may specify the
     * `otherwise` handler that is called in such cases. Among other things,
     * this allows you to tell the user that they need to send some text.
     *
     * @param otherwise Handler that will be run for skipped updates
     * @returns The received text
     */
    text(otherwise?: (ctx: C) => unknown | Promise<unknown>): Promise<string>;
    /**
     * Waits until the user sends a number, and returns this number. If the user
     * sends something that cannot be parsed to a number using `parseFloat`,
     * these updates will be skipped. You may specify the `otherwise` handler
     * that is called in such cases. Among other things, this allows you to tell
     * the user that they need to send some text.
     *
     * @param otherwise Handler that will be run for skipped updates
     * @returns The received number
     */
    number(otherwise?: (ctx: C) => unknown | Promise<unknown>): Promise<number>;
    /**
     * Waits until the user sends a number, and returns this number. If the user
     * sends something that cannot be parsed to a number using `parseInt`, these
     * updates will be skipped. You may specify the `otherwise` handler that is
     * called in such cases. Among other things, this allows you to tell the
     * user that they need to send some text. You can also pass a radix that
     * will be passed to `parseInt`.
     *
     * @param options Options for radix and otherwise handler
     * @returns The received number
     */
    int(options?: number | ((ctx: C) => Promise<unknown> | unknown) | {
        radix?: number;
        otherwise?: (ctx: C) => Promise<unknown> | unknown;
    }): Promise<number>;
    /**
     * Waits until the user sends one of the given strings, and returns the
     * selected string. This is escpecially useful if you previously sent a
     * custom keyboard, and you expect the user to press one of the keyboard
     * buttons. If the user does something else, these updates will be skipped.
     * You may specify the `otherwise` handler that is called in such cases.
     * Among other things, this allows you to tell the user that they need to
     * select one of the given options.
     *
     * @param otherwise Handler that will be run for invalid updates
     * @returns The selected text
     */
    select<T extends string>(options: T[], otherwise?: (ctx: C) => Promise<unknown> | unknown): Promise<T>;
    /**
     * Waits until the user sends a URL, and returns this URL. If the user sends
     * something that cannot be parsed to a URL by the global `URL` constructor,
     * these updates will be skipped. You may specify the `otherwise` handler
     * that is called in such cases. Among other things, this allows you to tell
     * the user that they did not send a valid URL.
     *
     * Note that the URL constructor requires
     *
     * @param otherwise Handler that will be run for skipped updates
     * @returns The received number
     */
    url(otherwise?: (ctx: C) => unknown | Promise<unknown>): Promise<URL>;
}
