
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }
    class HtmlTag {
        constructor() {
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.43.0' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    let allAttempt = new Array();
    let dupliatt;
    let allUnattempt = new Array();
    let count = 0;
    let attlength = 0;
    let unattlength = 11;
    allUnattempt = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    new Array();
    function markAttempt(i) {
      count++;
      allAttempt.push(i);
      dupliatt = [...new Set(allAttempt)];
      allUnattempt = allUnattempt.filter((val) => {
        return !allAttempt.includes(val);
      });
      attlength = allAttempt.length;
      unattlength = allUnattempt.length;
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const quizes = [
      {
        timestamp: "2013-01-14 05:10:07",
        content_guid: "00CY9",
        inline_content: "",
        content_type: "q",
        content_id: "120855",
        content_subtype: "0",
        content_icon: "0",
        snippet:
          "There are four sections of the HR Impact Model. ... considered to be the most client-oriented role?",
        lang: "",
        content_text:
          '{"question":"There are four sections of the HR Impact Model. Which component of the model is considered to be the most client-oriented role?","answers":[{"id":"12085501","is_correct":"0","answer":"Policies and Procedures"},{"id":"12085502","is_correct":"0","answer":"Catalyst"},{"id":"12085503","is_correct":"1","answer":"Consultation"},{"id":"12085504","is_correct":"0","answer":"Programs and Processes"}],"explanation":"Answer option <seq no=\\"c\\" \\/> is correct.\\r\\rThe consultation role is considered to be the most client-oriented role, as HR Professionals in this role help define the overall organizational strategy.\\r\\rAnswer option <seq no=\\"a\\" \\/> is incorrect. Policies and procedures help define the organizational framework, but isn\'t the most client-facing or client-oriented role the HR Professional must play.\\r\\rAnswer option <seq no=\\"b\\" \\/> is incorrect. The HR Professional in the catalyst role processes market demographics, employee attitudes, organizational culture, and how to implement HR best practices.\\r\\rAnswer option <seq no=\\"d\\" \\/> is incorrect. Programs and processes is a client-facing role, but it takes more of a functional position in the organization, such as training and development.\\r\\r<uc:ref>Reference: PHR Exam Prep, Pearson Education, ISBN: 978-0-7897-3677-2. Chapter Three: Strategic Management. Official PHR and SPHR Certification Guide, HR Certification Institute, ISBN: 978-1-586-44149-4, Section III, The US HR Body of Knowledge. <\\/uc:ref> ","special_module_xml":"","case_id":"","synopsis":"","hints":"","short_url":"","key_concepts":"","keywords":"","video_transcripts":"","inline_content_guid":[]}',
      },
      {
        timestamp: "2013-01-14 05:10:07",
        content_guid: "00CYC",
        inline_content: "",
        content_type: "q",
        content_id: "12086",
        content_subtype: "0",
        content_icon: "0",
        snippet:
          "You work as a Network Administrator for McRobert...ng commands will you use to accomplish the task?",
        lang: "",
        content_text:
          '{"question":"You work as a Network Administrator for McRobert Inc. You want to format your floppy disk. Assuming that your floppy disk drive name is A, which of the following commands will you use to accomplish the task? ","answers":[{"id":"42196","is_correct":"0","answer":"<seq no=\\"d\\" \\/>CHKDSK \\/F A: "},{"id":"42197","is_correct":"0","answer":"<seq no=\\"c\\" \\/>FORMAT A\\/full "},{"id":"42198","is_correct":"0","answer":"<seq no=\\"b\\" \\/>FORMAT A:\\/\\/ "},{"id":"42199","is_correct":"1","answer":"<seq no=\\"a\\" \\/>FORMAT A:"}],"explanation":"Answer option <seq no=\\"d\\" \\/> is correct. \\r\\n\\r\\nThe <uc:cmd> FORMAT<\\/uc:cmd>  command formats a disk for use with MS-DOS. The <uc:cmd>FORMAT<\\/uc:cmd> command creates a new root directory and file allocation table for the disk. \\r\\n\\r\\n<uc:stx>Syntax:\\r\\n\\r\\nFORMAT &lt;drive name&gt;:<\\/uc:stx> \\r\\n\\r\\n<uc:ref> Reference: TechNet, Contents: \\"MS-DOS 6 Commands: Fasthelp - Format\\"\\r\\n<\\/uc:ref> ","special_module_xml":"","case_id":"","synopsis":"","hints":"","short_url":"","key_concepts":"","keywords":"","video_transcripts":"","inline_content_guid":{"":"00ygR"}}',
      },
      {
        timestamp: "2013-01-14 05:10:07",
        content_guid: "00CYS",
        inline_content: "",
        content_type: "q",
        content_id: "12089",
        content_subtype: "0",
        content_icon: "0",
        snippet:
          "You are an administrator of SQL Server 2000 comp...t to the database. Why does the connection fail?",
        lang: "",
        content_text:
          '{"question":"You are an administrator of SQL Server 2000 computer. The SQL Server contains a database, named SalesDB. You have created an .udl file to store the connection configuration for a DTS Package. You want to force the DTS package to use the .udl file to resolve the connections dynamically, and it should be available to network users at run time. You place the .udl file on the network share. Users complain that the DTS package is unable to connect to the database. Why does the connection fail?","answers":[{"id":"42208","is_correct":"1","answer":"<seq no=\\"a\\" \\/> The Always read properties from the UDL file connection property of the DTS package is disabled."},{"id":"42209","is_correct":"0","answer":"<seq no=\\"b\\" \\/> The Always read properties from the UDL file connection property of the DTS package is enabled."},{"id":"42210","is_correct":"0","answer":"<seq no=\\"c\\" \\/> The User DNS entry in the registry is not configured for the connection."},{"id":"42211","is_correct":"0","answer":"<seq no=\\"d\\" \\/> The System DNS entry in the registry is not configured for the connection."}],"explanation":"Answer option <seq no=\\"a\\" \\/> is correct. \\r\\rThe <uc:kwd>Always read properties from the UDL file<\\/uc:kwd> connection property specifies that the DTS package resolves connection information dynamically at run time. If this property is disabled, the connection information is copied from the .udl file into the package. Therefore, the .udl file is not referenced again and only editing the DTS package can modify the connection changes. To resolve the issue, you should copy the .udl file on the network share and enable the Always read properties from the UDL file connection property of the DTS package.\\r\\rAnswer options <seq no=\\"c\\" \\/> and <seq no=\\"d\\" \\/> are incorrect. If you are using a .udl file to store the connection configuration, there is no need to create a system or user DNS entry. Also, creating a registry entry for the connection information will not work, as the registry information will only be available to the local users. Hence, users cannot access the registry of the network computer. \\r\\r<uc:ref> Reference: SQL Book Online Contents: \\"DTS Designer Help\\", \\"Connection Properties\\"<\\/uc:ref>","special_module_xml":"","case_id":"","synopsis":"The Always read properties from the UDL file connection property specifies that the DTS package resolves connection information dynamically at run time. \\r ","hints":"","short_url":"","key_concepts":"","keywords":"","video_transcripts":"","inline_content_guid":{"":"00ygR"}}',
      },
      {
        timestamp: "2013-01-14 05:10:07",
        content_guid: "00CYY",
        inline_content: "",
        content_type: "q",
        content_id: "120900",
        content_subtype: "0",
        content_icon: "0",
        snippet:
          "There are seven stages of internal consulting th... one of the seven stages of internal consulting?",
        lang: "",
        content_text:
          '{"question":"There are seven stages of internal consulting that a HR Professional must be familiar with. Which one of the following is not one of the seven stages of internal consulting?","answers":[{"id":"12090001","is_correct":"0","answer":"Exploring the situation"},{"id":"12090002","is_correct":"0","answer":"Implementing"},{"id":"12090003","is_correct":"1","answer":"Executing the project plan"},{"id":"12090004","is_correct":"0","answer":"Developing recommendations"}],"explanation":"Answer option <seq no=\\"C\\" \\/> is correct.\\r\\rExecuting the project plan is not one of the seven stages of internal consulting. Executing is part of the project management lifecycle, but it is not one of the seven stages.\\r\\rAnswer option <seq no=\\"a\\" \\/> is incorrect. Exploring the situation is one of the seven stages of internal consulting.\\r\\rAnswer option <seq no=\\"b\\" \\/> is incorrect. Implementing is the sixth stage of internal consulting.\\r\\rAnswer option <seq no=\\"d\\" \\/> is incorrect.  Developing recommendations is one of the seven stages of internal consulting.\\r\\r<uc:ref>Reference: PHR Exam Prep, Pearson Education, ISBN: 978-0-7897-3677-2. Chapter Three: Strategic Management. Official PHR and SPHR Certification Guide, HR Certification Institute, ISBN: 978-1-586-44149-4, Section III, The US HR Body of Knowledge.<\\/uc:ref> ","special_module_xml":"","case_id":"","synopsis":"","hints":"","short_url":"","key_concepts":"","keywords":"","video_transcripts":"","inline_content_guid":[]}',
      },
      {
        timestamp: "2013-01-14 05:10:07",
        content_guid: "00CyL",
        inline_content: "",
        content_type: "q",
        content_id: "120933",
        content_subtype: "0",
        content_icon: "0",
        snippet:
          "You have some selected images in Adobe Bridge wh...d commands will you use to accomplish this task?",
        lang: "",
        content_text:
          '{"question":"You have some selected images in Adobe Bridge which are to be collected in a PDF file and send to the client, so that you may get an approval for your fashion assignment project. Which of the following valid automated commands will you use to accomplish this task?","answers":[{"id":"12093301","is_correct":"0","answer":"Convert to PDF"},{"id":"12093302","is_correct":"1","answer":"Output workspace =&gt; PDF"},{"id":"12093303","is_correct":"0","answer":"PDF Creator"},{"id":"12093304","is_correct":"0","answer":"Image Processor"}],"explanation":"Answer option <seq no=\\"b\\" \\/> is correct.\\r\\rIn Adobe Bridge CS4, the Adobe Media Gallery feature is now known as the Output workspace. This option is used in the Output workspace to export a \'PDF presentation of images\' or create a \'Flash Web gallery\', which can be uploaded to an ftp server. The PDF option in Output workspace offers a user either to create a regular multi-page PDF or a PDF Presentation, which will then be automatically launched into a full-screen slide show when opened. \\r\\rAnswer options <seq no=\\"a\\" \\/> and <seq no=\\"c\\" \\/> are incorrect. These are not valid options in Photoshop CS4.\\r\\rAnswer option <seq no=\\"d\\" \\/> is incorrect. Image Processor cannot be used to convert images in the PDF files. Image Processor works with the multiple image files in a folder in the same way as the batch command. However, while working with Image Processor, there is no need to create an action to start the processing of multiple images with Image Processor. Photoshop Image Processor can convert a set of files to JPEG, PSD, or TIFF format.\\r\\r<uc:ref>Reference: Photoshop CS4 Bible, Contents: \\"Using the Output workspace\\"<\\/uc:ref> ","special_module_xml":"","case_id":"","synopsis":"","hints":"","short_url":"","key_concepts":"","keywords":"","video_transcripts":"","inline_content_guid":[]}',
      },
      {
        timestamp: "2013-01-14 05:10:07",
        content_guid: "00CyO",
        inline_content: "",
        content_type: "q",
        content_id: "120939",
        content_subtype: "0",
        content_icon: "0",
        snippet:
          "Which of the following tools in the Camera Raw t...r dust or other unwanted elements from an image?",
        lang: "",
        content_text:
          '{"question":"Which of the following tools in the Camera Raw toolbar is used to remove various defects such as sensor dust or other unwanted elements from an image?","answers":[{"id":"12093901","is_correct":"1","answer":"Spot Removal"},{"id":"12093902","is_correct":"0","answer":"Red-Eye Removal"},{"id":"12093903","is_correct":"0","answer":"Graduated Filter"},{"id":"12093904","is_correct":"0","answer":"Straighten"}],"explanation":"Answer option <seq no=\\"a\\" \\/> is correct.\\r\\rThe Spot Removal tool is used to remove various defects such as sensor dust or other unwanted elements from an image.\\r\\rAnswer option <seq no=\\"b\\" \\/> is incorrect. The Red-Eye Removal tool is used to draw a highlight around the subject\'s iris, and the red is filled in with black.\\r\\rAnswer option <seq no=\\"c\\" \\/> is incorrect. The Graduate Filter is used to apply adjustments to a restricted portion of your photograph.\\r\\rAnswer option <seq no=\\"d\\" \\/> is incorrect. The Straighten tool is used to straight those photographs that are not straight, but slightly bent.\\r\\r<uc:ref>Reference: Photoshop CS4 Bible, Contents: \\"Working with Camera RAW\\"<\\/uc:ref> ","special_module_xml":"","case_id":"","synopsis":"","hints":"","short_url":"","key_concepts":"","keywords":"","video_transcripts":"","inline_content_guid":[]}',
      },
      {
        timestamp: "2013-01-14 05:10:07",
        content_guid: "00Cyr",
        inline_content: "",
        content_type: "q",
        content_id: "120945",
        content_subtype: "0",
        content_icon: "0",
        snippet:
          "Which of the following blending modes is availab...end color only to transparent pixels of a layer?",
        lang: "",
        content_text:
          '{"case_id":"","question":"Which of the following blending modes is available only for the painting tools and allows you to add the blend color only to transparent pixels of a layer?","explanation":"Answer option <seq no=\\"a\\" \\/> is correct.\\r\\n \\r\\n The Behind mode is available only for the painting tools. It allows you to add the blend color only to transparent pixels of a layer. It protects the base color and adds new colors to empty areas. This mode works only in layers with Lock Transparency deselected.\\r\\n \\r\\n Answer option <seq no=\\"b\\" \\/> is incorrect. The Clear mode works in the same way as the Eraser tool. It makes every affected pixel transparent according to its original opacity. This mode is available only for the Line tool, the Paint Bucket tool, the Brush tool, and the Pencil tool. It is also available for the Fill command and the Stroke command. This mode cannot be used on the background layer or the layer that has Preserve Transparency checked.\\r\\n \\r\\n Answer option <seq no=\\"c\\" \\/> is incorrect. The Darken mode compares the individual color components of the base color and the blend color, and chooses the color, whichever is darker (Lower value of each component of RGB or higher percent of each value of CMYK), as the resultant color.\\r\\n \\r\\n Answer option <seq no=\\"d\\" \\/> is incorrect. The Multiply mode multiplies the base color by the blend color. The resultant color is always darker than the original blend color. Black color multiplied by any color produces black, and white color multiplied by any color leaves the color unchanged.\\r\\n \\r\\n <uc:ref>Reference: Photoshop CS5 Bible, Contents: \\"Blending modes\\"<\\/uc:ref>","answers":[{"is_correct":"1","answer":"Behind mode","id":"01"},{"is_correct":"0","answer":"Clear mode","id":"02"},{"is_correct":"0","answer":"Darken mode","id":"03"},{"is_correct":"0","answer":"Multiply mode","id":"04"}],"keywords":"","reference":"","key_concepts":"","video_transcripts":"","total_answers":4,"correct_answers":1}',
      },
      {
        timestamp: "2013-01-14 05:10:07",
        content_guid: "00CZ3",
        inline_content: "",
        content_type: "q",
        content_id: "120963",
        content_subtype: "0",
        content_icon: "0",
        snippet:
          "You are creating a new site. You are using a Uni...g actions will you take to resolve this problem?",
        lang: "",
        content_text:
          '{"question":"You are creating a new site. You are using a Unix Server. You have provided links to other sites in your site. However, when you click on the links, they do not work. Which of the following actions will you take to resolve this problem?","answers":[{"id":"12096301","is_correct":"0","answer":"Go to Site, select Edit Site, click on the Testing server Category in the Advanced tab, and then set the Server Model to ColdFusion."},{"id":"12096302","is_correct":"0","answer":"Go to Site, select  Edit Site, click on the Testing server Category in the Advanced tab, and then set the Server Model to JSP."},{"id":"12096303","is_correct":"1","answer":"Go to Site, select  Edit Site, click on the Local Info Category in the Advanced tab, and then enable the Case sensitive link checking."},{"id":"12096304","is_correct":"0","answer":"Go to Site, select Edit Site, click on the Local Info Category in the Advanced tab, and then enable the Cache."}],"explanation":"Answer option <seq no=\\"c\\" \\/> is correct.\\r\\rAs you are using a Unix server, it is an important factor that the Local Info settings are configured to case-sensitive link checking. The case-sensitive link checking feature ensures that your links will work on a Unix server where links are case-sensitive. If you are using a Windows or Mac server, this does not matter as much, but it is a good idea to follow the strict naming and linking conventions of a Unix system in case you ever move your site to a different server.\\r\\rAnswer option <seq no=\\"a\\" \\/> is incorrect. Going to Site, selecting Edit Site, clicking on the Testing server Category in the Advanced tab, and then setting the Server Model to ColdFusion will specify the server to be a Coldfusion server.\\r\\rAnswer option <seq no=\\"b\\" \\/> is incorrect. Going to Site, selecting Edit Site, clicking on the Testing server Category in the Advanced tab, and then setting the Server Model to JSP will specify the server to be a JSP server. \\r\\rAnswer option <seq no=\\"d\\" \\/> is incorrect. Going to Site, selecting Edit Site, clicking on the Local Info Category in the Advanced tab, and then enabling the Cache will improve the Assets panel\'s performance and the features which manage the links in a Dreamweaver site.\\r\\rReference: <uc:ref><a href=\\" http:\\/\\/help.adobe.com\\/en_US\\/Dreamweaver\\/10.0_Using\\/WScbb6b82af5544594822510a94ae8d65-7f5fa.html\\"> http:\\/\\/help.adobe.com\\/en_US\\/Dreamweaver\\/10.0_Using\\/WScbb6b82af5544594822510a94ae8d65-7f5fa.html<\\/a>  \\r<\\/uc:ref> ","special_module_xml":"","case_id":"","synopsis":"","hints":"","short_url":"","key_concepts":"","keywords":"","video_transcripts":"","inline_content_guid":[]}',
      },
      {
        timestamp: "2017-02-27 06:42:33",
        content_guid: "00CZg",
        inline_content: "",
        content_type: "q",
        content_id: "120983",
        content_subtype: "0",
        content_icon: "0",
        snippet:
          "Your organization is likely to be purchased by a..., and employees. What is environmental scanning?",
        lang: "",
        content_text:
          '{"question":"Your organization is likely to be purchased by a competitor. The Management has asked you, in confidence, to complete environmental scanning to determine the effects of the purchase on your organization\'s culture, customers, and employees. What is environmental scanning?","explanation":"Answer <seq no=\\"b\\" \\/> is correct.\\r\\n\\r\\nEnvironmental scanning requires the HR Professional to review the opportunities and threats that a condition can have on an organization. In this instance the environmental scan is to consider the effects of the organization\'s sale on employee\'s, culture, and customers.\\r\\n\\r\\nAnswer <seq no=\\"a\\" \\/> is incorrect. This is not a good definition of environmental scanning because the number of factors to be considered or the cultural achievability of a change are not required.\\r\\n\\r\\nAnswer <seq no=\\"c\\" \\/> is incorrect. The change need not come from an external source - it could be an internal policy, shift in leadership, or other internal catalyst.\\r\\n\\r\\nAnswer <seq no=\\"d\\" \\/> is incorrect. This isn\'t a valid definition of environmental scanning as this answer doesn\'t consider opportunities or threats that can affect the macro and micro elements in the organization.","answers":[{"is_correct":"0","answer":"Environmental scanning is a review of the cultural achievability of a new project, organizational change, or market influence on at least three factors in an organization.","id":"01"},{"is_correct":"1","answer":"Environmental scanning is a review of the opportunities and threats that a condition may have on an organization.","id":"02"},{"is_correct":"0","answer":"Environmental scanning is an internal review of an external catalyst.","id":"03"},{"is_correct":"0","answer":"Environmental scanning is the process of assessing the effects of an organization change on both macro and micro elements in an organization.","id":"04"}],"correct_ans_str":"B","total_answers":4,"correct_answers":1}',
      },
      {
        timestamp: "2017-02-27 06:42:33",
        content_guid: "00CZH",
        inline_content: "",
        content_type: "q",
        content_id: "120984",
        content_subtype: "0",
        content_icon: "0",
        snippet:
          "Organizational functions, according to Fayol, co...organizational functions for strategic planning?",
        lang: "",
        content_text:
          '{"question":"Organizational functions, according to Fayol, conform to one of the six functional areas. Which one of the following is not an area of organizational functions for strategic planning?","explanation":"Answer <seq no=\\"d\\" \\/> is correct.\\r\\n\\r\\nFayol did not include human resource management as one of the six functional areas of an organization. The six areas are: technical activities, sales and marketing, financial activities, security activities, accounting activities, and managerial activities.\\r\\n\\r\\nAnswers <seq no=\\"a\\" \\/>, <seq no=\\"b\\" \\/>, and <seq no=\\"c\\" \\/> are incorrect. Technical activities, financial activities, and sales and marketing are components of the six functional areas.","answers":[{"is_correct":"0","answer":"Technical activities","id":"01"},{"is_correct":"0","answer":"Financial activities","id":"02"},{"is_correct":"0","answer":"Sales and marketing","id":"03"},{"is_correct":"1","answer":"Human resource management","id":"04"}],"correct_ans_str":"D","total_answers":4,"correct_answers":1}',
      },
      {
        timestamp: "2017-03-01 02:53:32",
        content_guid: "00CZh",
        inline_content: "",
        content_type: "q",
        content_id: "120985",
        content_subtype: "0",
        content_icon: "0",
        snippet:
          "Your organization is implementing the balanced s... four perspectives of the balanced score method?",
        lang: "",
        content_text:
          '{"question":"Your organization is implementing the balanced scorecard approach to measuring organizational success. In this balanced scorecard method there are four perspectives you\'ll consider. Which one of the following are the correct four perspectives of the balanced score method?","explanation":"Answer <seq no=\\"c\\" \\/> is correct.\\r\\n\\r\\nThe balance scorecard uses four perspectives as follows: Learning and growth, Business process, Customer, and Financial.\\r\\n\\r\\nAnswers <seq no=\\"a\\" \\/>, <seq no=\\"b\\" \\/>, and <seq no=\\"d\\" \\/> are incorrect. These are not the correct definitions of the balanced score method.","answers":[{"is_correct":"0","answer":"Education, Organizational, Development, and Financial","id":"01"},{"is_correct":"0","answer":"Developmental, Goals, Satisfaction, and Capital","id":"02"},{"is_correct":"1","answer":"Learning and growth, Business process, Customer, and Financial","id":"03"},{"is_correct":"0","answer":"Learning and growth, Management, Customer, and Security","id":"04"}],"correct_ans_str":"C","total_answers":4,"correct_answers":1}',
      },
    ];

    const questions = writable(quizes);

    /* src\components\SidePanel.svelte generated by Svelte v3.43.0 */

    const { console: console_1$2 } = globals;
    const file$5 = "src\\components\\SidePanel.svelte";

    function get_each_context_3$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[26] = list[i];
    	child_ctx[25] = i;
    	return child_ctx;
    }

    function get_each_context_4$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	child_ctx[29] = i;
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[26] = list[i];
    	child_ctx[25] = i;
    	return child_ctx;
    }

    function get_each_context_2$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	child_ctx[29] = i;
    	return child_ctx;
    }

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	child_ctx[25] = i;
    	return child_ctx;
    }

    const get_footer_slot_changes$1 = dirty => ({});
    const get_footer_slot_context$1 = ctx => ({});

    // (123:35) 
    function create_if_block_6$2(ctx) {
    	let div;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			p.textContent = "No Any Question Attempted";
    			set_style(p, "text-align", "center");
    			add_location(p, file$5, 124, 10, 3663);
    			attr_dev(div, "class", "attempt");
    			add_location(div, file$5, 123, 8, 3630);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$2.name,
    		type: "if",
    		source: "(123:35) ",
    		ctx
    	});

    	return block;
    }

    // (106:49) 
    function create_if_block_4$3(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let each_value_3 = /*data2*/ ctx[10];
    	validate_each_argument(each_value_3);
    	const get_key = ctx => /*datas*/ ctx[26];
    	validate_each_keys(ctx, each_value_3, get_each_context_3$1, get_key);

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		let child_ctx = get_each_context_3$1(ctx, each_value_3, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_3$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*questData, dispatch, no, data2*/ 1409) {
    				each_value_3 = /*data2*/ ctx[10];
    				validate_each_argument(each_value_3);
    				validate_each_keys(ctx, each_value_3, get_each_context_3$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_3, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block_3$1, each_1_anchor, get_each_context_3$1);
    			}
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$3.name,
    		type: "if",
    		source: "(106:49) ",
    		ctx
    	});

    	return block;
    }

    // (89:53) 
    function create_if_block_2$3(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let each_value_1 = /*data1*/ ctx[9];
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*datas*/ ctx[26];
    	validate_each_keys(ctx, each_value_1, get_each_context_1$2, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1$2(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_1$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*questData, dispatch, no, data1*/ 897) {
    				each_value_1 = /*data1*/ ctx[9];
    				validate_each_argument(each_value_1);
    				validate_each_keys(ctx, each_value_1, get_each_context_1$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block_1$2, each_1_anchor, get_each_context_1$2);
    			}
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(89:53) ",
    		ctx
    	});

    	return block;
    }

    // (74:6) {#if displayAll}
    function create_if_block$3(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_value = /*questData*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*data*/ ctx[23];
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "all svelte-x4wqq");
    			add_location(div, file$5, 74, 8, 1893);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*dispatch, no, questData*/ 385) {
    				each_value = /*questData*/ ctx[0];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, destroy_block, create_each_block$2, null, get_each_context$2);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(74:6) {#if displayAll}",
    		ctx
    	});

    	return block;
    }

    // (109:12) {#if i == index}
    function create_if_block_5$2(ctx) {
    	let div;
    	let a;
    	let p;
    	let t0_value = JSON.parse(/*data*/ ctx[23].content_text).question + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler_5() {
    		return /*click_handler_5*/ ctx[21](/*datas*/ ctx[26]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			set_style(p, "height", "20px");
    			set_style(p, "overflow", "hidden");
    			add_location(p, file$5, 114, 19, 3358);
    			attr_dev(a, "href", "/");
    			attr_dev(a, "class", "svelte-x4wqq");
    			add_location(a, file$5, 110, 16, 3196);
    			attr_dev(div, "class", "unattempt svelte-x4wqq");
    			add_location(div, file$5, 109, 14, 3155);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, p);
    			append_dev(p, t0);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", prevent_default(click_handler_5), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*questData*/ 1 && t0_value !== (t0_value = JSON.parse(/*data*/ ctx[23].content_text).question + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$2.name,
    		type: "if",
    		source: "(109:12) {#if i == index}",
    		ctx
    	});

    	return block;
    }

    // (108:10) {#each questData as data, index (data)}
    function create_each_block_4$1(key_1, ctx) {
    	let first;
    	let if_block_anchor;
    	let if_block = /*i*/ ctx[25] == /*index*/ ctx[29] && create_if_block_5$2(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*i*/ ctx[25] == /*index*/ ctx[29]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_5$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4$1.name,
    		type: "each",
    		source: "(108:10) {#each questData as data, index (data)}",
    		ctx
    	});

    	return block;
    }

    // (107:8) {#each data2 as datas, i (datas)}
    function create_each_block_3$1(key_1, ctx) {
    	let first;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let each_value_4 = /*questData*/ ctx[0];
    	validate_each_argument(each_value_4);
    	const get_key = ctx => /*data*/ ctx[23];
    	validate_each_keys(ctx, each_value_4, get_each_context_4$1, get_key);

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		let child_ctx = get_each_context_4$1(ctx, each_value_4, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_4$1(key, child_ctx));
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*dispatch, no, data2, questData*/ 1409) {
    				each_value_4 = /*questData*/ ctx[0];
    				validate_each_argument(each_value_4);
    				validate_each_keys(ctx, each_value_4, get_each_context_4$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_4, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block_4$1, each_1_anchor, get_each_context_4$1);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3$1.name,
    		type: "each",
    		source: "(107:8) {#each data2 as datas, i (datas)}",
    		ctx
    	});

    	return block;
    }

    // (92:12) {#if i === index}
    function create_if_block_3$3(ctx) {
    	let div;
    	let a;
    	let p;
    	let t0_value = JSON.parse(/*data*/ ctx[23].content_text).question + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			set_style(p, "height", "20px");
    			set_style(p, "overflow", "hidden");
    			add_location(p, file$5, 97, 19, 2739);
    			attr_dev(a, "href", "/");
    			attr_dev(a, "class", "svelte-x4wqq");
    			add_location(a, file$5, 93, 16, 2581);
    			attr_dev(div, "class", "attempt svelte-x4wqq");
    			add_location(div, file$5, 92, 14, 2542);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, p);
    			append_dev(p, t0);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", prevent_default(/*click_handler_4*/ ctx[20]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*questData*/ 1 && t0_value !== (t0_value = JSON.parse(/*data*/ ctx[23].content_text).question + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(92:12) {#if i === index}",
    		ctx
    	});

    	return block;
    }

    // (91:10) {#each questData as data, index (data)}
    function create_each_block_2$2(key_1, ctx) {
    	let first;
    	let if_block_anchor;
    	let if_block = /*i*/ ctx[25] === /*index*/ ctx[29] && create_if_block_3$3(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*i*/ ctx[25] === /*index*/ ctx[29]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_3$3(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$2.name,
    		type: "each",
    		source: "(91:10) {#each questData as data, index (data)}",
    		ctx
    	});

    	return block;
    }

    // (90:8) {#each data1 as datas, i (datas)}
    function create_each_block_1$2(key_1, ctx) {
    	let first;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let each_value_2 = /*questData*/ ctx[0];
    	validate_each_argument(each_value_2);
    	const get_key = ctx => /*data*/ ctx[23];
    	validate_each_keys(ctx, each_value_2, get_each_context_2$2, get_key);

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		let child_ctx = get_each_context_2$2(ctx, each_value_2, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_2$2(key, child_ctx));
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*dispatch, no, questData, data1*/ 897) {
    				each_value_2 = /*questData*/ ctx[0];
    				validate_each_argument(each_value_2);
    				validate_each_keys(ctx, each_value_2, get_each_context_2$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_2, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block_2$2, each_1_anchor, get_each_context_2$2);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(90:8) {#each data1 as datas, i (datas)}",
    		ctx
    	});

    	return block;
    }

    // (77:12) {#if i <= 10}
    function create_if_block_1$3(ctx) {
    	let a;
    	let p;
    	let t0_value = JSON.parse(/*data*/ ctx[23].content_text).question + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler_3() {
    		return /*click_handler_3*/ ctx[19](/*i*/ ctx[25]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			set_style(p, "height", "20px");
    			set_style(p, "overflow", "hidden");
    			add_location(p, file$5, 81, 17, 2150);
    			attr_dev(a, "href", "/");
    			attr_dev(a, "class", "svelte-x4wqq");
    			add_location(a, file$5, 77, 14, 2000);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, p);
    			append_dev(p, t0);
    			append_dev(p, t1);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", prevent_default(click_handler_3), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*questData*/ 1 && t0_value !== (t0_value = JSON.parse(/*data*/ ctx[23].content_text).question + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(77:12) {#if i <= 10}",
    		ctx
    	});

    	return block;
    }

    // (76:10) {#each questData as data, i (data)}
    function create_each_block$2(key_1, ctx) {
    	let first;
    	let if_block_anchor;
    	let if_block = /*i*/ ctx[25] <= 10 && create_if_block_1$3(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*i*/ ctx[25] <= 10) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$3(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(76:10) {#each questData as data, i (data)}",
    		ctx
    	});

    	return block;
    }

    // (73:24)         
    function fallback_block$1(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*displayAll*/ ctx[6]) return create_if_block$3;
    		if (/*displayAttempt*/ ctx[1] && /*data1*/ ctx[9] != undefined) return create_if_block_2$3;
    		if (/*displayUnattempt*/ ctx[2] && /*data2*/ ctx[10] !== []) return create_if_block_4$3;
    		if (/*data1*/ ctx[9] == undefined) return create_if_block_6$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(73:24)         ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div5;
    	let div3;
    	let div0;
    	let p0;
    	let t0;
    	let p0_class_value;
    	let t1;
    	let div1;
    	let p1;
    	let t2;
    	let p1_class_value;
    	let t3;
    	let div2;
    	let p2;
    	let t4;
    	let p2_class_value;
    	let t5;
    	let hr;
    	let t6;
    	let div4;
    	let current;
    	let mounted;
    	let dispose;
    	const footer_slot_template = /*#slots*/ ctx[15].footer;
    	const footer_slot = create_slot(footer_slot_template, ctx, /*$$scope*/ ctx[14], get_footer_slot_context$1);
    	const footer_slot_or_fallback = footer_slot || fallback_block$1(ctx);

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			t0 = text("All");
    			t1 = space();
    			div1 = element("div");
    			p1 = element("p");
    			t2 = text("Attempted");
    			t3 = space();
    			div2 = element("div");
    			p2 = element("p");
    			t4 = text("Unattempted");
    			t5 = space();
    			hr = element("hr");
    			t6 = space();
    			div4 = element("div");
    			if (footer_slot_or_fallback) footer_slot_or_fallback.c();
    			attr_dev(p0, "class", p0_class_value = "" + (null_to_empty(/*dispAll*/ ctx[5] ? "active" : "disactive") + " svelte-x4wqq"));
    			add_location(p0, file$5, 49, 6, 1261);
    			attr_dev(div0, "class", "inner all svelte-x4wqq");
    			attr_dev(div0, "id", "all");
    			add_location(div0, file$5, 48, 4, 1221);
    			attr_dev(p1, "class", p1_class_value = "" + (null_to_empty(/*dispAttempt*/ ctx[3] ? "active" : "disactive") + " svelte-x4wqq"));
    			add_location(p1, file$5, 54, 6, 1427);
    			attr_dev(div1, "class", "inner attempted svelte-x4wqq");
    			attr_dev(div1, "id", "attempted");
    			add_location(div1, file$5, 53, 4, 1375);
    			attr_dev(p2, "class", p2_class_value = "" + (null_to_empty(/*dispUnattempt*/ ctx[4] ? "active" : "disactive") + " svelte-x4wqq"));
    			add_location(p2, file$5, 62, 6, 1637);
    			attr_dev(div2, "class", "inner unattempted svelte-x4wqq");
    			attr_dev(div2, "id", "unattempted");
    			add_location(div2, file$5, 61, 4, 1581);
    			attr_dev(div3, "class", "header");
    			add_location(div3, file$5, 47, 2, 1195);
    			add_location(hr, file$5, 70, 2, 1805);
    			attr_dev(div4, "class", "body");
    			add_location(div4, file$5, 71, 2, 1815);
    			attr_dev(div5, "class", "outer svelte-x4wqq");
    			add_location(div5, file$5, 46, 0, 1172);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div3);
    			append_dev(div3, div0);
    			append_dev(div0, p0);
    			append_dev(p0, t0);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			append_dev(div1, p1);
    			append_dev(p1, t2);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			append_dev(div2, p2);
    			append_dev(p2, t4);
    			append_dev(div5, t5);
    			append_dev(div5, hr);
    			append_dev(div5, t6);
    			append_dev(div5, div4);

    			if (footer_slot_or_fallback) {
    				footer_slot_or_fallback.m(div4, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(p0, "click", /*click_handler*/ ctx[16], false, false, false),
    					listen_dev(p1, "click", /*click_handler_1*/ ctx[17], false, false, false),
    					listen_dev(p2, "click", /*click_handler_2*/ ctx[18], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*dispAll*/ 32 && p0_class_value !== (p0_class_value = "" + (null_to_empty(/*dispAll*/ ctx[5] ? "active" : "disactive") + " svelte-x4wqq"))) {
    				attr_dev(p0, "class", p0_class_value);
    			}

    			if (!current || dirty[0] & /*dispAttempt*/ 8 && p1_class_value !== (p1_class_value = "" + (null_to_empty(/*dispAttempt*/ ctx[3] ? "active" : "disactive") + " svelte-x4wqq"))) {
    				attr_dev(p1, "class", p1_class_value);
    			}

    			if (!current || dirty[0] & /*dispUnattempt*/ 16 && p2_class_value !== (p2_class_value = "" + (null_to_empty(/*dispUnattempt*/ ctx[4] ? "active" : "disactive") + " svelte-x4wqq"))) {
    				attr_dev(p2, "class", p2_class_value);
    			}

    			if (footer_slot) {
    				if (footer_slot.p && (!current || dirty[0] & /*$$scope*/ 16384)) {
    					update_slot_base(
    						footer_slot,
    						footer_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(footer_slot_template, /*$$scope*/ ctx[14], dirty, get_footer_slot_changes$1),
    						get_footer_slot_context$1
    					);
    				}
    			} else {
    				if (footer_slot_or_fallback && footer_slot_or_fallback.p && (!current || dirty[0] & /*questData, no, displayAll, displayAttempt, displayUnattempt*/ 199)) {
    					footer_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(footer_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(footer_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			if (footer_slot_or_fallback) footer_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SidePanel', slots, ['footer']);
    	const dispatch = createEventDispatcher();
    	let data1 = dupliatt;
    	let data2 = allUnattempt;
    	console.log(data1, allUnattempt);
    	let questData;

    	const unsubscribe = questions.subscribe(items => {
    		$$invalidate(0, questData = items);
    	});

    	let displayAttempt = false;
    	let displayUnattempt = false;
    	let dispAttempt = false;
    	let dispUnattempt = false;
    	let dispAll = false;
    	let displayAll = true;

    	function showAll() {
    		$$invalidate(5, dispAll = true);
    		$$invalidate(6, displayAll = true);
    		$$invalidate(1, displayAttempt = false);
    		$$invalidate(2, displayUnattempt = false);
    		$$invalidate(3, dispAttempt = false);
    		$$invalidate(4, dispUnattempt = false);
    	}

    	function showAttempt() {
    		$$invalidate(1, displayAttempt = true);
    		$$invalidate(2, displayUnattempt = false);
    		$$invalidate(3, dispAttempt = true);
    		$$invalidate(4, dispUnattempt = false);
    		$$invalidate(5, dispAll = false);
    		$$invalidate(6, displayAll = false);
    	}

    	function showUnattempt() {
    		$$invalidate(2, displayUnattempt = true);
    		$$invalidate(1, displayAttempt = false);
    		$$invalidate(3, dispAttempt = false);
    		$$invalidate(4, dispUnattempt = true);
    		$$invalidate(5, dispAll = false);
    		$$invalidate(6, displayAll = false);
    	}

    	let no = 1;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<SidePanel> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => showAll();
    	const click_handler_1 = () => showAttempt();
    	const click_handler_2 = () => showUnattempt();
    	const click_handler_3 = i => dispatch("currentquest", $$invalidate(7, no = i));
    	const click_handler_4 = () => dispatch("currentquest", $$invalidate(7, no = 0));
    	const click_handler_5 = datas => dispatch("currentquest", $$invalidate(7, no = datas));

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(14, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		dupliatt,
    		allUnattempt,
    		data1,
    		data2,
    		questions,
    		questData,
    		unsubscribe,
    		displayAttempt,
    		displayUnattempt,
    		dispAttempt,
    		dispUnattempt,
    		dispAll,
    		displayAll,
    		showAll,
    		showAttempt,
    		showUnattempt,
    		no
    	});

    	$$self.$inject_state = $$props => {
    		if ('data1' in $$props) $$invalidate(9, data1 = $$props.data1);
    		if ('data2' in $$props) $$invalidate(10, data2 = $$props.data2);
    		if ('questData' in $$props) $$invalidate(0, questData = $$props.questData);
    		if ('displayAttempt' in $$props) $$invalidate(1, displayAttempt = $$props.displayAttempt);
    		if ('displayUnattempt' in $$props) $$invalidate(2, displayUnattempt = $$props.displayUnattempt);
    		if ('dispAttempt' in $$props) $$invalidate(3, dispAttempt = $$props.dispAttempt);
    		if ('dispUnattempt' in $$props) $$invalidate(4, dispUnattempt = $$props.dispUnattempt);
    		if ('dispAll' in $$props) $$invalidate(5, dispAll = $$props.dispAll);
    		if ('displayAll' in $$props) $$invalidate(6, displayAll = $$props.displayAll);
    		if ('no' in $$props) $$invalidate(7, no = $$props.no);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		questData,
    		displayAttempt,
    		displayUnattempt,
    		dispAttempt,
    		dispUnattempt,
    		dispAll,
    		displayAll,
    		no,
    		dispatch,
    		data1,
    		data2,
    		showAll,
    		showAttempt,
    		showUnattempt,
    		$$scope,
    		slots,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5
    	];
    }

    class SidePanel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SidePanel",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\components\Header.svelte generated by Svelte v3.43.0 */

    const file$4 = "src\\components\\Header.svelte";

    function create_fragment$5(ctx) {
    	let header;
    	let img;
    	let img_src_value;
    	let t0;
    	let h1;

    	const block = {
    		c: function create() {
    			header = element("header");
    			img = element("img");
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "uCertify Test Prep";
    			attr_dev(img, "class", "img-fluid svelte-hm80pr");
    			if (!src_url_equal(img.src, img_src_value = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASkAAACqCAMAAADGFElyAAAAkFBMVEXAABD////DAA2RKy69AAC7AAC/AADAAA2/AAPOVVm/AAj99PXIOz/MTVL88fPdiIz76uz23N7Ta2/EHiTZe4DRZGfuwsX009bBEhvor7LQWF/glZj++vvxy87qtbf66+zmqq3zztLbg4f34ePFKy/gmZvJQ0fjoqbWdHfVaW7IMjnBEBfZf4LEJSrJRUnuw8Vra3TlAAALKUlEQVR4nO2ce2OivBLGZU8uGKhKVZSKlwpaq2v9/t/u5AoBguhWe8677/z+2kIIyUMymZnE7fUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4IdgpKMAoj/Sjv97WPiJr0nB8OT8d0lFfYIxIuze5/zQ26D2YYVOsTf/RyrFuByuhiO0Pyx2i9czurNCrpQX7bH7JsX9kffPVArlu+Q38euXfXyIPEnwu6XTbQilPG+BXYPRxztx83FKMYKwhJAnq09eUt7yjNa6hc4zz0uVVN60y0JXUUp57+emVCyfeQ9UiiKcTxdJfIlXH4cvJL6NzzV7SN2Nd5GBbHpcHTfoyC/v1Pdv3OxCK+W9NptMDt7jlKIYHZaBVxDtzpico+jwFKnIVE+xX3bb/fFa6MPQ6NFKvT5OKYK26iun2XI5UuM/OV08b3ivYb0JtFVNT09W2yl651eOfo/sZQMmfzT7nqwUflF2NJ7+4lYKjbdr2Q/vEUpRSfUaedEj164dTYSZEQMJ7WfBILnzzT+iFP6t2h0iZckZIomehYvvKkWJpNZG/K6MdkUp8Xl2csoRMp7fO+1/QiltQjeW+aZ48SCl8FJUs6rZHEr45WBrXyWfouBBv4/d3akfUEqL8lGNBXCir36v8h6+uJTinyLsnypfAa9EwZc/XkGerxRS69CyFjRRPHqmUrxn1RlJiZh8wqD/IU9Xys+lbxCM601Eby1dvI9WpertCMUCkjr8xhtxKqU96WkaCAi2uHvw4ljZo0ZXKJ79pFLKxUrHD1UKD7NIkI0kkUW2u1MqvV6np2YL0eFHlZJ+dPDnE8ShlPH2XawdPb4KVhFR4ugJpWtXFxnrXpesArcqJb2pxyp1TSh76aCMERXxUnPB1xfKQmSvnuu7hqJYjaohBY8N0fw8rmVMVMXIVMytAZFhY4/5vm+U8iXM2RBxByulTkSWo8KnstBvs650KkXxxxWhdmW/6Ol83L98ThbJhxoDdK4uDDdxqSfeyOcGztyBMB22UhTTyUWsiGkWf5JiiaenXFR84BVzwX0cJlEwSk6kR49hGJ6lPxWfQ8lRSDXOw6+318liE3+phog7+VAqFR5luTH132zUUCP94sJLM2FTVeq6ULPyS1MSmOxFINcTE08LCneSEhWMLp2Tg5LUVspHQxkbqorXBzNW8dD6UihXK4SX/fLnVsStGeEeO6bFn3IdYcdmT34jUvlbfVtcXsgaLa4ppceAm/RozT1SNHMwVkqlRQuLYI58mR66lOLTL9sUd9BJxIaD4T4/HjLx0EpLhbbFqxb4JShfcmoqxTvI8lHx57BNqQkhVmZjMAuZ6r15dNCMHapKaaHWm0SwepckmtWn/TQl50lgKcXn+Cn/qCmFVMDnteVWuD0y/yQid+StCCbMR8q1MGYakeNKV8x9sGyoxtgMnTar1SqR43CdrCQfSESV49fIUoqexc1ELi2pKrbi0xgzPVYHfWISmRj3Zey+QA5PtqIUkh+TTxblT3mpgLh9KcrwPrCU4muZr5UulNIhyw0xBOuJzxnrJjM1ayfYfBXtla0Cb4v0bMwIla169+SDGvU4RrNSqZ4qp7wEVHaF4r4aF/buAxYD0LkJU1Mq0krJr9zpoyshBqU35+c1paS59dKwM4aQUdlgbmpSa/q6cAd8PYPSF0z14qxtn3JD6lk5ElpKWTVWvQT9YV+tuSJetHHaim8phYY1pShNq0qpMRrkXV4Yeat2jCobtC2XhrUanKhIaOoZ7VZKl+9QihxtzVUxHs67/fgHK9WrKqXT2YPOGEK+OM396oWyD9SXPVdfW66RK/2ONqVGNyhlxrwVNvO4vSVr/FSlzAI5GHd4xkRajJnVRDWx1ya7q5XS0SM6hblxWFqU8m9SSg1la2kWnrLTSy6VmipLZ5TSFv1hSnWMKSR1SWqzgGMMXFUp/mdR4beU0uahdIy5uYxa9tQpVatEtBTEyq5ksfxLybZqz0reOvu67BQlmepXGUzohLLZk6spZff1W0qpHhQ2nc1T7pS2tJIRJZUkVUqNSi+38P9cdCql94u61j52lsWSw6TgkFhG4XlKsXFgz3u09Qbt8TlDpVSBVqp0X+Nr5zs6ldKJ/7apbzCufJNnK2U8PuXwUW6nryVhGYtalVpePRPUrZT2rSfX9xXM2tHk8GyldP5MmUjxx1WT6hMjVV2pJbpqYLpnnw4YOtJHZNKi56nnXPtsvqmUfj6QeTceCVyut7SQqman3q8LdYNF1zuUzci8glZqiGmdsufPUgq9eqYk63neW0fcReYXmfyd6bXvXf4V14+K1OlUijLlWnvHtgaovJDyR1oyDrLY05TShz3Et+RhUtZ5CIdhhz919bCefHuXUkWI3GYnaU+8REdprhSyKfc0pUyOd0pEBHTz5n/FR7+heKdSZvq1rL2kvx7ytmsvYfY/UUptb/EayMFL511hV1Hdo5UyOw52my342ij2lbTnGbS384lK6eAvzXlNt+8UPV4pM6iCs8P5FDelcdLexGdt7PtlLv2JSmkruTjy4OnmPbp7lfqtRLiilNkZdS2/lEddqZyWurG1/vrhEN/oJdRbfI9SOu8QJTzku6XXqjqjFHHReIleYffFl2CsoZSfq9jP0UuRSFNFzc7EvvJN+bSYmVi7Q6l6H+9RyhwxuevsmbYqUX/q4LXhvprMYuEU6KWusoLoExyim9UjFWLRMbs9SO3sRPbJXLwtHYcupYLainFjfkrBxqqBg1PXYl/iW/saTRqTkvpyvIy0BMxsqlYNI9ZHCbkXYO2CITGigtx8Re2frIpkPRVJn8g8oHvu8Lh0Mu6g7tBqeYdSrkVDW4jNPWe5yDm7IlVjAdNjKMZIJErGsbdUUy3E9lFwnUHh7t0U8xuMiV8ZTMWL9qU7oY7EeFEo6+IF+GoxKIQkJzmtZ7hhApDaDwre9I6Duk/m+tuWwmu3CTv8FZ3Qa3WP3VKdinDZQX1tMBsB0eTr5bBKvQvS514X/dCeR28mkMx2b2Geh9MPodP6y/qI5EuXuQz7+/3bjhcYHNV97haf9Lqw2pOaQ2wWVy9aJavleodk+bkpH8p9MoTxm4rQBpMzahzYodI+37qO3SRVIx9YGEPVLqxTd5xRxVaN46JQGujd57j6gwx0rL14pkcUy5ezolovm8WVjlK0tB/6QD12fC/LpxHXDg1nZd1BNGtYbtmNrpCvKZWd2qvTiEqsrXA+txiRIqRpsF5W3svwflmtadav/66CoO26vD/YFucv9tUng+oMZNanjYZ89tWyXUtUJH8Mu7pBEgm97P4fnTFxbruNz8bnyDfRaL3O4oPoGZke3r5yKo6m1MoRfB4ulRLp+n1xdJxZo4h8JqKydbY6kKLhdN6vUlOYoUmcZVkUL0K5ZNTK733umFUrONbNugj5tvfYc/Nq/6WNivlR+Ig3jxL9gy5hjVn9eLjpEaJHXsfXkT/iThdTgpF/mvPhZY8bWvPrmk8hJL6NqbRaXlxk1QoafeAL4+Dek2HOpl17iSzfODrfVrGvlLxa5tbKak/d/0z5MI87Ha4a0ID7va7jlUAdikbXsogAt5Yq+82d0it7VwDJk8tO/HqGhOmTfhL2d6Bibh4vUTTzomf/hvWfjN4PyoiIXW/P4P0LMSdaP3ZtqWtAYe1bf/tXTn83FF20UIvO3bp/OZQsMh5uX/oworqgGM3H5En/D8HfBgWHEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAP+EXcBu9/wC38V8D4dBSu9XtVwAAAABJRU5ErkJggg==")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Svelte logo");
    			add_location(img, file$4, 2, 2, 30);
    			attr_dev(h1, "class", "svelte-hm80pr");
    			add_location(h1, file$4, 7, 2, 4220);
    			attr_dev(header, "class", "svelte-hm80pr");
    			add_location(header, file$4, 1, 0, 18);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, img);
    			append_dev(header, t0);
    			append_dev(header, h1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var dayjs_min = createCommonjsModule(function (module, exports) {
    !function(t,e){module.exports=e();}(commonjsGlobal,(function(){var t=1e3,e=6e4,n=36e5,r="millisecond",i="second",s="minute",u="hour",a="day",o="week",f="month",h="quarter",c="year",d="date",$="Invalid Date",l=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,y=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,M={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},m=function(t,e,n){var r=String(t);return !r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},g={s:m,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return (e<=0?"+":"-")+m(r,2,"0")+":"+m(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return -t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,f),s=n-i<0,u=e.clone().add(r+(s?-1:1),f);return +(-(r+(n-i)/(s?i-u:u-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return {M:f,y:c,w:o,d:a,D:d,h:u,m:s,s:i,ms:r,Q:h}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},D="en",v={};v[D]=M;var p=function(t){return t instanceof _},S=function(t,e,n){var r;if(!t)return D;if("string"==typeof t)v[t]&&(r=t),e&&(v[t]=e,r=t);else {var i=t.name;v[i]=t,r=i;}return !n&&r&&(D=r),r||!n&&D},w=function(t,e){if(p(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new _(n)},O=g;O.l=S,O.i=p,O.w=function(t,e){return w(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var _=function(){function M(t){this.$L=S(t.locale,null,!0),this.parse(t);}var m=M.prototype;return m.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(O.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match(l);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.$x=t.x||{},this.init();},m.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds();},m.$utils=function(){return O},m.isValid=function(){return !(this.$d.toString()===$)},m.isSame=function(t,e){var n=w(t);return this.startOf(e)<=n&&n<=this.endOf(e)},m.isAfter=function(t,e){return w(t)<this.startOf(e)},m.isBefore=function(t,e){return this.endOf(e)<w(t)},m.$g=function(t,e,n){return O.u(t)?this[e]:this.set(n,t)},m.unix=function(){return Math.floor(this.valueOf()/1e3)},m.valueOf=function(){return this.$d.getTime()},m.startOf=function(t,e){var n=this,r=!!O.u(e)||e,h=O.p(t),$=function(t,e){var i=O.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?i:i.endOf(a)},l=function(t,e){return O.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},y=this.$W,M=this.$M,m=this.$D,g="set"+(this.$u?"UTC":"");switch(h){case c:return r?$(1,0):$(31,11);case f:return r?$(1,M):$(0,M+1);case o:var D=this.$locale().weekStart||0,v=(y<D?y+7:y)-D;return $(r?m-v:m+(6-v),M);case a:case d:return l(g+"Hours",0);case u:return l(g+"Minutes",1);case s:return l(g+"Seconds",2);case i:return l(g+"Milliseconds",3);default:return this.clone()}},m.endOf=function(t){return this.startOf(t,!1)},m.$set=function(t,e){var n,o=O.p(t),h="set"+(this.$u?"UTC":""),$=(n={},n[a]=h+"Date",n[d]=h+"Date",n[f]=h+"Month",n[c]=h+"FullYear",n[u]=h+"Hours",n[s]=h+"Minutes",n[i]=h+"Seconds",n[r]=h+"Milliseconds",n)[o],l=o===a?this.$D+(e-this.$W):e;if(o===f||o===c){var y=this.clone().set(d,1);y.$d[$](l),y.init(),this.$d=y.set(d,Math.min(this.$D,y.daysInMonth())).$d;}else $&&this.$d[$](l);return this.init(),this},m.set=function(t,e){return this.clone().$set(t,e)},m.get=function(t){return this[O.p(t)]()},m.add=function(r,h){var d,$=this;r=Number(r);var l=O.p(h),y=function(t){var e=w($);return O.w(e.date(e.date()+Math.round(t*r)),$)};if(l===f)return this.set(f,this.$M+r);if(l===c)return this.set(c,this.$y+r);if(l===a)return y(1);if(l===o)return y(7);var M=(d={},d[s]=e,d[u]=n,d[i]=t,d)[l]||1,m=this.$d.getTime()+r*M;return O.w(m,this)},m.subtract=function(t,e){return this.add(-1*t,e)},m.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||$;var r=t||"YYYY-MM-DDTHH:mm:ssZ",i=O.z(this),s=this.$H,u=this.$m,a=this.$M,o=n.weekdays,f=n.months,h=function(t,n,i,s){return t&&(t[n]||t(e,r))||i[n].substr(0,s)},c=function(t){return O.s(s%12||12,t,"0")},d=n.meridiem||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},l={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:O.s(a+1,2,"0"),MMM:h(n.monthsShort,a,f,3),MMMM:h(f,a),D:this.$D,DD:O.s(this.$D,2,"0"),d:String(this.$W),dd:h(n.weekdaysMin,this.$W,o,2),ddd:h(n.weekdaysShort,this.$W,o,3),dddd:o[this.$W],H:String(s),HH:O.s(s,2,"0"),h:c(1),hh:c(2),a:d(s,u,!0),A:d(s,u,!1),m:String(u),mm:O.s(u,2,"0"),s:String(this.$s),ss:O.s(this.$s,2,"0"),SSS:O.s(this.$ms,3,"0"),Z:i};return r.replace(y,(function(t,e){return e||l[t]||i.replace(":","")}))},m.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},m.diff=function(r,d,$){var l,y=O.p(d),M=w(r),m=(M.utcOffset()-this.utcOffset())*e,g=this-M,D=O.m(this,M);return D=(l={},l[c]=D/12,l[f]=D,l[h]=D/3,l[o]=(g-m)/6048e5,l[a]=(g-m)/864e5,l[u]=g/n,l[s]=g/e,l[i]=g/t,l)[y]||g,$?D:O.a(D)},m.daysInMonth=function(){return this.endOf(f).$D},m.$locale=function(){return v[this.$L]},m.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=S(t,e,!0);return r&&(n.$L=r),n},m.clone=function(){return O.w(this.$d,this)},m.toDate=function(){return new Date(this.valueOf())},m.toJSON=function(){return this.isValid()?this.toISOString():null},m.toISOString=function(){return this.$d.toISOString()},m.toString=function(){return this.$d.toUTCString()},M}(),b=_.prototype;return w.prototype=b,[["$ms",r],["$s",i],["$m",s],["$H",u],["$W",a],["$M",f],["$y",c],["$D",d]].forEach((function(t){b[t[1]]=function(e){return this.$g(e,t[0],t[1])};})),w.extend=function(t,e){return t.$i||(t(e,_,w),t.$i=!0),w},w.locale=S,w.isDayjs=p,w.unix=function(t){return w(1e3*t)},w.en=v[D],w.Ls=v,w.p={},w}));
    });

    var duration = createCommonjsModule(function (module, exports) {
    !function(t,s){module.exports=s();}(commonjsGlobal,(function(){var t,s,n=1e3,i=6e4,e=36e5,r=864e5,o=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,u=31536e6,h=2592e6,a=/^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/,d={years:u,months:h,days:r,hours:e,minutes:i,seconds:n,milliseconds:1,weeks:6048e5},c=function(t){return t instanceof p},f=function(t,s,n){return new p(t,n,s.$l)},m=function(t){return s.p(t)+"s"},l=function(t){return t<0},$=function(t){return l(t)?Math.ceil(t):Math.floor(t)},y=function(t){return Math.abs(t)},g=function(t,s){return t?l(t)?{negative:!0,format:""+y(t)+s}:{negative:!1,format:""+t+s}:{negative:!1,format:""}},p=function(){function l(t,s,n){var i=this;if(this.$d={},this.$l=n,void 0===t&&(this.$ms=0,this.parseFromMilliseconds()),s)return f(t*d[m(s)],this);if("number"==typeof t)return this.$ms=t,this.parseFromMilliseconds(),this;if("object"==typeof t)return Object.keys(t).forEach((function(s){i.$d[m(s)]=t[s];})),this.calMilliseconds(),this;if("string"==typeof t){var e=t.match(a);if(e){var r=e.slice(2).map((function(t){return null!=t?Number(t):0}));return this.$d.years=r[0],this.$d.months=r[1],this.$d.weeks=r[2],this.$d.days=r[3],this.$d.hours=r[4],this.$d.minutes=r[5],this.$d.seconds=r[6],this.calMilliseconds(),this}}return this}var y=l.prototype;return y.calMilliseconds=function(){var t=this;this.$ms=Object.keys(this.$d).reduce((function(s,n){return s+(t.$d[n]||0)*d[n]}),0);},y.parseFromMilliseconds=function(){var t=this.$ms;this.$d.years=$(t/u),t%=u,this.$d.months=$(t/h),t%=h,this.$d.days=$(t/r),t%=r,this.$d.hours=$(t/e),t%=e,this.$d.minutes=$(t/i),t%=i,this.$d.seconds=$(t/n),t%=n,this.$d.milliseconds=t;},y.toISOString=function(){var t=g(this.$d.years,"Y"),s=g(this.$d.months,"M"),n=+this.$d.days||0;this.$d.weeks&&(n+=7*this.$d.weeks);var i=g(n,"D"),e=g(this.$d.hours,"H"),r=g(this.$d.minutes,"M"),o=this.$d.seconds||0;this.$d.milliseconds&&(o+=this.$d.milliseconds/1e3);var u=g(o,"S"),h=t.negative||s.negative||i.negative||e.negative||r.negative||u.negative,a=e.format||r.format||u.format?"T":"",d=(h?"-":"")+"P"+t.format+s.format+i.format+a+e.format+r.format+u.format;return "P"===d||"-P"===d?"P0D":d},y.toJSON=function(){return this.toISOString()},y.format=function(t){var n=t||"YYYY-MM-DDTHH:mm:ss",i={Y:this.$d.years,YY:s.s(this.$d.years,2,"0"),YYYY:s.s(this.$d.years,4,"0"),M:this.$d.months,MM:s.s(this.$d.months,2,"0"),D:this.$d.days,DD:s.s(this.$d.days,2,"0"),H:this.$d.hours,HH:s.s(this.$d.hours,2,"0"),m:this.$d.minutes,mm:s.s(this.$d.minutes,2,"0"),s:this.$d.seconds,ss:s.s(this.$d.seconds,2,"0"),SSS:s.s(this.$d.milliseconds,3,"0")};return n.replace(o,(function(t,s){return s||String(i[t])}))},y.as=function(t){return this.$ms/d[m(t)]},y.get=function(t){var s=this.$ms,n=m(t);return "milliseconds"===n?s%=1e3:s="weeks"===n?$(s/d[n]):this.$d[n],0===s?0:s},y.add=function(t,s,n){var i;return i=s?t*d[m(s)]:c(t)?t.$ms:f(t,this).$ms,f(this.$ms+i*(n?-1:1),this)},y.subtract=function(t,s){return this.add(t,s,!0)},y.locale=function(t){var s=this.clone();return s.$l=t,s},y.clone=function(){return f(this.$ms,this)},y.humanize=function(s){return t().add(this.$ms,"ms").locale(this.$l).fromNow(!s)},y.milliseconds=function(){return this.get("milliseconds")},y.asMilliseconds=function(){return this.as("milliseconds")},y.seconds=function(){return this.get("seconds")},y.asSeconds=function(){return this.as("seconds")},y.minutes=function(){return this.get("minutes")},y.asMinutes=function(){return this.as("minutes")},y.hours=function(){return this.get("hours")},y.asHours=function(){return this.as("hours")},y.days=function(){return this.get("days")},y.asDays=function(){return this.as("days")},y.weeks=function(){return this.get("weeks")},y.asWeeks=function(){return this.as("weeks")},y.months=function(){return this.get("months")},y.asMonths=function(){return this.as("months")},y.years=function(){return this.get("years")},y.asYears=function(){return this.as("years")},l}();return function(n,i,e){t=e,s=e().$utils(),e.duration=function(t,s){var n=e.locale();return f(t,{$l:n},s)},e.isDuration=c;var r=i.prototype.add,o=i.prototype.subtract;i.prototype.add=function(t,s){return c(t)&&(t=t.asMilliseconds()),r.bind(this)(t,s)},i.prototype.subtract=function(t,s){return c(t)&&(t=t.asMilliseconds()),o.bind(this)(t,s)};}}));
    });

    const database = [{
            "Timezone": "Africa/Abidjan",
            "Offset": "+00:00",
            "DST Offset": "+00:00"
        },
        {
            "Timezone": "Africa/Accra",
            "Offset": "+00:00",
            "DST Offset": "+00:00"
        },
        {
            "Timezone": "Africa/Algiers",
            "Offset": "+01:00",
            "DST Offset": "+01:00"
        },
        {
            "Timezone": "Africa/Bissau",
            "Offset": "+00:00",
            "DST Offset": "+00:00"
        },
        {
            "Timezone": "Africa/Cairo",
            "Offset": "+02:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Africa/Casablanca",
            "Offset": "+01:00",
            "DST Offset": "+01:00"
        },
        {
            "Timezone": "Africa/Ceuta",
            "Offset": "+01:00",
            "DST Offset": "+01:00"
        },
        {
            "Timezone": "Africa/El_Aaiun",
            "Offset": "+00:00",
            "DST Offset": "+01:00"
        },
        {
            "Timezone": "Africa/Johannesburg",
            "Offset": "+02:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Africa/Juba",
            "Offset": "+03:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Africa/Khartoum",
            "Offset": "+02:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Africa/Lagos",
            "Offset": "+01:00",
            "DST Offset": "+01:00"
        },
        {
            "Timezone": "Africa/Maputo",
            "Offset": "+02:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Africa/Monrovia",
            "Offset": "+00:00",
            "DST Offset": "+00:00"
        },
        {
            "Timezone": "Africa/Nairobi",
            "Offset": "+03:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Africa/Ndjamena",
            "Offset": "+01:00",
            "DST Offset": "+01:00"
        },
        {
            "Timezone": "Africa/Tripoli",
            "Offset": "+02:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Africa/Tunis",
            "Offset": "+01:00",
            "DST Offset": "+01:00"
        },
        {
            "Timezone": "Africa/Windhoek",
            "Offset": "+02:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "America/Adak",
            "Offset": "-10:00",
            "DST Offset": "-09:00"
        },
        {
            "Timezone": "America/Anchorage",
            "Offset": "-09:00",
            "DST Offset": "-08:00"
        },
        {
            "Timezone": "America/Araguaina",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Argentina/Buenos_Aires",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Argentina/Catamarca",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Argentina/Cordoba",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Argentina/Jujuy",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Argentina/La_Rioja",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Argentina/Mendoza",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Argentina/Rio_Gallegos",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Argentina/Salta",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Argentina/San_Juan",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Argentina/San_Luis",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Argentina/Tucuman",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Argentina/Ushuaia",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Asuncion",
            "Offset": "-04:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Atikokan",
            "Offset": "-05:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Bahia",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Bahia_Banderas",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Barbados",
            "Offset": "-04:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Belem",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Belize",
            "Offset": "-06:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "America/Blanc-Sablon",
            "Offset": "-04:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Boa_Vista",
            "Offset": "-04:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Bogota",
            "Offset": "-05:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Boise",
            "Offset": "-07:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "America/Cambridge_Bay",
            "Offset": "-07:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "America/Campo_Grande",
            "Offset": "-04:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Cancun",
            "Offset": "-05:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Caracas",
            "Offset": "-04:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Cayenne",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Chicago",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Chihuahua",
            "Offset": "-07:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "America/Costa_Rica",
            "Offset": "-06:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "America/Creston",
            "Offset": "-07:00",
            "DST Offset": "-07:00"
        },
        {
            "Timezone": "America/Cuiaba",
            "Offset": "-04:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Curacao",
            "Offset": "-04:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Danmarkshavn",
            "Offset": "+00:00",
            "DST Offset": "+00:00"
        },
        {
            "Timezone": "America/Dawson",
            "Offset": "-08:00",
            "DST Offset": "-07:00"
        },
        {
            "Timezone": "America/Dawson_Creek",
            "Offset": "-07:00",
            "DST Offset": "-07:00"
        },
        {
            "Timezone": "America/Denver",
            "Offset": "-07:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "America/Detroit",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Edmonton",
            "Offset": "-07:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "America/Eirunepe",
            "Offset": "-05:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/El_Salvador",
            "Offset": "-06:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "America/Fort_Nelson",
            "Offset": "-07:00",
            "DST Offset": "-07:00"
        },
        {
            "Timezone": "America/Fortaleza",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Glace_Bay",
            "Offset": "-04:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Godthab",
            "Offset": "-03:00",
            "DST Offset": "-02:00"
        },
        {
            "Timezone": "America/Goose_Bay",
            "Offset": "-04:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Grand_Turk",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Guatemala",
            "Offset": "-06:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "America/Guayaquil",
            "Offset": "-05:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Guyana",
            "Offset": "-04:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Halifax",
            "Offset": "-04:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Havana",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Hermosillo",
            "Offset": "-07:00",
            "DST Offset": "-07:00"
        },
        {
            "Timezone": "America/Indiana/Indianapolis",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Indiana/Knox",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Indiana/Marengo",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Indiana/Petersburg",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Indiana/Tell_City",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Indiana/Vevay",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Indiana/Vincennes",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Indiana/Winamac",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Inuvik",
            "Offset": "-07:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "America/Iqaluit",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Jamaica",
            "Offset": "-05:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Juneau",
            "Offset": "-09:00",
            "DST Offset": "-08:00"
        },
        {
            "Timezone": "America/Kentucky/Louisville",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Kentucky/Monticello",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/La_Paz",
            "Offset": "-04:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Lima",
            "Offset": "-05:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Los_Angeles",
            "Offset": "-08:00",
            "DST Offset": "-07:00"
        },
        {
            "Timezone": "America/Maceio",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Managua",
            "Offset": "-06:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "America/Manaus",
            "Offset": "-04:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Martinique",
            "Offset": "-04:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Matamoros",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Mazatlan",
            "Offset": "-07:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "America/Menominee",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Merida",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Metlakatla",
            "Offset": "-09:00",
            "DST Offset": "-08:00"
        },
        {
            "Timezone": "America/Mexico_City",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Miquelon",
            "Offset": "-03:00",
            "DST Offset": "-02:00"
        },
        {
            "Timezone": "America/Moncton",
            "Offset": "-04:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Monterrey",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Montevideo",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Nassau",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/New_York",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Nipigon",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Nome",
            "Offset": "-09:00",
            "DST Offset": "-08:00"
        },
        {
            "Timezone": "America/Noronha",
            "Offset": "-02:00",
            "DST Offset": "-02:00"
        },
        {
            "Timezone": "America/North_Dakota/Beulah",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/North_Dakota/Center",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/North_Dakota/New_Salem",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Ojinaga",
            "Offset": "-07:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "America/Panama",
            "Offset": "-05:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Pangnirtung",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Paramaribo",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Phoenix",
            "Offset": "-07:00",
            "DST Offset": "-07:00"
        },
        {
            "Timezone": "America/Port_of_Spain",
            "Offset": "-04:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Port-au-Prince",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Porto_Velho",
            "Offset": "-04:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Puerto_Rico",
            "Offset": "-04:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Punta_Arenas",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Rainy_River",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Rankin_Inlet",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Recife",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Regina",
            "Offset": "-06:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "America/Resolute",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Rio_Branco",
            "Offset": "-05:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Santarem",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Santiago",
            "Offset": "-04:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Santo_Domingo",
            "Offset": "-04:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Sao_Paulo",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Scoresbysund",
            "Offset": "-01:00",
            "DST Offset": "+00:00"
        },
        {
            "Timezone": "America/Sitka",
            "Offset": "-09:00",
            "DST Offset": "-08:00"
        },
        {
            "Timezone": "America/St_Johns",
            "Offset": "-03:30",
            "DST Offset": "-02:30"
        },
        {
            "Timezone": "America/Swift_Current",
            "Offset": "-06:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "America/Tegucigalpa",
            "Offset": "-06:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "America/Thule",
            "Offset": "-04:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "America/Thunder_Bay",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Tijuana",
            "Offset": "-08:00",
            "DST Offset": "-07:00"
        },
        {
            "Timezone": "America/Toronto",
            "Offset": "-05:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "America/Vancouver",
            "Offset": "-08:00",
            "DST Offset": "-07:00"
        },
        {
            "Timezone": "America/Whitehorse",
            "Offset": "-08:00",
            "DST Offset": "-07:00"
        },
        {
            "Timezone": "America/Winnipeg",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "America/Yakutat",
            "Offset": "-09:00",
            "DST Offset": "-08:00"
        },
        {
            "Timezone": "America/Yellowknife",
            "Offset": "-07:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "Antarctica/Casey",
            "Offset": "+11:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Antarctica/Davis",
            "Offset": "+07:00",
            "DST Offset": "+07:00"
        },
        {
            "Timezone": "Antarctica/DumontDUrville",
            "Offset": "+10:00",
            "DST Offset": "+10:00"
        },
        {
            "Timezone": "Antarctica/Macquarie",
            "Offset": "+11:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Antarctica/Mawson",
            "Offset": "+05:00",
            "DST Offset": "+05:00"
        },
        {
            "Timezone": "Antarctica/Palmer",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "Antarctica/Rothera",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "Antarctica/Syowa",
            "Offset": "+03:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Antarctica/Troll",
            "Offset": "+00:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Antarctica/Vostok",
            "Offset": "+06:00",
            "DST Offset": "+06:00"
        },
        {
            "Timezone": "Asia/Almaty",
            "Offset": "+06:00",
            "DST Offset": "+06:00"
        },
        {
            "Timezone": "Asia/Amman",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Asia/Anadyr",
            "Offset": "+12:00",
            "DST Offset": "+12:00"
        },
        {
            "Timezone": "Asia/Aqtau",
            "Offset": "+05:00",
            "DST Offset": "+05:00"
        },
        {
            "Timezone": "Asia/Aqtobe",
            "Offset": "+05:00",
            "DST Offset": "+05:00"
        },
        {
            "Timezone": "Asia/Ashgabat",
            "Offset": "+05:00",
            "DST Offset": "+05:00"
        },
        {
            "Timezone": "Asia/Atyrau",
            "Offset": "+05:00",
            "DST Offset": "+05:00"
        },
        {
            "Timezone": "Asia/Baghdad",
            "Offset": "+03:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Asia/Baku",
            "Offset": "+04:00",
            "DST Offset": "+04:00"
        },
        {
            "Timezone": "Asia/Bangkok",
            "Offset": "+07:00",
            "DST Offset": "+07:00"
        },
        {
            "Timezone": "Asia/Barnaul",
            "Offset": "+07:00",
            "DST Offset": "+07:00"
        },
        {
            "Timezone": "Asia/Beirut",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Asia/Bishkek",
            "Offset": "+06:00",
            "DST Offset": "+06:00"
        },
        {
            "Timezone": "Asia/Brunei",
            "Offset": "+08:00",
            "DST Offset": "+08:00"
        },
        {
            "Timezone": "Asia/Chita",
            "Offset": "+09:00",
            "DST Offset": "+09:00"
        },
        {
            "Timezone": "Asia/Choibalsan",
            "Offset": "+08:00",
            "DST Offset": "+08:00"
        },
        {
            "Timezone": "Asia/Colombo",
            "Offset": "+05:30",
            "DST Offset": "+05:30"
        },
        {
            "Timezone": "Asia/Damascus",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Asia/Dhaka",
            "Offset": "+06:00",
            "DST Offset": "+06:00"
        },
        {
            "Timezone": "Asia/Dili",
            "Offset": "+09:00",
            "DST Offset": "+09:00"
        },
        {
            "Timezone": "Asia/Dubai",
            "Offset": "+04:00",
            "DST Offset": "+04:00"
        },
        {
            "Timezone": "Asia/Dushanbe",
            "Offset": "+05:00",
            "DST Offset": "+05:00"
        },
        {
            "Timezone": "Asia/Famagusta",
            "Offset": "+02:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Asia/Gaza",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Asia/Hebron",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Asia/Ho_Chi_Minh",
            "Offset": "+07:00",
            "DST Offset": "+07:00"
        },
        {
            "Timezone": "Asia/Hong_Kong",
            "Offset": "+08:00",
            "DST Offset": "+08:00"
        },
        {
            "Timezone": "Asia/Hovd",
            "Offset": "+07:00",
            "DST Offset": "+07:00"
        },
        {
            "Timezone": "Asia/Irkutsk",
            "Offset": "+08:00",
            "DST Offset": "+08:00"
        },
        {
            "Timezone": "Asia/Jakarta",
            "Offset": "+07:00",
            "DST Offset": "+07:00"
        },
        {
            "Timezone": "Asia/Jayapura",
            "Offset": "+09:00",
            "DST Offset": "+09:00"
        },
        {
            "Timezone": "Asia/Jerusalem",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Asia/Kabul",
            "Offset": "+04:30",
            "DST Offset": "+04:30"
        },
        {
            "Timezone": "Asia/Kamchatka",
            "Offset": "+12:00",
            "DST Offset": "+12:00"
        },
        {
            "Timezone": "Asia/Karachi",
            "Offset": "+05:00",
            "DST Offset": "+05:00"
        },
        {
            "Timezone": "Asia/Kathmandu",
            "Offset": "+05:45",
            "DST Offset": "+05:45"
        },
        {
            "Timezone": "Asia/Khandyga",
            "Offset": "+09:00",
            "DST Offset": "+09:00"
        },
        {
            "Timezone": "Asia/Kolkata",
            "Offset": "+05:30",
            "DST Offset": "+05:30"
        },
        {
            "Timezone": "Asia/Krasnoyarsk",
            "Offset": "+07:00",
            "DST Offset": "+07:00"
        },
        {
            "Timezone": "Asia/Kuala_Lumpur",
            "Offset": "+08:00",
            "DST Offset": "+08:00"
        },
        {
            "Timezone": "Asia/Kuching",
            "Offset": "+08:00",
            "DST Offset": "+08:00"
        },
        {
            "Timezone": "Asia/Macau",
            "Offset": "+08:00",
            "DST Offset": "+08:00"
        },
        {
            "Timezone": "Asia/Magadan",
            "Offset": "+11:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Asia/Makassar",
            "Offset": "+08:00",
            "DST Offset": "+08:00"
        },
        {
            "Timezone": "Asia/Manila",
            "Offset": "+08:00",
            "DST Offset": "+08:00"
        },
        {
            "Timezone": "Asia/Novokuznetsk",
            "Offset": "+07:00",
            "DST Offset": "+07:00"
        },
        {
            "Timezone": "Asia/Novosibirsk",
            "Offset": "+07:00",
            "DST Offset": "+07:00"
        },
        {
            "Timezone": "Asia/Omsk",
            "Offset": "+06:00",
            "DST Offset": "+06:00"
        },
        {
            "Timezone": "Asia/Oral",
            "Offset": "+05:00",
            "DST Offset": "+05:00"
        },
        {
            "Timezone": "Asia/Pontianak",
            "Offset": "+07:00",
            "DST Offset": "+07:00"
        },
        {
            "Timezone": "Asia/Pyongyang",
            "Offset": "+09:00",
            "DST Offset": "+09:00"
        },
        {
            "Timezone": "Asia/Qatar",
            "Offset": "+03:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Asia/Qyzylorda",
            "Offset": "+05:00",
            "DST Offset": "+05:00"
        },
        {
            "Timezone": "Asia/Riyadh",
            "Offset": "+03:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Asia/Sakhalin",
            "Offset": "+11:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Asia/Samarkand",
            "Offset": "+05:00",
            "DST Offset": "+05:00"
        },
        {
            "Timezone": "Asia/Seoul",
            "Offset": "+09:00",
            "DST Offset": "+09:00"
        },
        {
            "Timezone": "Asia/Shanghai",
            "Offset": "+08:00",
            "DST Offset": "+08:00"
        },
        {
            "Timezone": "Asia/Singapore",
            "Offset": "+08:00",
            "DST Offset": "+08:00"
        },
        {
            "Timezone": "Asia/Srednekolymsk",
            "Offset": "+11:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Asia/Taipei",
            "Offset": "+08:00",
            "DST Offset": "+08:00"
        },
        {
            "Timezone": "Asia/Tashkent",
            "Offset": "+05:00",
            "DST Offset": "+05:00"
        },
        {
            "Timezone": "Asia/Tbilisi",
            "Offset": "+04:00",
            "DST Offset": "+04:00"
        },
        {
            "Timezone": "Asia/Tehran",
            "Offset": "+03:30",
            "DST Offset": "+04:30"
        },
        {
            "Timezone": "Asia/Thimphu",
            "Offset": "+06:00",
            "DST Offset": "+06:00"
        },
        {
            "Timezone": "Asia/Tokyo",
            "Offset": "+09:00",
            "DST Offset": "+09:00"
        },
        {
            "Timezone": "Asia/Tomsk",
            "Offset": "+07:00",
            "DST Offset": "+07:00"
        },
        {
            "Timezone": "Asia/Ulaanbaatar",
            "Offset": "+08:00",
            "DST Offset": "+08:00"
        },
        {
            "Timezone": "Asia/Urumqi",
            "Offset": "+06:00",
            "DST Offset": "+06:00"
        },
        {
            "Timezone": "Asia/Ust-Nera",
            "Offset": "+10:00",
            "DST Offset": "+10:00"
        },
        {
            "Timezone": "Asia/Vladivostok",
            "Offset": "+10:00",
            "DST Offset": "+10:00"
        },
        {
            "Timezone": "Asia/Yakutsk",
            "Offset": "+09:00",
            "DST Offset": "+09:00"
        },
        {
            "Timezone": "Asia/Yangon",
            "Offset": "+06:30",
            "DST Offset": "+06:30"
        },
        {
            "Timezone": "Asia/Yekaterinburg",
            "Offset": "+05:00",
            "DST Offset": "+05:00"
        },
        {
            "Timezone": "Asia/Yerevan",
            "Offset": "+04:00",
            "DST Offset": "+04:00"
        },
        {
            "Timezone": "Atlantic/Azores",
            "Offset": "-01:00",
            "DST Offset": "+00:00"
        },
        {
            "Timezone": "Atlantic/Bermuda",
            "Offset": "-04:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "Atlantic/Canary",
            "Offset": "+00:00",
            "DST Offset": "+01:00"
        },
        {
            "Timezone": "Atlantic/Cape_Verde",
            "Offset": "-01:00",
            "DST Offset": "-01:00"
        },
        {
            "Timezone": "Atlantic/Faroe",
            "Offset": "+00:00",
            "DST Offset": "+01:00"
        },
        {
            "Timezone": "Atlantic/Madeira",
            "Offset": "+00:00",
            "DST Offset": "+01:00"
        },
        {
            "Timezone": "Atlantic/Reykjavik",
            "Offset": "+00:00",
            "DST Offset": "+00:00"
        },
        {
            "Timezone": "Atlantic/South_Georgia",
            "Offset": "-02:00",
            "DST Offset": "-02:00"
        },
        {
            "Timezone": "Atlantic/Stanley",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "Australia/Adelaide",
            "Offset": "+09:30",
            "DST Offset": "+10:30"
        },
        {
            "Timezone": "Australia/Brisbane",
            "Offset": "+10:00",
            "DST Offset": "+10:00"
        },
        {
            "Timezone": "Australia/Broken_Hill",
            "Offset": "+09:30",
            "DST Offset": "+10:30"
        },
        {
            "Timezone": "Australia/Currie",
            "Offset": "+10:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Australia/Darwin",
            "Offset": "+09:30",
            "DST Offset": "+09:30"
        },
        {
            "Timezone": "Australia/Eucla",
            "Offset": "+08:45",
            "DST Offset": "+08:45"
        },
        {
            "Timezone": "Australia/Hobart",
            "Offset": "+10:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Australia/Lindeman",
            "Offset": "+10:00",
            "DST Offset": "+10:00"
        },
        {
            "Timezone": "Australia/Lord_Howe",
            "Offset": "+10:30",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Australia/Melbourne",
            "Offset": "+10:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Australia/Perth",
            "Offset": "+08:00",
            "DST Offset": "+08:00"
        },
        {
            "Timezone": "Australia/Sydney",
            "Offset": "+10:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Etc/GMT",
            "Offset": "+00:00",
            "DST Offset": "+00:00"
        },
        {
            "Timezone": "Etc/GMT+1",
            "Offset": "-01:00",
            "DST Offset": "-01:00"
        },
        {
            "Timezone": "Etc/GMT+10",
            "Offset": "-10:00",
            "DST Offset": "-10:00"
        },
        {
            "Timezone": "Etc/GMT+11",
            "Offset": "-11:00",
            "DST Offset": "-11:00"
        },
        {
            "Timezone": "Etc/GMT+12",
            "Offset": "-12:00",
            "DST Offset": "-12:00"
        },
        {
            "Timezone": "Etc/GMT+2",
            "Offset": "-02:00",
            "DST Offset": "-02:00"
        },
        {
            "Timezone": "Etc/GMT+3",
            "Offset": "-03:00",
            "DST Offset": "-03:00"
        },
        {
            "Timezone": "Etc/GMT+4",
            "Offset": "-04:00",
            "DST Offset": "-04:00"
        },
        {
            "Timezone": "Etc/GMT+5",
            "Offset": "-05:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "Etc/GMT+6",
            "Offset": "-06:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "Etc/GMT+7",
            "Offset": "-07:00",
            "DST Offset": "-07:00"
        },
        {
            "Timezone": "Etc/GMT+8",
            "Offset": "-08:00",
            "DST Offset": "-08:00"
        },
        {
            "Timezone": "Etc/GMT+9",
            "Offset": "-09:00",
            "DST Offset": "-09:00"
        },
        {
            "Timezone": "Etc/GMT-1",
            "Offset": "+01:00",
            "DST Offset": "+01:00"
        },
        {
            "Timezone": "Etc/GMT-10",
            "Offset": "+10:00",
            "DST Offset": "+10:00"
        },
        {
            "Timezone": "Etc/GMT-11",
            "Offset": "+11:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Etc/GMT-12",
            "Offset": "+12:00",
            "DST Offset": "+12:00"
        },
        {
            "Timezone": "Etc/GMT-13",
            "Offset": "+13:00",
            "DST Offset": "+13:00"
        },
        {
            "Timezone": "Etc/GMT-14",
            "Offset": "+14:00",
            "DST Offset": "+14:00"
        },
        {
            "Timezone": "Etc/GMT-2",
            "Offset": "+02:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Etc/GMT-3",
            "Offset": "+03:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Etc/GMT-4",
            "Offset": "+04:00",
            "DST Offset": "+04:00"
        },
        {
            "Timezone": "Etc/GMT-5",
            "Offset": "+05:00",
            "DST Offset": "+05:00"
        },
        {
            "Timezone": "Etc/GMT-6",
            "Offset": "+06:00",
            "DST Offset": "+06:00"
        },
        {
            "Timezone": "Etc/GMT-7",
            "Offset": "+07:00",
            "DST Offset": "+07:00"
        },
        {
            "Timezone": "Etc/GMT-8",
            "Offset": "+08:00",
            "DST Offset": "+08:00"
        },
        {
            "Timezone": "Etc/GMT-9",
            "Offset": "+09:00",
            "DST Offset": "+09:00"
        },
        {
            "Timezone": "Etc/UTC",
            "Offset": "+00:00",
            "DST Offset": "+00:00"
        },
        {
            "Timezone": "Europe/Amsterdam",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Andorra",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Astrakhan",
            "Offset": "+04:00",
            "DST Offset": "+04:00"
        },
        {
            "Timezone": "Europe/Athens",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Europe/Belgrade",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Berlin",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Brussels",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Bucharest",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Europe/Budapest",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Chisinau",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Europe/Copenhagen",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Dublin",
            "Offset": "+00:00",
            "DST Offset": "+01:00"
        },
        {
            "Timezone": "Europe/Gibraltar",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Helsinki",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Europe/Istanbul",
            "Offset": "+03:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Europe/Kaliningrad",
            "Offset": "+02:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Kiev",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Europe/Kirov",
            "Offset": "+03:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Europe/Lisbon",
            "Offset": "+00:00",
            "DST Offset": "+01:00"
        },
        {
            "Timezone": "Europe/London",
            "Offset": "+00:00",
            "DST Offset": "+01:00"
        },
        {
            "Timezone": "Europe/Luxembourg",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Madrid",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Malta",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Minsk",
            "Offset": "+03:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Europe/Monaco",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Moscow",
            "Offset": "+03:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Asia/Nicosia",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Europe/Oslo",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Paris",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Prague",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Riga",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Europe/Rome",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Samara",
            "Offset": "+04:00",
            "DST Offset": "+04:00"
        },
        {
            "Timezone": "Europe/Saratov",
            "Offset": "+04:00",
            "DST Offset": "+04:00"
        },
        {
            "Timezone": "Europe/Simferopol",
            "Offset": "+03:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Europe/Sofia",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Europe/Stockholm",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Tallinn",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Europe/Tirane",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Ulyanovsk",
            "Offset": "+04:00",
            "DST Offset": "+04:00"
        },
        {
            "Timezone": "Europe/Uzhgorod",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Europe/Vienna",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Vilnius",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Europe/Volgograd",
            "Offset": "+04:00",
            "DST Offset": "+04:00"
        },
        {
            "Timezone": "Europe/Warsaw",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Europe/Zaporozhye",
            "Offset": "+02:00",
            "DST Offset": "+03:00"
        },
        {
            "Timezone": "Europe/Zurich",
            "Offset": "+01:00",
            "DST Offset": "+02:00"
        },
        {
            "Timezone": "Indian/Chagos",
            "Offset": "+06:00",
            "DST Offset": "+06:00"
        },
        {
            "Timezone": "Indian/Christmas",
            "Offset": "+07:00",
            "DST Offset": "+07:00"
        },
        {
            "Timezone": "Indian/Cocos",
            "Offset": "+06:30",
            "DST Offset": "+06:30"
        },
        {
            "Timezone": "Indian/Kerguelen",
            "Offset": "+05:00",
            "DST Offset": "+05:00"
        },
        {
            "Timezone": "Indian/Mahe",
            "Offset": "+04:00",
            "DST Offset": "+04:00"
        },
        {
            "Timezone": "Indian/Maldives",
            "Offset": "+05:00",
            "DST Offset": "+05:00"
        },
        {
            "Timezone": "Indian/Mauritius",
            "Offset": "+04:00",
            "DST Offset": "+04:00"
        },
        {
            "Timezone": "Indian/Reunion",
            "Offset": "+04:00",
            "DST Offset": "+04:00"
        },
        {
            "Timezone": "Pacific/Apia",
            "Offset": "+13:00",
            "DST Offset": "+14:00"
        },
        {
            "Timezone": "Pacific/Auckland",
            "Offset": "+12:00",
            "DST Offset": "+13:00"
        },
        {
            "Timezone": "Pacific/Bougainville",
            "Offset": "+11:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Pacific/Chatham",
            "Offset": "+12:45",
            "DST Offset": "+13:45"
        },
        {
            "Timezone": "Pacific/Chuuk",
            "Offset": "+10:00",
            "DST Offset": "+10:00"
        },
        {
            "Timezone": "Pacific/Easter",
            "Offset": "-06:00",
            "DST Offset": "-05:00"
        },
        {
            "Timezone": "Pacific/Efate",
            "Offset": "+11:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Pacific/Enderbury",
            "Offset": "+13:00",
            "DST Offset": "+13:00"
        },
        {
            "Timezone": "Pacific/Fakaofo",
            "Offset": "+13:00",
            "DST Offset": "+13:00"
        },
        {
            "Timezone": "Pacific/Fiji",
            "Offset": "+12:00",
            "DST Offset": "+13:00"
        },
        {
            "Timezone": "Pacific/Funafuti",
            "Offset": "+12:00",
            "DST Offset": "+12:00"
        },
        {
            "Timezone": "Pacific/Galapagos",
            "Offset": "-06:00",
            "DST Offset": "-06:00"
        },
        {
            "Timezone": "Pacific/Gambier",
            "Offset": "-09:00",
            "DST Offset": "-09:00"
        },
        {
            "Timezone": "Pacific/Guadalcanal",
            "Offset": "+11:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Pacific/Guam",
            "Offset": "+10:00",
            "DST Offset": "+10:00"
        },
        {
            "Timezone": "Pacific/Honolulu",
            "Offset": "-10:00",
            "DST Offset": "-10:00"
        },
        {
            "Timezone": "Pacific/Kiritimati",
            "Offset": "+14:00",
            "DST Offset": "+14:00"
        },
        {
            "Timezone": "Pacific/Kosrae",
            "Offset": "+11:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Pacific/Kwajalein",
            "Offset": "+12:00",
            "DST Offset": "+12:00"
        },
        {
            "Timezone": "Pacific/Majuro",
            "Offset": "+12:00",
            "DST Offset": "+12:00"
        },
        {
            "Timezone": "Pacific/Marquesas",
            "Offset": "-09:30",
            "DST Offset": "-09:30"
        },
        {
            "Timezone": "Pacific/Nauru",
            "Offset": "+12:00",
            "DST Offset": "+12:00"
        },
        {
            "Timezone": "Pacific/Niue",
            "Offset": "-11:00",
            "DST Offset": "-11:00"
        },
        {
            "Timezone": "Pacific/Norfolk",
            "Offset": "+11:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Pacific/Noumea",
            "Offset": "+11:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Pacific/Pago_Pago",
            "Offset": "-11:00",
            "DST Offset": "-11:00"
        },
        {
            "Timezone": "Pacific/Palau",
            "Offset": "+09:00",
            "DST Offset": "+09:00"
        },
        {
            "Timezone": "Pacific/Pitcairn",
            "Offset": "-08:00",
            "DST Offset": "-08:00"
        },
        {
            "Timezone": "Pacific/Pohnpei",
            "Offset": "+11:00",
            "DST Offset": "+11:00"
        },
        {
            "Timezone": "Pacific/Port_Moresby",
            "Offset": "+10:00",
            "DST Offset": "+10:00"
        },
        {
            "Timezone": "Pacific/Rarotonga",
            "Offset": "-10:00",
            "DST Offset": "-10:00"
        },
        {
            "Timezone": "Pacific/Tahiti",
            "Offset": "-10:00",
            "DST Offset": "-10:00"
        },
        {
            "Timezone": "Pacific/Tarawa",
            "Offset": "+12:00",
            "DST Offset": "+12:00"
        },
        {
            "Timezone": "Pacific/Tongatapu",
            "Offset": "+13:00",
            "DST Offset": "+14:00"
        },
        {
            "Timezone": "Pacific/Wake",
            "Offset": "+12:00",
            "DST Offset": "+12:00"
        },
        {
            "Timezone": "Pacific/Wallis",
            "Offset": "+12:00",
            "DST Offset": "+12:00"
        }
    ];

    /* node_modules\svelte-countdown\src\Countdown.svelte generated by Svelte v3.43.0 */

    const { console: console_1$1 } = globals;
    const get_default_slot_changes = dirty => ({ remaining: dirty & /*remaining*/ 1 });
    const get_default_slot_context = ctx => ({ remaining: /*remaining*/ ctx[0] });

    function create_fragment$4(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, remaining*/ 17)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function UTCdiff(date, tz) {
    	let isMinus = tz['Offset'].charAt(0) == '-';

    	let st = tz['Offset'].split(':').map(function (item) {
    		return parseInt(item);
    	});

    	if (tz['Offset'] == tz['DST Offset']) {
    		// no DST
    		if (st[0] === 0 && st[1] === 0) return 0; // no diff

    		return parseInt((isMinus ? '-' : '') + st[0] * 60 + st[1]); // return UTC diff in minutes
    	} else {
    		// calc DST
    		let dst = tz['DST Offset'].split(':').map(function (item) {
    			return parseInt(item);
    		});

    		let isDST = false;
    		let tmpDate;

    		if (tz['Timezone'].indexOf('Europe') === 0) {
    			switch (true) {
    				case date.month() > 2 && date.month() < 9:
    					isDST = true;
    					break;
    				case date.month() == 2:
    					tmpDate = date.endOf('month');
    					while (tmpDate.day() != 0) {
    						tmpDate = tmpDate.subtrack(1, 'day');
    					}
    					if (date.date() == tmpDate.date()) {
    						if (date.hour() > st[0] + 1) isDST = true;
    					} else {
    						if (date.date() > tmpDate.date()) isDST = true;
    					}
    					break;
    				case date.month() == 9:
    					tmpDate = date.endOf('month');
    					while (tmpDate.day() != 0) {
    						tmpDate = tmpDate.subtrack(1, 'day');
    					}
    					if (date.date() == tmpDate.date()) {
    						if (date.hour() < st[0] + 1) isDST = true;
    					} else {
    						if (date.date() < tmpDate.date()) isDST = true;
    					}
    					break;
    			}
    		} else {
    			switch (tz['Timezone']) {
    				case 'America/Havana':
    					switch (true) {
    						case date.month() > 2 && date.month() < 9:
    							isDST = true;
    							break;
    						case date.month() == 2:
    							tmpDate = date.startOf('month');
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.add(1, 'day');
    							}
    							tmpDate.add(14, 'day');
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() > 2) isDST = true;
    							} else {
    								if (date.date() > tmpDate.date()) isDST = true;
    							}
    							break;
    						case date.month() == 9:
    							tmpDate = date.endOf('month');
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.subtrack(1, 'day');
    							}
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() < 2) isDST = true;
    							} else {
    								if (date.date() < tmpDate.date()) isDST = true;
    							}
    							break;
    					}
    					break;
    				case 'America/Mexico_City':
    					switch (true) {
    						case date.month() > 3 && date.month() < 9:
    							isDST = true;
    							break;
    						case date.month() == 3:
    							tmpDate = date.startOf('month');
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.add(1, 'day');
    							}
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() > 2) isDST = true;
    							} else {
    								if (date.date() > tmpDate.date()) isDST = true;
    							}
    							break;
    						case date.month() == 9:
    							tmpDate = date.endOf('month');
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.subtrack(1, 'day');
    							}
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() < 2) isDST = true;
    							} else {
    								if (date.date() < tmpDate.date()) isDST = true;
    							}
    							break;
    					}
    					break;
    				case 'America/Campo_Grande':
    				case 'America/Cuiaba':
    					switch (true) {
    						case date.month() > 9 || date.month() < 1:
    							isDST = true;
    							break;
    						case date.month() == 9:
    							tmpDate = date.startOf('month');
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.add(1, 'day');
    							}
    							tmpDate.add(14, 'day');
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() > 2) isDST = true;
    							} else {
    								if (date.date() > tmpDate.date()) isDST = true;
    							}
    							break;
    						case date.month() == 1:
    							tmpDate = date.startOf('month');
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.add(1, 'day');
    							}
    							tmpDate.add(14, 'day');
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() < 2) isDST = true;
    							} else {
    								if (date.date() < tmpDate.date()) isDST = true;
    							}
    							break;
    					}
    					break;
    				case 'America/Santiago':
    				case 'Pacific/Easter':
    					switch (true) {
    						case date.month() > 9 || date.month() < 2:
    							isDST = true;
    							break;
    						case date.month() == 9:
    							if (date.date() == 11) {
    								if (date.hour() > 2) isDST = true;
    							} else {
    								if (date.date() > 11) isDST = true;
    							}
    							break;
    						case date.month() == 2:
    							if (date.date() == 29) {
    								if (date.hour() < 2) isDST = true;
    							} else {
    								if (date.date() < 29) isDST = true;
    							}
    							break;
    					}
    					break;
    				case 'America/Asuncion':
    					switch (true) {
    						case date.month() > 9 || date.month() < 2:
    							isDST = true;
    							break;
    						case date.month() == 9:
    							tmpDate = date.startOf('month');
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.add(1, 'day');
    							}
    							tmpDate.add(14, 'day');
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() > 2) isDST = true;
    							} else {
    								if (date.date() > tmpDate.date()) isDST = true;
    							}
    							break;
    						case date.month() == 2:
    							tmpDate = date.startOf('month');
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.add(1, 'day');
    							}
    							tmpDate.add(7, 'day');
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() < 2) isDST = true;
    							} else {
    								if (date.date() < tmpDate.date()) isDST = true;
    							}
    							break;
    					}
    					break;
    				case 'Africa/Cairo':
    					switch (true) {
    						case date.month() > 3 && date.month() < 8:
    							isDST = true;
    							break;
    						case date.month() == 3:
    							tmpDate = date.endOf('month');
    							while (tmpDate.day() != 5) {
    								tmpDate = tmpDate.subtrack(1, 'day');
    							}
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() > 2) isDST = true;
    							} else {
    								if (date.date() > tmpDate.date()) isDST = true;
    							}
    							break;
    						case date.month() == 8:
    							tmpDate = date.endOf('month');
    							while (tmpDate.day() != 4) {
    								tmpDate = tmpDate.subtrack(1, 'day');
    							}
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() < 2) isDST = true;
    							} else {
    								if (date.date() < tmpDate.date()) isDST = true;
    							}
    							break;
    					}
    					break;
    				case 'Asia/Jerusalem':
    					switch (true) {
    						case date.month() > 2 && date.month() < 9:
    							isDST = true;
    							break;
    						case date.month() == 2:
    							tmpDate = date.endOf('month');
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.subtrack(1, 'day');
    							}
    							tmpDate.subtrack(2, 'day');
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() > 2) isDST = true;
    							} else {
    								if (date.date() > tmpDate.date()) isDST = true;
    							}
    							break;
    						case date.month() == 9:
    							tmpDate = date.endOf('month');
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.subtrack(1, 'day');
    							}
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() < 2) isDST = true;
    							} else {
    								if (date.date() < tmpDate.date()) isDST = true;
    							}
    							break;
    					}
    					break;
    				case 'Asia/Amman':
    					switch (true) {
    						case date.month() > 2 && date.month() < 8:
    							isDST = true;
    							break;
    						case date.month() == 2:
    							tmpDate = date.endOf('month');
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.subtrack(1, 'day');
    							}
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() > 2) isDST = true;
    							} else {
    								if (date.date() > tmpDate.date()) isDST = true;
    							}
    							break;
    						case date.month() == 8:
    							tmpDate = date.endOf('month');
    							while (tmpDate.day() != 5) {
    								tmpDate = tmpDate.subtrack(1, 'day');
    							}
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() < 2) isDST = true;
    							} else {
    								if (date.date() < tmpDate.date()) isDST = true;
    							}
    							break;
    					}
    					break;
    				case 'Asia/Beirut':
    					switch (true) {
    						case date.month() > 2 && date.month() < 9:
    							isDST = true;
    							break;
    						case date.month() == 2:
    							tmpDate = date.endOf('month');
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.subtrack(1, 'day');
    							}
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() > 2) isDST = true;
    							} else {
    								if (date.date() > tmpDate.date()) isDST = true;
    							}
    							break;
    						case date.month() == 9:
    							tmpDate = date.endOf('month');
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.subtrack(1, 'day');
    							}
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() < 2) isDST = true;
    							} else {
    								if (date.date() < tmpDate.date()) isDST = true;
    							}
    							break;
    					}
    					break;
    				case 'Asia/Damascus':
    					switch (true) {
    						case date.month() > 2 && date.month() < 8:
    							isDST = true;
    							break;
    						case date.month() == 2:
    							if (date.date() == 30) {
    								if (date.hour() > 2) isDST = true;
    							} else {
    								if (date.date() > 30) isDST = true;
    							}
    							break;
    						case date.month() == 8:
    							if (date.date() == 21) {
    								if (date.hour() < 2) isDST = true;
    							} else {
    								if (date.date() < 21) isDST = true;
    							}
    							break;
    					}
    					break;
    				case 'Australia/Tasmania':
    					switch (true) {
    						case date.month() > 9 || date.month() < 2:
    							isDST = true;
    							break;
    						case date.month() == 9:
    							tmpDate = date.startOf('month');
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.add(1, 'day');
    							}
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() > 2) isDST = true;
    							} else {
    								if (date.date() > tmpDate.date()) isDST = true;
    							}
    							break;
    						case date.month() == 2:
    							tmpDate = date.endOf('month');
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.subtrack(1, 'day');
    							}
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() < 2) isDST = true;
    							} else {
    								if (date.date() < tmpDate.date()) isDST = true;
    							}
    							break;
    					}
    					break;
    				case 'Pacific/Auckland':
    				case 'Pacific/Chatham':
    					switch (true) {
    						case date.month() > 8 || date.month() < 3:
    							isDST = true;
    							break;
    						case date.month() == 8:
    							tmpDate = date.endOf('month');
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.subtrack(1, 'day');
    							}
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() > 2) isDST = true;
    							} else {
    								if (date.date() > tmpDate.date()) isDST = true;
    							}
    							break;
    						case date.month() == 3:
    							tmpDate = date.startOf('month');
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.add(1, 'day');
    							}
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() < 2) isDST = true;
    							} else {
    								if (date.date() < tmpDate.date()) isDST = true;
    							}
    							break;
    					}
    					break;
    				case 'Pacific/Tongatapu':
    					switch (true) {
    						case date.month() > 10:
    							isDST = true;
    							break;
    						case date.month() == 10:
    							tmpDate = date.startOf('month');
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.add(1, 'day');
    							}
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() > 2) isDST = true;
    							} else {
    								if (date.date() > tmpDate.date()) isDST = true;
    							}
    							break;
    						case date.month() == 0:
    							tmpDate = date.endOf('month');
    							while (tmpDate.day() != 0) {
    								tmpDate = tmpDate.subtrack(1, 'day');
    							}
    							if (date.date() == tmpDate.date()) {
    								if (date.hour() < 2) isDST = true;
    							} else {
    								if (date.date() < tmpDate.date()) isDST = true;
    							}
    							break;
    					}
    					break;
    				default:
    					if (tz['Timezone'].indexOf('Australia') === 0) {
    						// Had to keep apart from Tasmania
    						switch (true) {
    							case date.month() > 9 || date.month() < 3:
    								isDST = true;
    								break;
    							case date.month() == 9:
    								tmpDate = date.startOf('month');
    								while (tmpDate.day() != 0) {
    									tmpDate = tmpDate.add(1, 'day');
    								}
    								if (date.date() == tmpDate.date()) {
    									if (date.hour() > 2) isDST = true;
    								} else {
    									if (date.date() > tmpDate.date()) isDST = true;
    								}
    								break;
    							case date.month() == 3:
    								tmpDate = date.startOf('month');
    								while (tmpDate.day() != 0) {
    									tmpDate = tmpDate.add(1, 'day');
    								}
    								if (date.date() == tmpDate.date()) {
    									if (date.hour() < 2) isDST = true;
    								} else {
    									if (date.date() < tmpDate.date()) isDST = true;
    								}
    								break;
    						}
    					} else {
    						// USA / Canada & rest of the world... (sorry)
    						switch (true) {
    							case date.month() > 2 && date.month() < 10:
    								isDST = true;
    								break;
    							case date.month() == 2:
    								tmpDate = date.startOf('month');
    								while (tmpDate.day() != 0) {
    									tmpDate = tmpDate.add(1, 'day');
    								}
    								tmpDate.add(7, 'day');
    								if (date.date() == tmpDate.date()) {
    									if (date.hour() > 2) isDST = true;
    								} else {
    									if (date.date() > tmpDate.date()) isDST = true;
    								}
    								break;
    							case date.month() == 10:
    								tmpDate = date.startOf('month');
    								while (tmpDate.day() != 0) {
    									tmpDate = tmpDate.add(1, 'day');
    								}
    								if (date.date() == tmpDate.date()) {
    									if (date.hour() < 2) isDST = true;
    								} else {
    									if (date.date() < tmpDate.date()) isDST = true;
    								}
    								break;
    						}
    					}
    					break;
    			}
    		}

    		return isDST
    		? parseInt((isMinus ? '-' : '') + dst[0] * 60 + dst[1])
    		: parseInt((isMinus ? '-' : '') + st[0] * 60 + st[1]);

    		
    	}
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Countdown', slots, ['default']);
    	dayjs_min.extend(duration);
    	let { from, dateFormat, zone } = $$props;

    	let remaining = {
    		years: 0,
    		months: 0,
    		weeks: 0,
    		days: 0,
    		hours: 0,
    		minutes: 0,
    		seconds: 0,
    		done: false
    	};

    	let r = 0;
    	var timer;

    	onMount(() => {
    		if (!dateFormat) {
    			$$invalidate(1, dateFormat = "YYYY-MM-DD H:m:s");
    		}

    		let target = dayjs_min(from, dateFormat);
    		let local = dayjs_min();

    		if (zone) {
    			let remoteTZ = database.find(({ timezone }) => timezone === zone);
    			let localTZ = database.find(({ timezone }) => timezone === Intl.DateTimeFormat().resolvedOptions().timeZone);

    			if (remoteTZ && localTZ) {
    				// calc UTC + DST diff
    				let remoteDiff = UTCdiff(target, remoteTZ);

    				let localDiff = UTCdiff(local, localTZ);

    				target = remoteDiff > 0
    				? target.add(remoteDiff, 'minutes')
    				: target.subtrack(Math.abs(remoteDiff), 'minutes');

    				local = localDiff > 0
    				? local.add(localDiff, 'minutes')
    				: local.subtrack(Math.abs(localDiff), 'minutes');
    			} else {
    				if (!remoteTZ) console.warn('[svelte-countdown] Timezone not found in database. Please use a canonical timezone from https://en.wikipedia.org/wiki/List_of_tz_database_time_zones');
    				if (!localTZ) console.warn('[svelte-countdown] Intl API not supported by browser, cannot calculate timezone difference!');
    			}
    		} else {
    			console.warn('[svelte-countdown] Countdown might not be precice as a timezone was not defined.');
    		}

    		let diff = target.valueOf() - local.valueOf();

    		timer = setInterval(
    			function () {
    				if (diff > 0) {
    					let r = dayjs_min.duration(diff);

    					$$invalidate(0, remaining = {
    						years: r.years(),
    						months: r.months(),
    						weeks: r.weeks(),
    						days: r.days(),
    						hours: r.hours(),
    						minutes: r.minutes(),
    						seconds: r.seconds(),
    						done: false
    					});

    					diff -= 1000;
    				} else {
    					$$invalidate(0, remaining = {
    						years: 0,
    						months: 0,
    						weeks: 0,
    						days: 0,
    						hours: 0,
    						minutes: 0,
    						seconds: 0,
    						done: true
    					});

    					clearInterval(timer);
    				}
    			},
    			1000
    		);
    	});

    	const writable_props = ['from', 'dateFormat', 'zone'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Countdown> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('from' in $$props) $$invalidate(2, from = $$props.from);
    		if ('dateFormat' in $$props) $$invalidate(1, dateFormat = $$props.dateFormat);
    		if ('zone' in $$props) $$invalidate(3, zone = $$props.zone);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		dayjs: dayjs_min,
    		duration,
    		database,
    		from,
    		dateFormat,
    		zone,
    		remaining,
    		r,
    		timer,
    		UTCdiff
    	});

    	$$self.$inject_state = $$props => {
    		if ('from' in $$props) $$invalidate(2, from = $$props.from);
    		if ('dateFormat' in $$props) $$invalidate(1, dateFormat = $$props.dateFormat);
    		if ('zone' in $$props) $$invalidate(3, zone = $$props.zone);
    		if ('remaining' in $$props) $$invalidate(0, remaining = $$props.remaining);
    		if ('r' in $$props) r = $$props.r;
    		if ('timer' in $$props) timer = $$props.timer;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [remaining, dateFormat, from, zone, $$scope, slots];
    }

    class Countdown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { from: 2, dateFormat: 1, zone: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Countdown",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*from*/ ctx[2] === undefined && !('from' in props)) {
    			console_1$1.warn("<Countdown> was created without expected prop 'from'");
    		}

    		if (/*dateFormat*/ ctx[1] === undefined && !('dateFormat' in props)) {
    			console_1$1.warn("<Countdown> was created without expected prop 'dateFormat'");
    		}

    		if (/*zone*/ ctx[3] === undefined && !('zone' in props)) {
    			console_1$1.warn("<Countdown> was created without expected prop 'zone'");
    		}
    	}

    	get from() {
    		throw new Error("<Countdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set from(value) {
    		throw new Error("<Countdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dateFormat() {
    		throw new Error("<Countdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dateFormat(value) {
    		throw new Error("<Countdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zone() {
    		throw new Error("<Countdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zone(value) {
    		throw new Error("<Countdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Modal.svelte generated by Svelte v3.43.0 */
    const file$3 = "src\\components\\Modal.svelte";
    const get_footer_slot_changes = dirty => ({});
    const get_footer_slot_context = ctx => ({});

    // (28:26)           
    function fallback_block(ctx) {
    	let button0;
    	let t1;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button0 = element("button");
    			button0.textContent = "Close";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Show Result";
    			attr_dev(button0, "class", "svelte-18l0vtt");
    			add_location(button0, file$3, 28, 8, 704);
    			attr_dev(button1, "class", "outbtn svelte-18l0vtt");
    			add_location(button1, file$3, 29, 8, 758);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button1, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*closeModal*/ ctx[1], false, false, false),
    					listen_dev(button1, "click", /*click_handler*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(28:26)           ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div4;
    	let div3;
    	let h1;
    	let t1;
    	let div2;
    	let div0;
    	let h20;
    	let t3;
    	let h30;
    	let t5;
    	let div1;
    	let h21;
    	let t7;
    	let h31;
    	let t9;
    	let footer;
    	let p;
    	let b;
    	let t11;
    	let hr;
    	let t12;
    	let current;
    	let mounted;
    	let dispose;
    	const footer_slot_template = /*#slots*/ ctx[3].footer;
    	const footer_slot = create_slot(footer_slot_template, ctx, /*$$scope*/ ctx[2], get_footer_slot_context);
    	const footer_slot_or_fallback = footer_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			h1 = element("h1");
    			h1.textContent = "End Test";
    			t1 = space();
    			div2 = element("div");
    			div0 = element("div");
    			h20 = element("h2");
    			h20.textContent = "Attempted";
    			t3 = space();
    			h30 = element("h3");
    			h30.textContent = `${11 - unattlength}`;
    			t5 = space();
    			div1 = element("div");
    			h21 = element("h2");
    			h21.textContent = "Unattempted";
    			t7 = space();
    			h31 = element("h3");
    			h31.textContent = `${unattlength}`;
    			t9 = space();
    			footer = element("footer");
    			p = element("p");
    			b = element("b");
    			b.textContent = "Are You Sure To End The Test ?";
    			t11 = space();
    			hr = element("hr");
    			t12 = space();
    			if (footer_slot_or_fallback) footer_slot_or_fallback.c();
    			attr_dev(h1, "class", "svelte-18l0vtt");
    			add_location(h1, file$3, 13, 4, 317);
    			add_location(h20, file$3, 16, 8, 400);
    			add_location(h30, file$3, 17, 8, 428);
    			attr_dev(div0, "class", "attempt svelte-18l0vtt");
    			add_location(div0, file$3, 15, 6, 369);
    			add_location(h21, file$3, 20, 8, 508);
    			add_location(h31, file$3, 21, 8, 538);
    			attr_dev(div1, "class", "unattempt svelte-18l0vtt");
    			add_location(div1, file$3, 19, 6, 475);
    			attr_dev(div2, "class", "content svelte-18l0vtt");
    			add_location(div2, file$3, 14, 4, 340);
    			add_location(b, file$3, 25, 9, 611);
    			attr_dev(p, "class", "svelte-18l0vtt");
    			add_location(p, file$3, 25, 6, 608);
    			add_location(hr, file$3, 26, 6, 660);
    			attr_dev(footer, "class", "svelte-18l0vtt");
    			add_location(footer, file$3, 24, 4, 592);
    			attr_dev(div3, "class", "modal svelte-18l0vtt");
    			add_location(div3, file$3, 12, 2, 292);
    			attr_dev(div4, "class", "modal-backdrop svelte-18l0vtt");
    			add_location(div4, file$3, 11, 0, 238);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, h1);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h20);
    			append_dev(div0, t3);
    			append_dev(div0, h30);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			append_dev(div1, h21);
    			append_dev(div1, t7);
    			append_dev(div1, h31);
    			append_dev(div3, t9);
    			append_dev(div3, footer);
    			append_dev(footer, p);
    			append_dev(p, b);
    			append_dev(footer, t11);
    			append_dev(footer, hr);
    			append_dev(footer, t12);

    			if (footer_slot_or_fallback) {
    				footer_slot_or_fallback.m(footer, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div4, "click", /*closeModal*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (footer_slot) {
    				if (footer_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						footer_slot,
    						footer_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(footer_slot_template, /*$$scope*/ ctx[2], dirty, get_footer_slot_changes),
    						get_footer_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(footer_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(footer_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (footer_slot_or_fallback) footer_slot_or_fallback.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['footer']);
    	const dispatch = createEventDispatcher();

    	function closeModal() {
    		dispatch("cancel");
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => dispatch("openresult");

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		unattlength,
    		attlength,
    		dispatch,
    		closeModal
    	});

    	return [dispatch, closeModal, $$scope, slots, click_handler];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\components\Footer.svelte generated by Svelte v3.43.0 */
    const file$2 = "src\\components\\Footer.svelte";

    // (29:6) {#if remaining.done === false}
    function create_if_block_4$2(ctx) {
    	let span0;
    	let t0_value = /*remaining*/ ctx[19].minutes + "";
    	let t0;
    	let t1;
    	let t2;
    	let span1;
    	let t3_value = /*remaining*/ ctx[19].seconds + "";
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = text(" minutes");
    			t2 = space();
    			span1 = element("span");
    			t3 = text(t3_value);
    			t4 = text(" seconds");
    			add_location(span0, file$2, 29, 8, 703);
    			add_location(span1, file$2, 30, 8, 753);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span0, anchor);
    			append_dev(span0, t0);
    			append_dev(span0, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, span1, anchor);
    			append_dev(span1, t3);
    			append_dev(span1, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*remaining*/ 524288 && t0_value !== (t0_value = /*remaining*/ ctx[19].minutes + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*remaining*/ 524288 && t3_value !== (t3_value = /*remaining*/ ctx[19].seconds + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(span1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(29:6) {#if remaining.done === false}",
    		ctx
    	});

    	return block;
    }

    // (22:2) <Countdown      from="2022-09-30 30:00"      format=" H:m:s"      zone="Indian"      let:remaining    >
    function create_default_slot(ctx) {
    	let div;
    	let if_block = /*remaining*/ ctx[19].done === false && create_if_block_4$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "whatever");
    			add_location(div, file$2, 27, 4, 633);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, dirty) {
    			if (/*remaining*/ ctx[19].done === false) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_4$2(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(22:2) <Countdown      from=\\\"2022-09-30 30:00\\\"      format=\\\" H:m:s\\\"      zone=\\\"Indian\\\"      let:remaining    >",
    		ctx
    	});

    	return block;
    }

    // (39:2) {:else}
    function create_else_block_2$1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Previous";
    			button.disabled = true;
    			set_style(button, "background-color", "rgba(230, 221, 220,0.8)");
    			set_style(button, "cursor", "text");
    			set_style(button, "color", "black");
    			attr_dev(button, "class", "svelte-1pmt5co");
    			add_location(button, file$2, 39, 4, 1016);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2$1.name,
    		type: "else",
    		source: "(39:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (37:2) {#if currentQuestion >= 1}
    function create_if_block_3$2(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Previous";
    			attr_dev(button, "class", "svelte-1pmt5co");
    			add_location(button, file$2, 37, 4, 935);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(37:2) {#if currentQuestion >= 1}",
    		ctx
    	});

    	return block;
    }

    // (50:2) {:else}
    function create_else_block_1$1(ctx) {
    	let b;
    	let t1;
    	let modal;
    	let current;
    	modal = new Modal({ $$inline: true });
    	modal.$on("cancel", /*cancel_handler*/ ctx[9]);
    	modal.$on("openresult", /*openresult_handler*/ ctx[10]);

    	const block = {
    		c: function create() {
    			b = element("b");
    			b.textContent = "11/11";
    			t1 = space();
    			create_component(modal.$$.fragment);
    			add_location(b, file$2, 50, 4, 1325);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, b, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(b);
    			if (detaching) detach_dev(t1);
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(50:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (48:2) {#if currentQuestion >= 0 && currentQuestion <= 10}
    function create_if_block_2$2(ctx) {
    	let b;
    	let t0_value = /*currentQuestion*/ ctx[0] + 1 + "";
    	let t0;
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			b = element("b");
    			t0 = text(t0_value);
    			t1 = text("/");
    			t2 = text(/*total*/ ctx[3]);
    			add_location(b, file$2, 48, 4, 1271);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, b, anchor);
    			append_dev(b, t0);
    			append_dev(b, t1);
    			append_dev(b, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*currentQuestion*/ 1 && t0_value !== (t0_value = /*currentQuestion*/ ctx[0] + 1 + "")) set_data_dev(t0, t0_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(b);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(48:2) {#if currentQuestion >= 0 && currentQuestion <= 10}",
    		ctx
    	});

    	return block;
    }

    // (56:2) {:else}
    function create_else_block$2(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Next";
    			button.disabled = true;
    			set_style(button, "background-color", "rgba(230, 221, 220,0.8)");
    			set_style(button, "cursor", "text");
    			set_style(button, "color", "black");
    			attr_dev(button, "class", "svelte-1pmt5co");
    			add_location(button, file$2, 56, 4, 1520);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_4*/ ctx[12], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(56:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (54:2) {#if currentQuestion <= 9}
    function create_if_block_1$2(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Next";
    			attr_dev(button, "class", "svelte-1pmt5co");
    			add_location(button, file$2, 54, 4, 1443);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_3*/ ctx[11], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(54:2) {#if currentQuestion <= 9}",
    		ctx
    	});

    	return block;
    }

    // (65:2) {#if showmodal}
    function create_if_block$2(ctx) {
    	let modal;
    	let current;
    	modal = new Modal({ $$inline: true });
    	modal.$on("cancel", /*cancel_handler_1*/ ctx[14]);
    	modal.$on("openresult", /*openresult_handler_1*/ ctx[15]);

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(65:2) {#if showmodal}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let footer;
    	let countdown;
    	let t0;
    	let button0;
    	let t2;
    	let t3;
    	let current_block_type_index;
    	let if_block1;
    	let t4;
    	let t5;
    	let button1;
    	let t7;
    	let current;
    	let mounted;
    	let dispose;

    	countdown = new Countdown({
    			props: {
    				from: "2022-09-30 30:00",
    				format: " H:m:s",
    				zone: "Indian",
    				$$slots: {
    					default: [
    						create_default_slot,
    						({ remaining }) => ({ 19: remaining }),
    						({ remaining }) => remaining ? 524288 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function select_block_type(ctx, dirty) {
    		if (/*currentQuestion*/ ctx[0] >= 1) return create_if_block_3$2;
    		return create_else_block_2$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	const if_block_creators = [create_if_block_2$2, create_else_block_1$1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*currentQuestion*/ ctx[0] >= 0 && /*currentQuestion*/ ctx[0] <= 10) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	function select_block_type_2(ctx, dirty) {
    		if (/*currentQuestion*/ ctx[0] <= 9) return create_if_block_1$2;
    		return create_else_block$2;
    	}

    	let current_block_type_1 = select_block_type_2(ctx);
    	let if_block2 = current_block_type_1(ctx);
    	let if_block3 = /*showmodal*/ ctx[1] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			create_component(countdown.$$.fragment);
    			t0 = space();
    			button0 = element("button");
    			button0.textContent = "List";
    			t2 = space();
    			if_block0.c();
    			t3 = space();
    			if_block1.c();
    			t4 = space();
    			if_block2.c();
    			t5 = space();
    			button1 = element("button");
    			button1.textContent = "End Test";
    			t7 = space();
    			if (if_block3) if_block3.c();
    			attr_dev(button0, "class", "svelte-1pmt5co");
    			add_location(button0, file$2, 34, 2, 838);
    			attr_dev(button1, "class", "svelte-1pmt5co");
    			add_location(button1, file$2, 63, 2, 1713);
    			attr_dev(footer, "class", "svelte-1pmt5co");
    			add_location(footer, file$2, 20, 0, 512);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			mount_component(countdown, footer, null);
    			append_dev(footer, t0);
    			append_dev(footer, button0);
    			append_dev(footer, t2);
    			if_block0.m(footer, null);
    			append_dev(footer, t3);
    			if_blocks[current_block_type_index].m(footer, null);
    			append_dev(footer, t4);
    			if_block2.m(footer, null);
    			append_dev(footer, t5);
    			append_dev(footer, button1);
    			append_dev(footer, t7);
    			if (if_block3) if_block3.m(footer, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[6], false, false, false),
    					listen_dev(button1, "click", /*click_handler_5*/ ctx[13], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const countdown_changes = {};

    			if (dirty & /*$$scope, remaining*/ 1572864) {
    				countdown_changes.$$scope = { dirty, ctx };
    			}

    			countdown.$set(countdown_changes);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(footer, t3);
    				}
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(footer, t4);
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_2(ctx)) && if_block2) {
    				if_block2.p(ctx, dirty);
    			} else {
    				if_block2.d(1);
    				if_block2 = current_block_type_1(ctx);

    				if (if_block2) {
    					if_block2.c();
    					if_block2.m(footer, t5);
    				}
    			}

    			if (/*showmodal*/ ctx[1]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty & /*showmodal*/ 2) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block$2(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(footer, null);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(countdown.$$.fragment, local);
    			transition_in(if_block1);
    			transition_in(if_block3);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(countdown.$$.fragment, local);
    			transition_out(if_block1);
    			transition_out(if_block3);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    			destroy_component(countdown);
    			if_block0.d();
    			if_blocks[current_block_type_index].d();
    			if_block2.d();
    			if (if_block3) if_block3.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let minutes;
    	let seconds;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	let { currentQuestion } = $$props;
    	const dispatch = createEventDispatcher();
    	let date = new Date();
    	let showmodal = false;
    	let total = 11;

    	function showModal() {
    		$$invalidate(1, showmodal = true);
    	}

    	function closeModal() {
    		$$invalidate(1, showmodal = false);
    	}

    	const writable_props = ['currentQuestion'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => dispatch("showlist");
    	const click_handler_1 = () => dispatch("prevquest");
    	const click_handler_2 = () => dispatch("prevquest");
    	const cancel_handler = () => closeModal();

    	function openresult_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler_3 = () => dispatch("nextquest");
    	const click_handler_4 = () => dispatch("nextquest");
    	const click_handler_5 = () => showModal();
    	const cancel_handler_1 = () => closeModal();

    	function openresult_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('currentQuestion' in $$props) $$invalidate(0, currentQuestion = $$props.currentQuestion);
    	};

    	$$self.$capture_state = () => ({
    		currentQuestion,
    		Countdown,
    		createEventDispatcher,
    		dispatch,
    		Modal,
    		date,
    		showmodal,
    		total,
    		showModal,
    		closeModal,
    		seconds,
    		minutes
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentQuestion' in $$props) $$invalidate(0, currentQuestion = $$props.currentQuestion);
    		if ('date' in $$props) $$invalidate(18, date = $$props.date);
    		if ('showmodal' in $$props) $$invalidate(1, showmodal = $$props.showmodal);
    		if ('total' in $$props) $$invalidate(3, total = $$props.total);
    		if ('seconds' in $$props) seconds = $$props.seconds;
    		if ('minutes' in $$props) minutes = $$props.minutes;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	minutes = date.getMinutes();
    	seconds = date.getSeconds();

    	return [
    		currentQuestion,
    		showmodal,
    		dispatch,
    		total,
    		showModal,
    		closeModal,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		cancel_handler,
    		openresult_handler,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		cancel_handler_1,
    		openresult_handler_1
    	];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { currentQuestion: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*currentQuestion*/ ctx[0] === undefined && !('currentQuestion' in props)) {
    			console.warn("<Footer> was created without expected prop 'currentQuestion'");
    		}
    	}

    	get currentQuestion() {
    		throw new Error("<Footer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentQuestion(value) {
    		throw new Error("<Footer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    let correct = 0;

    new Array();
    let prevIndex$1 = null;
    function checkScore(event, index) {
      if (event === "1") {
        if (index === prevIndex$1) ; else {
          correct += 1;
        }
      }

      if (event !== "1") {
        if (index === prevIndex$1) {
          correct = correct - 1;
        } else {
          correct = correct;
        }
        if (index == prevIndex$1) {
          if (event == "0") {
            correct = correct + 1;
          }
        }
      }
      if (correct === -1) {
        correct = 0;
      }

      prevIndex$1 = index;
    }

    let indexes = new Array();
    let ans = new Array(0);
    let dupliindex = [0];
    let prevIndex = null;
    function ansStore(i, index) {
      if (i === prevIndex) {
        ans[i] = index;
      } else {
        ans.push(index);
        indexes.push(i);

        dupliindex = [...new Set(indexes)];
      }
      prevIndex = i;
    }

    let questData;
    questions.subscribe((items) => {
      questData = items;
    });
    let aj;
    let startIndex;
    function escaped(i) {
      aj = JSON.parse(questData[i].content_text).explanation;
      startIndex = aj.indexOf("<seq");
      while (startIndex > -1) {
        let str2 = aj.substr(startIndex, 14);
        let find = aj.charAt(startIndex + 9);
        aj = aj.replace(str2, find);
        startIndex = aj.indexOf("<seq");
      }

      return aj;
    }

    /* src\components\Result.svelte generated by Svelte v3.43.0 */
    const file$1 = "src\\components\\Result.svelte";

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i];
    	child_ctx[22] = i;
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[26] = list[i];
    	child_ctx[28] = i;
    	return child_ctx;
    }

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i];
    	child_ctx[22] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[26] = list[i];
    	child_ctx[28] = i;
    	return child_ctx;
    }

    // (130:0) {:else}
    function create_else_block$1(ctx) {
    	let div0;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t0;
    	let div1;
    	let p;
    	let t1_value = /*indexno1*/ ctx[3] + 1 + "";
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let button;
    	let a;
    	let each_value_3 = /*questData*/ ctx[2];
    	validate_each_argument(each_value_3);
    	const get_key = ctx => /*data*/ ctx[20];
    	validate_each_keys(ctx, each_value_3, get_each_context_3, get_key);

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		let child_ctx = get_each_context_3(ctx, each_value_3, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_3(key, child_ctx));
    	}

    	function select_block_type_1(ctx, dirty) {
    		if (/*indexno1*/ ctx[3] >= 1) return create_if_block_9;
    		return create_else_block_2;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block0 = current_block_type(ctx);

    	function select_block_type_2(ctx, dirty) {
    		if (/*indexno1*/ ctx[3] <= 9) return create_if_block_8;
    		return create_else_block_1;
    	}

    	let current_block_type_1 = select_block_type_2(ctx);
    	let if_block1 = current_block_type_1(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			div1 = element("div");
    			p = element("p");
    			t1 = text(t1_value);
    			t2 = text("/11");
    			t3 = space();
    			if_block0.c();
    			t4 = space();
    			if_block1.c();
    			t5 = space();
    			button = element("button");
    			a = element("a");
    			a.textContent = "Go to Dashboard";
    			attr_dev(div0, "class", "body svelte-1a53ypb");
    			add_location(div0, file$1, 130, 2, 7493);
    			attr_dev(p, "class", "svelte-1a53ypb");
    			add_location(p, file$1, 158, 4, 8264);
    			attr_dev(a, "href", "/");
    			set_style(a, "color", "white");
    			set_style(a, "text-decoration", "none");
    			add_location(a, file$1, 182, 7, 9005);
    			attr_dev(button, "class", "svelte-1a53ypb");
    			add_location(button, file$1, 181, 4, 8989);
    			attr_dev(div1, "class", "footer svelte-1a53ypb");
    			add_location(div1, file$1, 157, 2, 8238);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, p);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(div1, t3);
    			if_block0.m(div1, null);
    			append_dev(div1, t4);
    			if_block1.m(div1, null);
    			append_dev(div1, t5);
    			append_dev(div1, button);
    			append_dev(button, a);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*escapedExplanation, questData, indexno1, JSON*/ 2060) {
    				each_value_3 = /*questData*/ ctx[2];
    				validate_each_argument(each_value_3);
    				validate_each_keys(ctx, each_value_3, get_each_context_3, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_3, each_1_lookup, div0, destroy_block, create_each_block_3, null, get_each_context_3);
    			}

    			if (dirty & /*indexno1*/ 8 && t1_value !== (t1_value = /*indexno1*/ ctx[3] + 1 + "")) set_data_dev(t1, t1_value);

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div1, t4);
    				}
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_2(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div1, t5);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			if_block0.d();
    			if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(130:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (55:0) {#if !show}
    function create_if_block$1(ctx) {
    	let div5;
    	let div0;
    	let h20;
    	let t1;
    	let h40;
    	let t3;
    	let div1;
    	let h21;
    	let t5;
    	let h41;
    	let t7;
    	let div2;
    	let h22;
    	let t9;
    	let h42;
    	let t11;
    	let div3;
    	let h23;
    	let t13;
    	let h43;
    	let t15;
    	let div4;
    	let h24;
    	let t17;
    	let h44;
    	let t19;
    	let h25;
    	let t23;
    	let table;
    	let tr;
    	let th0;
    	let t25;
    	let th1;
    	let t27;
    	let th2;
    	let t29;
    	let hr;
    	let t30;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t31;
    	let div6;
    	let each_value = /*questData*/ ctx[2];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*data*/ ctx[20];
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div0 = element("div");
    			h20 = element("h2");
    			h20.textContent = "All Items";
    			t1 = space();
    			h40 = element("h4");
    			h40.textContent = `${/*total*/ ctx[5]}`;
    			t3 = space();
    			div1 = element("div");
    			h21 = element("h2");
    			h21.textContent = "Attempted";
    			t5 = space();
    			h41 = element("h4");
    			h41.textContent = `${/*total*/ ctx[5] - /*un*/ ctx[7]}`;
    			t7 = space();
    			div2 = element("div");
    			h22 = element("h2");
    			h22.textContent = "Unattempted";
    			t9 = space();
    			h42 = element("h4");
    			h42.textContent = `${/*un*/ ctx[7]}`;
    			t11 = space();
    			div3 = element("div");
    			h23 = element("h2");
    			h23.textContent = "Correct Answer";
    			t13 = space();
    			h43 = element("h4");
    			h43.textContent = `${correct}`;
    			t15 = space();
    			div4 = element("div");
    			h24 = element("h2");
    			h24.textContent = "Incorrect Answer";
    			t17 = space();
    			h44 = element("h4");
    			h44.textContent = `${/*incorrect*/ ctx[6]}`;
    			t19 = space();
    			h25 = element("h2");
    			h25.textContent = `Total Result ${correct * 8.5}%`;
    			t23 = space();
    			table = element("table");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Index No.";
    			t25 = space();
    			th1 = element("th");
    			th1.textContent = "Question";
    			t27 = space();
    			th2 = element("th");
    			th2.textContent = "Answers";
    			t29 = space();
    			hr = element("hr");
    			t30 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t31 = space();
    			div6 = element("div");
    			add_location(h20, file$1, 57, 6, 5385);
    			add_location(h40, file$1, 58, 6, 5411);
    			attr_dev(div0, "class", "incorrectAns svelte-1a53ypb");
    			add_location(div0, file$1, 56, 4, 5351);
    			add_location(h21, file$1, 61, 6, 5479);
    			add_location(h41, file$1, 62, 6, 5505);
    			attr_dev(div1, "class", "incorrectAns svelte-1a53ypb");
    			add_location(div1, file$1, 60, 4, 5445);
    			add_location(h22, file$1, 65, 6, 5576);
    			add_location(h42, file$1, 66, 6, 5604);
    			attr_dev(div2, "class", "incorrectAns svelte-1a53ypb");
    			add_location(div2, file$1, 64, 4, 5542);
    			add_location(h23, file$1, 69, 6, 5667);
    			add_location(h43, file$1, 70, 6, 5698);
    			attr_dev(div3, "class", "correctAns svelte-1a53ypb");
    			add_location(div3, file$1, 68, 4, 5635);
    			add_location(h24, file$1, 73, 6, 5768);
    			add_location(h44, file$1, 74, 6, 5801);
    			attr_dev(div4, "class", "incorrectAns svelte-1a53ypb");
    			add_location(div4, file$1, 72, 4, 5734);
    			attr_dev(div5, "class", "bodycorrect svelte-1a53ypb");
    			add_location(div5, file$1, 55, 2, 5320);
    			attr_dev(h25, "class", "total svelte-1a53ypb");
    			add_location(h25, file$1, 78, 2, 5849);
    			add_location(th0, file$1, 82, 6, 5943);
    			attr_dev(th1, "class", "questArea svelte-1a53ypb");
    			add_location(th1, file$1, 83, 6, 5969);
    			attr_dev(th2, "class", "ansArea svelte-1a53ypb");
    			add_location(th2, file$1, 84, 6, 6012);
    			add_location(hr, file$1, 85, 6, 6052);
    			attr_dev(tr, "class", "svelte-1a53ypb");
    			add_location(tr, file$1, 81, 4, 5931);
    			attr_dev(table, "border", "1");
    			attr_dev(table, "class", "svelte-1a53ypb");
    			add_location(table, file$1, 80, 2, 5907);
    			set_style(div6, "margin-top", "3rem");
    			set_style(div6, "height", "1rem");
    			add_location(div6, file$1, 128, 2, 7437);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div0);
    			append_dev(div0, h20);
    			append_dev(div0, t1);
    			append_dev(div0, h40);
    			append_dev(div5, t3);
    			append_dev(div5, div1);
    			append_dev(div1, h21);
    			append_dev(div1, t5);
    			append_dev(div1, h41);
    			append_dev(div5, t7);
    			append_dev(div5, div2);
    			append_dev(div2, h22);
    			append_dev(div2, t9);
    			append_dev(div2, h42);
    			append_dev(div5, t11);
    			append_dev(div5, div3);
    			append_dev(div3, h23);
    			append_dev(div3, t13);
    			append_dev(div3, h43);
    			append_dev(div5, t15);
    			append_dev(div5, div4);
    			append_dev(div4, h24);
    			append_dev(div4, t17);
    			append_dev(div4, h44);
    			insert_dev(target, t19, anchor);
    			insert_dev(target, h25, anchor);
    			insert_dev(target, t23, anchor);
    			insert_dev(target, table, anchor);
    			append_dev(table, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t25);
    			append_dev(tr, th1);
    			append_dev(tr, t27);
    			append_dev(tr, th2);
    			append_dev(tr, t29);
    			append_dev(tr, hr);
    			append_dev(table, t30);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}

    			insert_dev(target, t31, anchor);
    			insert_dev(target, div6, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dupli, JSON, questData, answ, showReview*/ 263) {
    				each_value = /*questData*/ ctx[2];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, table, destroy_block, create_each_block$1, null, get_each_context$1);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			if (detaching) detach_dev(t19);
    			if (detaching) detach_dev(h25);
    			if (detaching) detach_dev(t23);
    			if (detaching) detach_dev(table);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			if (detaching) detach_dev(t31);
    			if (detaching) detach_dev(div6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(55:0) {#if !show}",
    		ctx
    	});

    	return block;
    }

    // (133:6) {#if i === indexno1}
    function create_if_block_12(ctx) {
    	let a;
    	let h3;
    	let t1;
    	let t2_value = JSON.parse(/*data*/ ctx[20].content_text).question + "";
    	let t2;

    	const block = {
    		c: function create() {
    			a = element("a");
    			h3 = element("h3");
    			h3.textContent = "Question :";
    			t1 = space();
    			t2 = text(t2_value);
    			add_location(h3, file$1, 134, 11, 7654);
    			attr_dev(a, "href", "/");
    			set_style(a, "text-decoration", "none");
    			set_style(a, "color", "red");
    			add_location(a, file$1, 133, 8, 7590);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, h3);
    			append_dev(a, t1);
    			append_dev(a, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*questData*/ 4 && t2_value !== (t2_value = JSON.parse(/*data*/ ctx[20].content_text).question + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(133:6) {#if i === indexno1}",
    		ctx
    	});

    	return block;
    }

    // (139:8) {#if i === indexno1}
    function create_if_block_11(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let each_value_4 = JSON.parse(/*data*/ ctx[20].content_text).answers;
    	validate_each_argument(each_value_4);
    	const get_key = ctx => /*ansno*/ ctx[26];
    	validate_each_keys(ctx, each_value_4, get_each_context_4, get_key);

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		let child_ctx = get_each_context_4(ctx, each_value_4, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_4(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*JSON, questData*/ 4) {
    				each_value_4 = JSON.parse(/*data*/ ctx[20].content_text).answers;
    				validate_each_argument(each_value_4);
    				validate_each_keys(ctx, each_value_4, get_each_context_4, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_4, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block_4, each_1_anchor, get_each_context_4);
    			}
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(139:8) {#if i === indexno1}",
    		ctx
    	});

    	return block;
    }

    // (140:12) {#each JSON.parse(data.content_text).answers as ansno, index (ansno)}
    function create_each_block_4(key_1, ctx) {
    	let br;
    	let t0_value = /*index*/ ctx[28] + 1 + "";
    	let t0;
    	let t1;
    	let html_tag;
    	let raw_value = /*ansno*/ ctx[26].answer + "";
    	let html_anchor;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			br = element("br");
    			t0 = text(t0_value);
    			t1 = text(" . ");
    			html_tag = new HtmlTag();
    			html_anchor = empty();
    			add_location(br, file$1, 141, 20, 7901);
    			html_tag.a = html_anchor;
    			this.first = br;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, br, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*questData*/ 4 && t0_value !== (t0_value = /*index*/ ctx[28] + 1 + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*questData*/ 4 && raw_value !== (raw_value = /*ansno*/ ctx[26].answer + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(140:12) {#each JSON.parse(data.content_text).answers as ansno, index (ansno)}",
    		ctx
    	});

    	return block;
    }

    // (147:6) {#if i == indexno1}
    function create_if_block_10(ctx) {
    	let hr;
    	let t0;
    	let p;
    	let i;
    	let h3;
    	let t2;
    	let html_tag;
    	let raw_value = /*escapedExplanation*/ ctx[11](/*i*/ ctx[22]) + "";
    	let t3;

    	const block = {
    		c: function create() {
    			hr = element("hr");
    			t0 = space();
    			p = element("p");
    			i = element("i");
    			h3 = element("h3");
    			h3.textContent = "Explanation :";
    			t2 = space();
    			html_tag = new HtmlTag();
    			t3 = space();
    			add_location(hr, file$1, 147, 8, 8035);
    			add_location(h3, file$1, 150, 13, 8103);
    			html_tag.a = null;
    			add_location(i, file$1, 149, 10, 8086);
    			attr_dev(p, "class", "explanation svelte-1a53ypb");
    			add_location(p, file$1, 148, 8, 8051);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, hr, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, i);
    			append_dev(i, h3);
    			append_dev(i, t2);
    			html_tag.m(raw_value, i);
    			append_dev(p, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*questData*/ 4 && raw_value !== (raw_value = /*escapedExplanation*/ ctx[11](/*i*/ ctx[22]) + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(hr);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(147:6) {#if i == indexno1}",
    		ctx
    	});

    	return block;
    }

    // (132:4) {#each questData as data, i (data)}
    function create_each_block_3(key_1, ctx) {
    	let first;
    	let t0;
    	let t1;
    	let if_block2_anchor;
    	let if_block0 = /*i*/ ctx[22] === /*indexno1*/ ctx[3] && create_if_block_12(ctx);
    	let if_block1 = /*i*/ ctx[22] === /*indexno1*/ ctx[3] && create_if_block_11(ctx);
    	let if_block2 = /*i*/ ctx[22] == /*indexno1*/ ctx[3] && create_if_block_10(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*i*/ ctx[22] === /*indexno1*/ ctx[3]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_12(ctx);
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*i*/ ctx[22] === /*indexno1*/ ctx[3]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_11(ctx);
    					if_block1.c();
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*i*/ ctx[22] == /*indexno1*/ ctx[3]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_10(ctx);
    					if_block2.c();
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(132:4) {#each questData as data, i (data)}",
    		ctx
    	});

    	return block;
    }

    // (164:4) {:else}
    function create_else_block_2(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Previous";
    			button.disabled = true;
    			attr_dev(button, "style", "background-color: rgba(230, 221, 220,0.8) !important;cursor:text; color:black !important;margin-left :30rem");
    			attr_dev(button, "class", "svelte-1a53ypb");
    			add_location(button, file$1, 164, 6, 8440);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[14], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(164:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (160:4) {#if indexno1 >= 1}
    function create_if_block_9(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Previous";
    			attr_dev(button, "style", "margin-left :30rem");
    			attr_dev(button, "class", "svelte-1a53ypb");
    			add_location(button, file$1, 160, 6, 8321);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[13], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(160:4) {#if indexno1 >= 1}",
    		ctx
    	});

    	return block;
    }

    // (174:4) {:else}
    function create_else_block_1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Next";
    			button.disabled = true;
    			set_style(button, "background-color", "rgba(230, 221, 220,0.8)", 1);
    			set_style(button, "cursor", "text");
    			set_style(button, "color", "black", 1);
    			attr_dev(button, "class", "svelte-1a53ypb");
    			add_location(button, file$1, 174, 6, 8774);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_4*/ ctx[16], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(174:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (172:4) {#if indexno1 <= 9}
    function create_if_block_8(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Next";
    			attr_dev(button, "class", "svelte-1a53ypb");
    			add_location(button, file$1, 172, 6, 8708);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_3*/ ctx[15], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(172:4) {#if indexno1 <= 9}",
    		ctx
    	});

    	return block;
    }

    // (104:12) {#if i == ansindex}
    function create_if_block_1$1(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let each_value_2 = JSON.parse(/*data*/ ctx[20].content_text).answers;
    	validate_each_argument(each_value_2);
    	const get_key = ctx => /*ansno*/ ctx[26];
    	validate_each_keys(ctx, each_value_2, get_each_context_2$1, get_key);

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		let child_ctx = get_each_context_2$1(ctx, each_value_2, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_2$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*JSON, questData, answ, dupli*/ 7) {
    				each_value_2 = JSON.parse(/*data*/ ctx[20].content_text).answers;
    				validate_each_argument(each_value_2);
    				validate_each_keys(ctx, each_value_2, get_each_context_2$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_2, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block_2$1, each_1_anchor, get_each_context_2$1);
    			}
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(104:12) {#if i == ansindex}",
    		ctx
    	});

    	return block;
    }

    // (106:16) {#if ansno.is_correct === "1"}
    function create_if_block_5$1(ctx) {
    	let t;
    	let if_block1_anchor;
    	let if_block0 = /*answ*/ ctx[0][/*ansindex*/ ctx[23]] == /*index*/ ctx[28] && create_if_block_7$1(ctx);
    	let if_block1 = /*answ*/ ctx[0][/*ansindex*/ ctx[23]] != /*index*/ ctx[28] && create_if_block_6$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*answ*/ ctx[0][/*ansindex*/ ctx[23]] == /*index*/ ctx[28]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_7$1(ctx);
    					if_block0.c();
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*answ*/ ctx[0][/*ansindex*/ ctx[23]] != /*index*/ ctx[28]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_6$1(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(106:16) {#if ansno.is_correct === \\\"1\\\"}",
    		ctx
    	});

    	return block;
    }

    // (107:18) {#if answ[ansindex] == index}
    function create_if_block_7$1(ctx) {
    	let span;
    	let t_value = /*index*/ ctx[28] + 1 + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "activeans svelte-1a53ypb");
    			add_location(span, file$1, 107, 20, 6740);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*questData*/ 4 && t_value !== (t_value = /*index*/ ctx[28] + 1 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$1.name,
    		type: "if",
    		source: "(107:18) {#if answ[ansindex] == index}",
    		ctx
    	});

    	return block;
    }

    // (110:18) {#if answ[ansindex] != index}
    function create_if_block_6$1(ctx) {
    	let span;
    	let t_value = /*index*/ ctx[28] + 1 + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "disactiveans svelte-1a53ypb");
    			add_location(span, file$1, 110, 20, 6878);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*questData*/ 4 && t_value !== (t_value = /*index*/ ctx[28] + 1 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(110:18) {#if answ[ansindex] != index}",
    		ctx
    	});

    	return block;
    }

    // (114:16) {#if ansno.is_correct === "0"}
    function create_if_block_2$1(ctx) {
    	let t;
    	let if_block1_anchor;
    	let if_block0 = /*answ*/ ctx[0][/*ansindex*/ ctx[23]] == /*index*/ ctx[28] && create_if_block_4$1(ctx);
    	let if_block1 = /*answ*/ ctx[0][/*ansindex*/ ctx[23]] != /*index*/ ctx[28] && create_if_block_3$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*answ*/ ctx[0][/*ansindex*/ ctx[23]] == /*index*/ ctx[28]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_4$1(ctx);
    					if_block0.c();
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*answ*/ ctx[0][/*ansindex*/ ctx[23]] != /*index*/ ctx[28]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_3$1(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(114:16) {#if ansno.is_correct === \\\"0\\\"}",
    		ctx
    	});

    	return block;
    }

    // (115:18) {#if answ[ansindex] == index}
    function create_if_block_4$1(ctx) {
    	let span;
    	let t_value = /*index*/ ctx[28] + 1 + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "actives svelte-1a53ypb");
    			add_location(span, file$1, 115, 20, 7090);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*questData*/ 4 && t_value !== (t_value = /*index*/ ctx[28] + 1 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(115:18) {#if answ[ansindex] == index}",
    		ctx
    	});

    	return block;
    }

    // (118:18) {#if answ[ansindex] != index}
    function create_if_block_3$1(ctx) {
    	let span;
    	let t_value = /*index*/ ctx[28] + 1 + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "disactiveans svelte-1a53ypb");
    			add_location(span, file$1, 118, 20, 7226);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*questData*/ 4 && t_value !== (t_value = /*index*/ ctx[28] + 1 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(118:18) {#if answ[ansindex] != index}",
    		ctx
    	});

    	return block;
    }

    // (105:14) {#each JSON.parse(data.content_text).answers as ansno, index (ansno)}
    function create_each_block_2$1(key_1, ctx) {
    	let first;
    	let t;
    	let if_block1_anchor;
    	let if_block0 = /*ansno*/ ctx[26].is_correct === "1" && create_if_block_5$1(ctx);
    	let if_block1 = /*ansno*/ ctx[26].is_correct === "0" && create_if_block_2$1(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*ansno*/ ctx[26].is_correct === "1") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_5$1(ctx);
    					if_block0.c();
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*ansno*/ ctx[26].is_correct === "0") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_2$1(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(105:14) {#each JSON.parse(data.content_text).answers as ansno, index (ansno)}",
    		ctx
    	});

    	return block;
    }

    // (103:10) {#each dupli as ansindex}
    function create_each_block_1$1(ctx) {
    	let if_block_anchor;
    	let if_block = /*i*/ ctx[22] == /*ansindex*/ ctx[23] && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*i*/ ctx[22] == /*ansindex*/ ctx[23]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(103:10) {#each dupli as ansindex}",
    		ctx
    	});

    	return block;
    }

    // (89:4) {#each questData as data, i (data)}
    function create_each_block$1(key_1, ctx) {
    	let tr;
    	let td0;
    	let p;
    	let t0_value = /*i*/ ctx[22] + 1 + "";
    	let t0;
    	let t1;
    	let td1;
    	let a;
    	let t2_value = JSON.parse(/*data*/ ctx[20].content_text).question + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[12](/*i*/ ctx[22]);
    	}

    	let each_value_1 = /*dupli*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			a = element("a");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			attr_dev(p, "class", "svelte-1a53ypb");
    			add_location(p, file$1, 91, 10, 6150);
    			add_location(td0, file$1, 90, 8, 6134);
    			attr_dev(a, "href", "/");
    			set_style(a, "text-decoration", "none");
    			add_location(a, file$1, 94, 10, 6223);
    			attr_dev(td1, "class", "questArea svelte-1a53ypb");
    			add_location(td1, file$1, 93, 8, 6189);
    			attr_dev(td2, "class", "ansArea svelte-1a53ypb");
    			add_location(td2, file$1, 101, 8, 6446);
    			attr_dev(tr, "class", "svelte-1a53ypb");
    			add_location(tr, file$1, 89, 6, 6120);
    			this.first = tr;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, p);
    			append_dev(p, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, a);
    			append_dev(a, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(td2, null);
    			}

    			append_dev(tr, t4);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", prevent_default(click_handler), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*questData*/ 4 && t0_value !== (t0_value = /*i*/ ctx[22] + 1 + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*questData*/ 4 && t2_value !== (t2_value = JSON.parse(/*data*/ ctx[20].content_text).question + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*JSON, questData, answ, dupli*/ 7) {
    				each_value_1 = /*dupli*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(td2, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(89:4) {#each questData as data, i (data)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let header;
    	let img;
    	let img_src_value;
    	let t0;
    	let h1;
    	let t2;
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (!/*show*/ ctx[4]) return create_if_block$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			header = element("header");
    			img = element("img");
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "uCertify Result";
    			t2 = space();
    			if_block.c();
    			if_block_anchor = empty();
    			attr_dev(img, "class", "img-fluid svelte-1a53ypb");
    			if (!src_url_equal(img.src, img_src_value = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASkAAACqCAMAAADGFElyAAAAkFBMVEXAABD////DAA2RKy69AAC7AAC/AADAAA2/AAPOVVm/AAj99PXIOz/MTVL88fPdiIz76uz23N7Ta2/EHiTZe4DRZGfuwsX009bBEhvor7LQWF/glZj++vvxy87qtbf66+zmqq3zztLbg4f34ePFKy/gmZvJQ0fjoqbWdHfVaW7IMjnBEBfZf4LEJSrJRUnuw8Vra3TlAAALKUlEQVR4nO2ce2OivBLGZU8uGKhKVZSKlwpaq2v9/t/u5AoBguhWe8677/z+2kIIyUMymZnE7fUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4IdgpKMAoj/Sjv97WPiJr0nB8OT8d0lFfYIxIuze5/zQ26D2YYVOsTf/RyrFuByuhiO0Pyx2i9czurNCrpQX7bH7JsX9kffPVArlu+Q38euXfXyIPEnwu6XTbQilPG+BXYPRxztx83FKMYKwhJAnq09eUt7yjNa6hc4zz0uVVN60y0JXUUp57+emVCyfeQ9UiiKcTxdJfIlXH4cvJL6NzzV7SN2Nd5GBbHpcHTfoyC/v1Pdv3OxCK+W9NptMDt7jlKIYHZaBVxDtzpico+jwFKnIVE+xX3bb/fFa6MPQ6NFKvT5OKYK26iun2XI5UuM/OV08b3ivYb0JtFVNT09W2yl651eOfo/sZQMmfzT7nqwUflF2NJ7+4lYKjbdr2Q/vEUpRSfUaedEj164dTYSZEQMJ7WfBILnzzT+iFP6t2h0iZckZIomehYvvKkWJpNZG/K6MdkUp8Xl2csoRMp7fO+1/QiltQjeW+aZ48SCl8FJUs6rZHEr45WBrXyWfouBBv4/d3akfUEqL8lGNBXCir36v8h6+uJTinyLsnypfAa9EwZc/XkGerxRS69CyFjRRPHqmUrxn1RlJiZh8wqD/IU9Xys+lbxCM601Eby1dvI9WpertCMUCkjr8xhtxKqU96WkaCAi2uHvw4ljZo0ZXKJ79pFLKxUrHD1UKD7NIkI0kkUW2u1MqvV6np2YL0eFHlZJ+dPDnE8ShlPH2XawdPb4KVhFR4ugJpWtXFxnrXpesArcqJb2pxyp1TSh76aCMERXxUnPB1xfKQmSvnuu7hqJYjaohBY8N0fw8rmVMVMXIVMytAZFhY4/5vm+U8iXM2RBxByulTkSWo8KnstBvs650KkXxxxWhdmW/6Ol83L98ThbJhxoDdK4uDDdxqSfeyOcGztyBMB22UhTTyUWsiGkWf5JiiaenXFR84BVzwX0cJlEwSk6kR49hGJ6lPxWfQ8lRSDXOw6+318liE3+phog7+VAqFR5luTH132zUUCP94sJLM2FTVeq6ULPyS1MSmOxFINcTE08LCneSEhWMLp2Tg5LUVspHQxkbqorXBzNW8dD6UihXK4SX/fLnVsStGeEeO6bFn3IdYcdmT34jUvlbfVtcXsgaLa4ppceAm/RozT1SNHMwVkqlRQuLYI58mR66lOLTL9sUd9BJxIaD4T4/HjLx0EpLhbbFqxb4JShfcmoqxTvI8lHx57BNqQkhVmZjMAuZ6r15dNCMHapKaaHWm0SwepckmtWn/TQl50lgKcXn+Cn/qCmFVMDnteVWuD0y/yQid+StCCbMR8q1MGYakeNKV8x9sGyoxtgMnTar1SqR43CdrCQfSESV49fIUoqexc1ELi2pKrbi0xgzPVYHfWISmRj3Zey+QA5PtqIUkh+TTxblT3mpgLh9KcrwPrCU4muZr5UulNIhyw0xBOuJzxnrJjM1ayfYfBXtla0Cb4v0bMwIla169+SDGvU4RrNSqZ4qp7wEVHaF4r4aF/buAxYD0LkJU1Mq0krJr9zpoyshBqU35+c1paS59dKwM4aQUdlgbmpSa/q6cAd8PYPSF0z14qxtn3JD6lk5ElpKWTVWvQT9YV+tuSJetHHaim8phYY1pShNq0qpMRrkXV4Yeat2jCobtC2XhrUanKhIaOoZ7VZKl+9QihxtzVUxHs67/fgHK9WrKqXT2YPOGEK+OM396oWyD9SXPVdfW66RK/2ONqVGNyhlxrwVNvO4vSVr/FSlzAI5GHd4xkRajJnVRDWx1ya7q5XS0SM6hblxWFqU8m9SSg1la2kWnrLTSy6VmipLZ5TSFv1hSnWMKSR1SWqzgGMMXFUp/mdR4beU0uahdIy5uYxa9tQpVatEtBTEyq5ksfxLybZqz0reOvu67BQlmepXGUzohLLZk6spZff1W0qpHhQ2nc1T7pS2tJIRJZUkVUqNSi+38P9cdCql94u61j52lsWSw6TgkFhG4XlKsXFgz3u09Qbt8TlDpVSBVqp0X+Nr5zs6ldKJ/7apbzCufJNnK2U8PuXwUW6nryVhGYtalVpePRPUrZT2rSfX9xXM2tHk8GyldP5MmUjxx1WT6hMjVV2pJbpqYLpnnw4YOtJHZNKi56nnXPtsvqmUfj6QeTceCVyut7SQqman3q8LdYNF1zuUzci8glZqiGmdsufPUgq9eqYk63neW0fcReYXmfyd6bXvXf4V14+K1OlUijLlWnvHtgaovJDyR1oyDrLY05TShz3Et+RhUtZ5CIdhhz919bCefHuXUkWI3GYnaU+8REdprhSyKfc0pUyOd0pEBHTz5n/FR7+heKdSZvq1rL2kvx7ytmsvYfY/UUptb/EayMFL511hV1Hdo5UyOw52my342ij2lbTnGbS384lK6eAvzXlNt+8UPV4pM6iCs8P5FDelcdLexGdt7PtlLv2JSmkruTjy4OnmPbp7lfqtRLiilNkZdS2/lEddqZyWurG1/vrhEN/oJdRbfI9SOu8QJTzku6XXqjqjFHHReIleYffFl2CsoZSfq9jP0UuRSFNFzc7EvvJN+bSYmVi7Q6l6H+9RyhwxuevsmbYqUX/q4LXhvprMYuEU6KWusoLoExyim9UjFWLRMbs9SO3sRPbJXLwtHYcupYLainFjfkrBxqqBg1PXYl/iW/saTRqTkvpyvIy0BMxsqlYNI9ZHCbkXYO2CITGigtx8Re2frIpkPRVJn8g8oHvu8Lh0Mu6g7tBqeYdSrkVDW4jNPWe5yDm7IlVjAdNjKMZIJErGsbdUUy3E9lFwnUHh7t0U8xuMiV8ZTMWL9qU7oY7EeFEo6+IF+GoxKIQkJzmtZ7hhApDaDwre9I6Duk/m+tuWwmu3CTv8FZ3Qa3WP3VKdinDZQX1tMBsB0eTr5bBKvQvS514X/dCeR28mkMx2b2Geh9MPodP6y/qI5EuXuQz7+/3bjhcYHNV97haf9Lqw2pOaQ2wWVy9aJavleodk+bkpH8p9MoTxm4rQBpMzahzYodI+37qO3SRVIx9YGEPVLqxTd5xRxVaN46JQGujd57j6gwx0rL14pkcUy5ezolovm8WVjlK0tB/6QD12fC/LpxHXDg1nZd1BNGtYbtmNrpCvKZWd2qvTiEqsrXA+txiRIqRpsF5W3svwflmtadav/66CoO26vD/YFucv9tUng+oMZNanjYZ89tWyXUtUJH8Mu7pBEgm97P4fnTFxbruNz8bnyDfRaL3O4oPoGZke3r5yKo6m1MoRfB4ulRLp+n1xdJxZo4h8JqKydbY6kKLhdN6vUlOYoUmcZVkUL0K5ZNTK733umFUrONbNugj5tvfYc/Nq/6WNivlR+Ig3jxL9gy5hjVn9eLjpEaJHXsfXkT/iThdTgpF/mvPhZY8bWvPrmk8hJL6NqbRaXlxk1QoafeAL4+Dek2HOpl17iSzfODrfVrGvlLxa5tbKak/d/0z5MI87Ha4a0ID7va7jlUAdikbXsogAt5Yq+82d0it7VwDJk8tO/HqGhOmTfhL2d6Bibh4vUTTzomf/hvWfjN4PyoiIXW/P4P0LMSdaP3ZtqWtAYe1bf/tXTn83FF20UIvO3bp/OZQsMh5uX/oworqgGM3H5En/D8HfBgWHEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAP+EXcBu9/wC38V8D4dBSu9XtVwAAAABJRU5ErkJggg==")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Svelte logo");
    			add_location(img, file$1, 47, 2, 1078);
    			attr_dev(h1, "class", "svelte-1a53ypb");
    			add_location(h1, file$1, 52, 2, 5268);
    			attr_dev(header, "class", "svelte-1a53ypb");
    			add_location(header, file$1, 46, 0, 1066);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, img);
    			append_dev(header, t0);
    			append_dev(header, h1);
    			insert_dev(target, t2, anchor);
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if (detaching) detach_dev(t2);
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Result', slots, []);
    	const dispatch = createEventDispatcher();
    	let questData;
    	let total = 11;

    	const unsubscribe = questions.subscribe(items => {
    		$$invalidate(2, questData = items);
    	});

    	let { answ } = $$props;
    	let { dupli } = $$props;
    	dupli = dupliindex;
    	answ = ans;
    	let incorrect = count - correct;
    	let un = allUnattempt.length;
    	let indexno1 = null;
    	let show = false;

    	function showReview(indexno) {
    		$$invalidate(3, indexno1 = indexno);
    		$$invalidate(4, show = true);
    	}

    	function previous() {
    		if (indexno1 < 1) {
    			$$invalidate(3, indexno1 = 0);
    		} else {
    			$$invalidate(3, indexno1--, indexno1);
    		}
    	}

    	function next() {
    		if (indexno1 > 9) {
    			$$invalidate(3, indexno1 = 10);
    		} else {
    			$$invalidate(3, indexno1++, indexno1);
    		}
    	}

    	let ajl = null;

    	function escapedExplanation(i) {
    		ajl = escaped(i);
    		return ajl;
    	}

    	const writable_props = ['answ', 'dupli'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Result> was created with unknown prop '${key}'`);
    	});

    	const click_handler = i => showReview(i);
    	const click_handler_1 = () => previous();
    	const click_handler_2 = () => previous();
    	const click_handler_3 = () => next();
    	const click_handler_4 = () => next();

    	$$self.$$set = $$props => {
    		if ('answ' in $$props) $$invalidate(0, answ = $$props.answ);
    		if ('dupli' in $$props) $$invalidate(1, dupli = $$props.dupli);
    	};

    	$$self.$capture_state = () => ({
    		questions,
    		correct,
    		count,
    		allUnattempt,
    		createEventDispatcher,
    		dupliindex,
    		ans,
    		escaped,
    		dispatch,
    		questData,
    		total,
    		unsubscribe,
    		answ,
    		dupli,
    		incorrect,
    		un,
    		indexno1,
    		show,
    		showReview,
    		previous,
    		next,
    		ajl,
    		escapedExplanation
    	});

    	$$self.$inject_state = $$props => {
    		if ('questData' in $$props) $$invalidate(2, questData = $$props.questData);
    		if ('total' in $$props) $$invalidate(5, total = $$props.total);
    		if ('answ' in $$props) $$invalidate(0, answ = $$props.answ);
    		if ('dupli' in $$props) $$invalidate(1, dupli = $$props.dupli);
    		if ('incorrect' in $$props) $$invalidate(6, incorrect = $$props.incorrect);
    		if ('un' in $$props) $$invalidate(7, un = $$props.un);
    		if ('indexno1' in $$props) $$invalidate(3, indexno1 = $$props.indexno1);
    		if ('show' in $$props) $$invalidate(4, show = $$props.show);
    		if ('ajl' in $$props) ajl = $$props.ajl;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		answ,
    		dupli,
    		questData,
    		indexno1,
    		show,
    		total,
    		incorrect,
    		un,
    		showReview,
    		previous,
    		next,
    		escapedExplanation,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4
    	];
    }

    class Result extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { answ: 0, dupli: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Result",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*answ*/ ctx[0] === undefined && !('answ' in props)) {
    			console.warn("<Result> was created without expected prop 'answ'");
    		}

    		if (/*dupli*/ ctx[1] === undefined && !('dupli' in props)) {
    			console.warn("<Result> was created without expected prop 'dupli'");
    		}
    	}

    	get answ() {
    		throw new Error("<Result>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set answ(value) {
    		throw new Error("<Result>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dupli() {
    		throw new Error("<Result>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dupli(value) {
    		throw new Error("<Result>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.43.0 */

    const { console: console_1 } = globals;
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[28] = list[i];
    	child_ctx[30] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[28] = list[i];
    	child_ctx[30] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	child_ctx[34] = i;
    	return child_ctx;
    }

    // (110:0) {:else}
    function create_else_block(ctx) {
    	let header;
    	let t0;
    	let t1;
    	let t2;
    	let if_block2_anchor;
    	let current;
    	header = new Header({ $$inline: true });
    	let if_block0 = /*displayStartbtn*/ ctx[5] && create_if_block_7(ctx);
    	let if_block1 = /*displayQuiz*/ ctx[6] && create_if_block_5(ctx);
    	let if_block2 = !/*showlist*/ ctx[2] && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*displayStartbtn*/ ctx[5]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_7(ctx);
    					if_block0.c();
    					if_block0.m(t1.parentNode, t1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*displayQuiz*/ ctx[6]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*displayQuiz*/ 64) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_5(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t2.parentNode, t2);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!/*showlist*/ ctx[2]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*showlist*/ 4) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_1(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(110:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (108:0) {#if openresult}
    function create_if_block(ctx) {
    	let result;
    	let current;

    	result = new Result({
    			props: {
    				correct,
    				currentQuestion: /*currentQuestion*/ ctx[4]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(result.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(result, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const result_changes = {};
    			if (dirty[0] & /*currentQuestion*/ 16) result_changes.currentQuestion = /*currentQuestion*/ ctx[4];
    			result.$set(result_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(result.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(result.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(result, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(108:0) {#if openresult}",
    		ctx
    	});

    	return block;
    }

    // (112:2) {#if displayStartbtn}
    function create_if_block_7(ctx) {
    	let div;
    	let button;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			button.textContent = "Start";
    			t1 = text("\n    .");
    			attr_dev(button, "class", "startbtn svelte-1t6vf8z");
    			add_location(button, file, 113, 6, 3094);
    			attr_dev(div, "class", "startbutton svelte-1t6vf8z");
    			add_location(div, file, 112, 4, 3062);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			insert_dev(target, t1, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[15], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(112:2) {#if displayStartbtn}",
    		ctx
    	});

    	return block;
    }

    // (118:2) {#if displayQuiz}
    function create_if_block_5(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t;
    	let footer;
    	let current;
    	let each_value_1 = /*questData*/ ctx[0];
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*data*/ ctx[28];
    	validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
    	}

    	footer = new Footer({
    			props: {
    				currentQuestion: /*currentQuestion*/ ctx[4]
    			},
    			$$inline: true
    		});

    	footer.$on("showlist", /*showlist_handler*/ ctx[19]);
    	footer.$on("openresult", /*openresult_handler*/ ctx[20]);
    	footer.$on("nextquest", /*nextquest_handler*/ ctx[21]);
    	footer.$on("prevquest", /*prevquest_handler*/ ctx[22]);

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			create_component(footer.$$.fragment);
    			attr_dev(div, "id", "anschecker");
    			attr_dev(div, "class", "svelte-1t6vf8z");
    			add_location(div, file, 118, 4, 3214);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			insert_dev(target, t, anchor);
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*questData, markAttempted, AnsStore, checkAnswer, currentQuestion*/ 28689) {
    				each_value_1 = /*questData*/ ctx[0];
    				validate_each_argument(each_value_1);
    				validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, div, destroy_block, create_each_block_1, null, get_each_context_1);
    			}

    			const footer_changes = {};
    			if (dirty[0] & /*currentQuestion*/ 16) footer_changes.currentQuestion = /*currentQuestion*/ ctx[4];
    			footer.$set(footer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			if (detaching) detach_dev(t);
    			destroy_component(footer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(118:2) {#if displayQuiz}",
    		ctx
    	});

    	return block;
    }

    // (121:8) {#if currentQuestion == i}
    function create_if_block_6(ctx) {
    	let p;
    	let t0_value = JSON.parse(/*data*/ ctx[28].content_text).question + "";
    	let t0;
    	let t1;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let each_value_2 = JSON.parse(/*data*/ ctx[28].content_text).answers;
    	validate_each_argument(each_value_2);
    	const get_key = ctx => /*ans*/ ctx[32];
    	validate_each_keys(ctx, each_value_2, get_each_context_2, get_key);

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		let child_ctx = get_each_context_2(ctx, each_value_2, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			attr_dev(p, "class", "svelte-1t6vf8z");
    			add_location(p, file, 121, 10, 3323);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			insert_dev(target, t1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*questData*/ 1 && t0_value !== (t0_value = JSON.parse(/*data*/ ctx[28].content_text).question + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*questData, markAttempted, AnsStore, checkAnswer*/ 28673) {
    				each_value_2 = JSON.parse(/*data*/ ctx[28].content_text).answers;
    				validate_each_argument(each_value_2);
    				validate_each_keys(ctx, each_value_2, get_each_context_2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_2, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block_2, each_1_anchor, get_each_context_2);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(121:8) {#if currentQuestion == i}",
    		ctx
    	});

    	return block;
    }

    // (123:10) {#each JSON.parse(data.content_text).answers as ans, index (ans)}
    function create_each_block_2(key_1, ctx) {
    	let div;
    	let input;
    	let input_id_value;
    	let input_value_value;
    	let button;
    	let raw_value = /*ans*/ ctx[32].answer + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[16](/*i*/ ctx[30]);
    	}

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[17](/*i*/ ctx[30], /*index*/ ctx[34]);
    	}

    	function click_handler_3() {
    		return /*click_handler_3*/ ctx[18](/*ans*/ ctx[32], /*i*/ ctx[30]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			button = element("button");
    			t = space();
    			attr_dev(input, "type", "radio");
    			attr_dev(input, "name", "ans");
    			attr_dev(input, "id", input_id_value = "ans" + /*index*/ ctx[34]);
    			attr_dev(input, "class", "answerradio svelte-1t6vf8z");
    			set_style(input, "margin-left", "-70em");
    			set_style(input, "margin-top", "3rem");
    			input.value = input_value_value = /*ans*/ ctx[32].answer;
    			add_location(input, file, 124, 14, 3494);
    			attr_dev(button, "class", "answer svelte-1t6vf8z");
    			add_location(button, file, 134, 16, 3901);
    			attr_dev(div, "class", "ansblk svelte-1t6vf8z");
    			add_location(div, file, 123, 12, 3459);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			append_dev(div, button);
    			button.innerHTML = raw_value;
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "click", click_handler_1, false, false, false),
    					listen_dev(input, "click", click_handler_2, false, false, false),
    					listen_dev(input, "click", click_handler_3, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*questData*/ 1 && input_id_value !== (input_id_value = "ans" + /*index*/ ctx[34])) {
    				attr_dev(input, "id", input_id_value);
    			}

    			if (dirty[0] & /*questData*/ 1 && input_value_value !== (input_value_value = /*ans*/ ctx[32].answer)) {
    				prop_dev(input, "value", input_value_value);
    			}

    			if (dirty[0] & /*questData*/ 1 && raw_value !== (raw_value = /*ans*/ ctx[32].answer + "")) button.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(123:10) {#each JSON.parse(data.content_text).answers as ans, index (ans)}",
    		ctx
    	});

    	return block;
    }

    // (120:6) {#each questData as data, i (data)}
    function create_each_block_1(key_1, ctx) {
    	let first;
    	let if_block_anchor;
    	let if_block = /*currentQuestion*/ ctx[4] == /*i*/ ctx[30] && create_if_block_6(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*currentQuestion*/ ctx[4] == /*i*/ ctx[30]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_6(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(120:6) {#each questData as data, i (data)}",
    		ctx
    	});

    	return block;
    }

    // (150:2) {#if !showlist}
    function create_if_block_1(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*marked*/ ctx[3] && create_if_block_4(ctx);
    	let if_block1 = !/*marked*/ ctx[3] && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*marked*/ ctx[3]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*marked*/ 8) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_4(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!/*marked*/ ctx[3]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*marked*/ 8) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(150:2) {#if !showlist}",
    		ctx
    	});

    	return block;
    }

    // (151:4) {#if marked}
    function create_if_block_4(ctx) {
    	let sidepanel;
    	let current;
    	sidepanel = new SidePanel({ $$inline: true });
    	sidepanel.$on("currentquest", /*currentquest_handler*/ ctx[23]);

    	const block = {
    		c: function create() {
    			create_component(sidepanel.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sidepanel, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidepanel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidepanel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sidepanel, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(151:4) {#if marked}",
    		ctx
    	});

    	return block;
    }

    // (154:4) {#if !marked}
    function create_if_block_2(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = /*questData*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*data*/ ctx[28];
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentquestChange, currentQuestion, questData*/ 529) {
    				each_value = /*questData*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block, each_1_anchor, get_each_context);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(154:4) {#if !marked}",
    		ctx
    	});

    	return block;
    }

    // (156:8) {#if currentQuestion == i}
    function create_if_block_3(ctx) {
    	let sidepanel;
    	let current;
    	sidepanel = new SidePanel({ $$inline: true });
    	sidepanel.$on("currentquest", /*currentquest_handler_1*/ ctx[24]);

    	const block = {
    		c: function create() {
    			create_component(sidepanel.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sidepanel, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidepanel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidepanel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sidepanel, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(156:8) {#if currentQuestion == i}",
    		ctx
    	});

    	return block;
    }

    // (155:6) {#each questData as data, i (data)}
    function create_each_block(key_1, ctx) {
    	let first;
    	let if_block_anchor;
    	let current;
    	let if_block = /*currentQuestion*/ ctx[4] == /*i*/ ctx[30] && create_if_block_3(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*currentQuestion*/ ctx[4] == /*i*/ ctx[30]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*currentQuestion, questData*/ 17) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(155:6) {#each questData as data, i (data)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*openresult*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    async function getcheck() {
    	let myradio = await document.getElementsByClassName("answerradio");

    	for (let i = 0; i < myradio.length; i++) {
    		myradio[i].checked = false;
    	}
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let questData;

    	const unsubscribe = questions.subscribe(items => {
    		$$invalidate(0, questData = items);
    	});

    	let openresult = false;

    	function Openresult() {
    		$$invalidate(1, openresult = true);
    	}

    	let showlist = true;
    	let marked = false;
    	let currentQuestion = 0;
    	let index1 = 0;
    	let displayStartbtn = true;
    	let displayQuiz = false;

    	function DisplayQuiz() {
    		$$invalidate(6, displayQuiz = true);
    		$$invalidate(5, displayStartbtn = false);
    	}

    	function currentquestChange(event) {
    		$$invalidate(4, currentQuestion = event);
    		jump(currentQuestion);
    	}

    	async function jump(i) {
    		let myradio = await document.getElementsByClassName("answerradio");
    		await getcheck();

    		for (let j = 0; j < dupliindex.length; j++) {
    			if (i == dupliindex[j]) {
    				console.log(ans[i]);

    				for (let k = 0; k < myradio.length; k++) {
    					if (k == ans[i]) {
    						myradio[k].checked = true;
    						console.log(`${ans[i]}=>${myradio[k].checked}`);
    					} else {
    						console.log("No");
    					}
    				}
    			}
    		}
    	}

    	async function nextQuest(i) {
    		$$invalidate(4, currentQuestion += 1);
    		let myradio = await document.getElementsByClassName("answerradio");
    		await getcheck();

    		for (let j = 0; j < dupliindex.length; j++) {
    			if (i == dupliindex[j]) {
    				console.log(ans[i]);

    				for (let k = 0; k < myradio.length; k++) {
    					if (k == ans[i]) {
    						myradio[k].checked = true;
    						console.log(`${ans[i]}=>${myradio[k].checked}`);
    					} else {
    						console.log("No");
    					}
    				}
    			}
    		}
    	}

    	async function prevQuest(i) {
    		$$invalidate(4, currentQuestion -= 1);
    		let myradio = await document.getElementsByClassName("answerradio");

    		for (let j = 0; j < dupliindex.length; j++) {
    			if (i == dupliindex[j]) {
    				console.log(ans[i]);

    				for (let k = 0; k < myradio.length; k++) {
    					if (k == ans[i]) {
    						myradio[k].checked = true;
    						console.log(`${ans[i]}=>${myradio[k].checked}`);
    					} else {
    						console.log("No");
    					}
    				}
    			}
    		}
    	}

    	function AnsStore(i, index) {
    		ansStore(i, index);
    	}

    	function markAttempted(index) {
    		markAttempt(index);
    		index1 = index + 1;
    		$$invalidate(3, marked = true);
    	}

    	function checkAnswer(event, index) {
    		checkScore(event, index);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => DisplayQuiz();
    	const click_handler_1 = i => markAttempted(i);
    	const click_handler_2 = (i, index) => AnsStore(i, index);
    	const click_handler_3 = (ans, i) => checkAnswer(ans.is_correct, i);
    	const showlist_handler = () => $$invalidate(2, showlist = !showlist);
    	const openresult_handler = () => Openresult();
    	const nextquest_handler = () => nextQuest(currentQuestion + 1);
    	const prevquest_handler = () => prevQuest(currentQuestion - 1);
    	const currentquest_handler = no => currentquestChange(no.detail);
    	const currentquest_handler_1 = no => currentquestChange(no.detail);

    	$$self.$capture_state = () => ({
    		SidePanel,
    		Header,
    		Footer,
    		Result,
    		questions,
    		markAttempt,
    		ansStore,
    		dupliindex,
    		ans,
    		checkScore,
    		correct,
    		questData,
    		unsubscribe,
    		openresult,
    		Openresult,
    		showlist,
    		marked,
    		currentQuestion,
    		index1,
    		displayStartbtn,
    		displayQuiz,
    		DisplayQuiz,
    		currentquestChange,
    		jump,
    		nextQuest,
    		getcheck,
    		prevQuest,
    		AnsStore,
    		markAttempted,
    		checkAnswer
    	});

    	$$self.$inject_state = $$props => {
    		if ('questData' in $$props) $$invalidate(0, questData = $$props.questData);
    		if ('openresult' in $$props) $$invalidate(1, openresult = $$props.openresult);
    		if ('showlist' in $$props) $$invalidate(2, showlist = $$props.showlist);
    		if ('marked' in $$props) $$invalidate(3, marked = $$props.marked);
    		if ('currentQuestion' in $$props) $$invalidate(4, currentQuestion = $$props.currentQuestion);
    		if ('index1' in $$props) index1 = $$props.index1;
    		if ('displayStartbtn' in $$props) $$invalidate(5, displayStartbtn = $$props.displayStartbtn);
    		if ('displayQuiz' in $$props) $$invalidate(6, displayQuiz = $$props.displayQuiz);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		questData,
    		openresult,
    		showlist,
    		marked,
    		currentQuestion,
    		displayStartbtn,
    		displayQuiz,
    		Openresult,
    		DisplayQuiz,
    		currentquestChange,
    		nextQuest,
    		prevQuest,
    		AnsStore,
    		markAttempted,
    		checkAnswer,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		showlist_handler,
    		openresult_handler,
    		nextquest_handler,
    		prevquest_handler,
    		currentquest_handler,
    		currentquest_handler_1
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,

    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
