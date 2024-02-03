"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationForm = void 0;
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
class ConversationForm {
    /** This class is constructed internally by the plugin. */
    constructor(conversation) {
        this.conversation = conversation;
    }
    /**
     * Waits until the user sends some text, and returns this text. If the user
     * does something else, these updates will be skipped. You may specify the
     * `otherwise` handler that is called in such cases. Among other things,
     * this allows you to tell the user that they need to send some text.
     *
     * @param otherwise Handler that will be run for skipped updates
     * @returns The received text
     */
    async text(otherwise) {
        var _a, _b, _c;
        const ctx = await this.conversation.wait();
        const text = (_b = (_a = ctx.msg) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : (_c = ctx.msg) === null || _c === void 0 ? void 0 : _c.caption;
        if (text === undefined) {
            await (otherwise === null || otherwise === void 0 ? void 0 : otherwise(ctx));
            return await this.conversation.skip();
        }
        return text;
    }
    // TODO: add match which returns `ctx.match` after `ctx.hasMatch`
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
    async number(otherwise) {
        var _a, _b, _c, _d;
        const ctx = await this.conversation.wait();
        const num = parseFloat((_d = (_b = (_a = ctx.msg) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : (_c = ctx.msg) === null || _c === void 0 ? void 0 : _c.caption) !== null && _d !== void 0 ? _d : "NaN");
        if (isNaN(num)) {
            await (otherwise === null || otherwise === void 0 ? void 0 : otherwise(ctx));
            return await this.conversation.skip();
        }
        return num;
    }
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
    async int(options = {}) {
        var _a, _b, _c, _d;
        const { otherwise = undefined, radix = undefined } = typeof options === "number"
            ? { radix: options }
            : typeof options === "function"
                ? { otherwise: options }
                : options;
        const ctx = await this.conversation.wait();
        const text = (_d = (_b = (_a = ctx.msg) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : (_c = ctx.msg) === null || _c === void 0 ? void 0 : _c.caption) !== null && _d !== void 0 ? _d : "NaN";
        const num = parseInt(text, radix);
        if (isNaN(num)) {
            await (otherwise === null || otherwise === void 0 ? void 0 : otherwise(ctx));
            return await this.conversation.skip();
        }
        return num;
    }
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
    async select(options, otherwise) {
        var _a, _b, _c;
        const opts = options;
        const ctx = await this.conversation.wait();
        const text = (_b = (_a = ctx.msg) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : (_c = ctx.msg) === null || _c === void 0 ? void 0 : _c.caption;
        if (text === undefined || !opts.includes(text)) {
            await (otherwise === null || otherwise === void 0 ? void 0 : otherwise(ctx));
            return await this.conversation.skip();
        }
        return text;
    }
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
    async url(otherwise) {
        var _a, _b, _c, _d;
        const ctx = await this.conversation.wait();
        const text = (_d = (_b = (_a = ctx.msg) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : (_c = ctx.msg) === null || _c === void 0 ? void 0 : _c.caption) !== null && _d !== void 0 ? _d : "";
        let url;
        try {
            url = new URL(text);
        }
        catch {
            await (otherwise === null || otherwise === void 0 ? void 0 : otherwise(ctx));
            return await this.conversation.skip();
        }
        return url;
    }
}
exports.ConversationForm = ConversationForm;
