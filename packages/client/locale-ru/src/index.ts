/**
 * Russian language pack, node half. Pure UI plugin: the empty apply exists so
 * the plugin appears in the host cordis.yml / Loader and the modules node half
 * can scan its `dsh.client` declaration; the browser half ships via
 * exports["./client"] and registers the language and dictionaries.
 */

/** Host plugin body — no host-side behavior for this surface plugin. */
export function apply(): void {}
