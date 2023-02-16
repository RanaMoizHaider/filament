;(() => {
    var __create = Object.create,
        __defProp = Object.defineProperty,
        __getProtoOf = Object.getPrototypeOf,
        __hasOwnProp = Object.prototype.hasOwnProperty,
        __getOwnPropNames = Object.getOwnPropertyNames,
        __getOwnPropDesc = Object.getOwnPropertyDescriptor
    var __markAsModule = (target) =>
        __defProp(target, '__esModule', { value: !0 })
    var __commonJS = (callback, module) => () => (
        module ||
            ((module = { exports: {} }), callback(module.exports, module)),
        module.exports
    )
    var __exportStar = (target, module, desc) => {
            if (
                (module && typeof module == 'object') ||
                typeof module == 'function'
            )
                for (let key of __getOwnPropNames(module))
                    !__hasOwnProp.call(target, key) &&
                        key !== 'default' &&
                        __defProp(target, key, {
                            get: () => module[key],
                            enumerable:
                                !(desc = __getOwnPropDesc(module, key)) ||
                                desc.enumerable,
                        })
            return target
        },
        __toModule = (module) =>
            __exportStar(
                __markAsModule(
                    __defProp(
                        module != null ? __create(__getProtoOf(module)) : {},
                        'default',
                        module && module.__esModule && 'default' in module
                            ? { get: () => module.default, enumerable: !0 }
                            : { value: module, enumerable: !0 },
                    ),
                ),
                module,
            )
    var require_rng_browser = __commonJS((exports, module) => {
        var rng,
            crypto =
                typeof global != 'undefined' &&
                (global.crypto || global.msCrypto)
        crypto &&
            crypto.getRandomValues &&
            ((rnds8 = new Uint8Array(16)),
            (rng = function () {
                return crypto.getRandomValues(rnds8), rnds8
            }))
        var rnds8
        rng ||
            ((rnds = new Array(16)),
            (rng = function () {
                for (var i = 0, r; i < 16; i++)
                    (i & 3) == 0 && (r = Math.random() * 4294967296),
                        (rnds[i] = (r >>> ((i & 3) << 3)) & 255)
                return rnds
            }))
        var rnds
        module.exports = rng
    })
    var require_bytesToUuid = __commonJS((exports, module) => {
        var byteToHex = []
        for (var i = 0; i < 256; ++i)
            byteToHex[i] = (i + 256).toString(16).substr(1)
        function bytesToUuid(buf, offset) {
            var i2 = offset || 0,
                bth = byteToHex
            return (
                bth[buf[i2++]] +
                bth[buf[i2++]] +
                bth[buf[i2++]] +
                bth[buf[i2++]] +
                '-' +
                bth[buf[i2++]] +
                bth[buf[i2++]] +
                '-' +
                bth[buf[i2++]] +
                bth[buf[i2++]] +
                '-' +
                bth[buf[i2++]] +
                bth[buf[i2++]] +
                '-' +
                bth[buf[i2++]] +
                bth[buf[i2++]] +
                bth[buf[i2++]] +
                bth[buf[i2++]] +
                bth[buf[i2++]] +
                bth[buf[i2++]]
            )
        }
        module.exports = bytesToUuid
    })
    var require_v1 = __commonJS((exports, module) => {
        var rng = require_rng_browser(),
            bytesToUuid = require_bytesToUuid(),
            _seedBytes = rng(),
            _nodeId = [
                _seedBytes[0] | 1,
                _seedBytes[1],
                _seedBytes[2],
                _seedBytes[3],
                _seedBytes[4],
                _seedBytes[5],
            ],
            _clockseq = ((_seedBytes[6] << 8) | _seedBytes[7]) & 16383,
            _lastMSecs = 0,
            _lastNSecs = 0
        function v1(options, buf, offset) {
            var i = (buf && offset) || 0,
                b = buf || []
            options = options || {}
            var clockseq =
                    options.clockseq !== void 0 ? options.clockseq : _clockseq,
                msecs =
                    options.msecs !== void 0
                        ? options.msecs
                        : new Date().getTime(),
                nsecs =
                    options.nsecs !== void 0 ? options.nsecs : _lastNSecs + 1,
                dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 1e4
            if (
                (dt < 0 &&
                    options.clockseq === void 0 &&
                    (clockseq = (clockseq + 1) & 16383),
                (dt < 0 || msecs > _lastMSecs) &&
                    options.nsecs === void 0 &&
                    (nsecs = 0),
                nsecs >= 1e4)
            )
                throw new Error(
                    "uuid.v1(): Can't create more than 10M uuids/sec",
                )
            ;(_lastMSecs = msecs),
                (_lastNSecs = nsecs),
                (_clockseq = clockseq),
                (msecs += 122192928e5)
            var tl = ((msecs & 268435455) * 1e4 + nsecs) % 4294967296
            ;(b[i++] = (tl >>> 24) & 255),
                (b[i++] = (tl >>> 16) & 255),
                (b[i++] = (tl >>> 8) & 255),
                (b[i++] = tl & 255)
            var tmh = ((msecs / 4294967296) * 1e4) & 268435455
            ;(b[i++] = (tmh >>> 8) & 255),
                (b[i++] = tmh & 255),
                (b[i++] = ((tmh >>> 24) & 15) | 16),
                (b[i++] = (tmh >>> 16) & 255),
                (b[i++] = (clockseq >>> 8) | 128),
                (b[i++] = clockseq & 255)
            for (var node = options.node || _nodeId, n = 0; n < 6; ++n)
                b[i + n] = node[n]
            return buf || bytesToUuid(b)
        }
        module.exports = v1
    })
    var require_v4 = __commonJS((exports, module) => {
        var rng = require_rng_browser(),
            bytesToUuid = require_bytesToUuid()
        function v4(options, buf, offset) {
            var i = (buf && offset) || 0
            typeof options == 'string' &&
                ((buf = options == 'binary' ? new Array(16) : null),
                (options = null)),
                (options = options || {})
            var rnds = options.random || (options.rng || rng)()
            if (
                ((rnds[6] = (rnds[6] & 15) | 64),
                (rnds[8] = (rnds[8] & 63) | 128),
                buf)
            )
                for (var ii = 0; ii < 16; ++ii) buf[i + ii] = rnds[ii]
            return buf || bytesToUuid(rnds)
        }
        module.exports = v4
    })
    var require_uuid_browser = __commonJS((exports, module) => {
        var v1 = require_v1(),
            v4 = require_v4(),
            uuid2 = v4
        uuid2.v1 = v1
        uuid2.v4 = v4
        module.exports = uuid2
    })
    var onAttributeAddeds = [],
        onElRemoveds = [],
        onElAddeds = []
    function cleanupAttributes(el, names) {
        !el._x_attributeCleanups ||
            Object.entries(el._x_attributeCleanups).forEach(([name, value]) => {
                ;(names === void 0 || names.includes(name)) &&
                    (value.forEach((i) => i()),
                    delete el._x_attributeCleanups[name])
            })
    }
    var observer = new MutationObserver(onMutate),
        currentlyObserving = !1
    function startObservingMutations() {
        observer.observe(document, {
            subtree: !0,
            childList: !0,
            attributes: !0,
            attributeOldValue: !0,
        }),
            (currentlyObserving = !0)
    }
    function stopObservingMutations() {
        flushObserver(), observer.disconnect(), (currentlyObserving = !1)
    }
    var recordQueue = [],
        willProcessRecordQueue = !1
    function flushObserver() {
        ;(recordQueue = recordQueue.concat(observer.takeRecords())),
            recordQueue.length &&
                !willProcessRecordQueue &&
                ((willProcessRecordQueue = !0),
                queueMicrotask(() => {
                    processRecordQueue(), (willProcessRecordQueue = !1)
                }))
    }
    function processRecordQueue() {
        onMutate(recordQueue), (recordQueue.length = 0)
    }
    function mutateDom(callback) {
        if (!currentlyObserving) return callback()
        stopObservingMutations()
        let result = callback()
        return startObservingMutations(), result
    }
    var isCollecting = !1,
        deferredMutations = []
    function onMutate(mutations) {
        if (isCollecting) {
            deferredMutations = deferredMutations.concat(mutations)
            return
        }
        let addedNodes = [],
            removedNodes = [],
            addedAttributes = new Map(),
            removedAttributes = new Map()
        for (let i = 0; i < mutations.length; i++)
            if (
                !mutations[i].target._x_ignoreMutationObserver &&
                (mutations[i].type === 'childList' &&
                    (mutations[i].addedNodes.forEach(
                        (node) => node.nodeType === 1 && addedNodes.push(node),
                    ),
                    mutations[i].removedNodes.forEach(
                        (node) =>
                            node.nodeType === 1 && removedNodes.push(node),
                    )),
                mutations[i].type === 'attributes')
            ) {
                let el = mutations[i].target,
                    name = mutations[i].attributeName,
                    oldValue = mutations[i].oldValue,
                    add = () => {
                        addedAttributes.has(el) || addedAttributes.set(el, []),
                            addedAttributes
                                .get(el)
                                .push({ name, value: el.getAttribute(name) })
                    },
                    remove = () => {
                        removedAttributes.has(el) ||
                            removedAttributes.set(el, []),
                            removedAttributes.get(el).push(name)
                    }
                el.hasAttribute(name) && oldValue === null
                    ? add()
                    : el.hasAttribute(name)
                    ? (remove(), add())
                    : remove()
            }
        removedAttributes.forEach((attrs, el) => {
            cleanupAttributes(el, attrs)
        }),
            addedAttributes.forEach((attrs, el) => {
                onAttributeAddeds.forEach((i) => i(el, attrs))
            })
        for (let node of removedNodes)
            if (
                !addedNodes.includes(node) &&
                (onElRemoveds.forEach((i) => i(node)), node._x_cleanups)
            )
                for (; node._x_cleanups.length; ) node._x_cleanups.pop()()
        addedNodes.forEach((node) => {
            ;(node._x_ignoreSelf = !0), (node._x_ignore = !0)
        })
        for (let node of addedNodes)
            removedNodes.includes(node) ||
                !node.isConnected ||
                (delete node._x_ignoreSelf,
                delete node._x_ignore,
                onElAddeds.forEach((i) => i(node)),
                (node._x_ignore = !0),
                (node._x_ignoreSelf = !0))
        addedNodes.forEach((node) => {
            delete node._x_ignoreSelf, delete node._x_ignore
        }),
            (addedNodes = null),
            (removedNodes = null),
            (addedAttributes = null),
            (removedAttributes = null)
    }
    function once(callback, fallback = () => {}) {
        let called = !1
        return function () {
            called
                ? fallback.apply(this, arguments)
                : ((called = !0), callback.apply(this, arguments))
        }
    }
    var notification_default = (Alpine) => {
        Alpine.data('notificationComponent', ({ notification }) => ({
            isShown: !1,
            computedStyle: null,
            init: function () {
                ;(this.computedStyle = window.getComputedStyle(this.$el)),
                    this.configureTransitions(),
                    this.configureAnimations(),
                    notification.duration &&
                        notification.duration !== 'persistent' &&
                        setTimeout(() => this.close(), notification.duration),
                    (this.isShown = !0)
            },
            configureTransitions: function () {
                let display = this.computedStyle.display,
                    show = () => {
                        mutateDom(() => {
                            this.$el.style.setProperty('display', display),
                                this.$el.style.setProperty(
                                    'visibility',
                                    'visible',
                                )
                        }),
                            (this.$el._x_isShown = !0)
                    },
                    hide = () => {
                        mutateDom(() => {
                            this.$el._x_isShown
                                ? this.$el.style.setProperty(
                                      'visibility',
                                      'hidden',
                                  )
                                : this.$el.style.setProperty('display', 'none')
                        })
                    },
                    toggle = once(
                        (value) => (value ? show() : hide()),
                        (value) => {
                            this.$el._x_toggleAndCascadeWithTransitions(
                                this.$el,
                                value,
                                show,
                                hide,
                            )
                        },
                    )
                Alpine.effect(() => toggle(this.isShown))
            },
            configureAnimations: function () {
                let animation
                Livewire.hook('message.received', (_, component) => {
                    if (component.fingerprint.name !== 'notifications') return
                    let getTop = () => this.$el.getBoundingClientRect().top,
                        oldTop = getTop()
                    ;(animation = () => {
                        this.$el.animate(
                            [
                                {
                                    transform: `translateY(${
                                        oldTop - getTop()
                                    }px)`,
                                },
                                { transform: 'translateY(0px)' },
                            ],
                            {
                                duration: this.getTransitionDuration(),
                                easing: this.computedStyle
                                    .transitionTimingFunction,
                            },
                        )
                    }),
                        this.$el
                            .getAnimations()
                            .forEach((animation2) => animation2.finish())
                }),
                    Livewire.hook('message.processed', (_, component) => {
                        component.fingerprint.name === 'notifications' &&
                            (!this.isShown || animation())
                    })
            },
            close: function () {
                ;(this.isShown = !1),
                    setTimeout(
                        () =>
                            Livewire.emit(
                                'notificationClosed',
                                notification.id,
                            ),
                        this.getTransitionDuration(),
                    )
            },
            getTransitionDuration: function () {
                return parseFloat(this.computedStyle.transitionDuration) * 1e3
            },
        }))
    }
    var import_uuid_browser = __toModule(require_uuid_browser()),
        Notification = class {
            constructor() {
                return this.id((0, import_uuid_browser.v4)()), this
            }
            id(id) {
                return (this.id = id), this
            }
            title(title) {
                return (this.title = title), this
            }
            body(body) {
                return (this.body = body), this
            }
            actions(actions) {
                return (this.actions = actions), this
            }
            status(status) {
                switch (status) {
                    case 'success':
                        this.success()
                        break
                    case 'warning':
                        this.warning()
                        break
                    case 'danger':
                        this.danger()
                        break
                }
                return this
            }
            icon(icon) {
                return (this.icon = icon), this
            }
            iconColor(color) {
                return (this.iconColor = color), this
            }
            duration(duration) {
                return (this.duration = duration), this
            }
            seconds(seconds) {
                return this.duration(seconds * 1e3), this
            }
            persistent() {
                return this.duration('persistent'), this
            }
            success() {
                return (
                    this.icon('heroicon-o-check-circle'),
                    this.iconColor('success'),
                    this
                )
            }
            warning() {
                return (
                    this.icon('heroicon-o-exclamation-circle'),
                    this.iconColor('warning'),
                    this
                )
            }
            danger() {
                return (
                    this.icon('heroicon-o-x-circle'),
                    this.iconColor('danger'),
                    this
                )
            }
            send() {
                return Livewire.emit('notificationSent', this), this
            }
        },
        Action = class {
            constructor(name) {
                return this.name(name), this
            }
            name(name) {
                return (this.name = name), this
            }
            color(color) {
                return (this.color = color), this
            }
            emit(event, data) {
                return this.event(event), this.eventData(data), this
            }
            event(event) {
                return (this.event = event), this
            }
            eventData(data) {
                return (this.eventData = data), this
            }
            extraAttributes(attributes) {
                return (this.extraAttributes = attributes), this
            }
            icon(icon) {
                return (this.icon = icon), this
            }
            iconPosition(position) {
                return (this.iconPosition = position), this
            }
            outlined(condition = !0) {
                return (this.isOutlined = condition), this
            }
            disabled(condition = !0) {
                return (this.isDisabled = condition), this
            }
            label(label) {
                return (this.label = label), this
            }
            close(condition = !0) {
                return (this.shouldCloseNotification = condition), this
            }
            openUrlInNewTab(condition = !0) {
                return (this.shouldOpenUrlInNewTab = condition), this
            }
            size(size) {
                return (this.size = size), this
            }
            url(url) {
                return (this.url = url), this
            }
            view(view) {
                return (this.view = view), this
            }
            button() {
                return (
                    this.view('filament-notifications::actions.button-action'),
                    this
                )
            }
            grouped() {
                return (
                    this.view('filament-notifications::actions.grouped-action'),
                    this
                )
            }
            link() {
                return (
                    this.view('filament-notifications::actions.link-action'),
                    this
                )
            }
        },
        ActionGroup = class {
            constructor(actions) {
                return this.actions(actions), this
            }
            actions(actions) {
                return (
                    (this.actions = actions.map((action) => action.grouped())),
                    this
                )
            }
            color(color) {
                return (this.color = color), this
            }
            icon(icon) {
                return (this.icon = icon), this
            }
            iconPosition(position) {
                return (this.iconPosition = position), this
            }
            label(label) {
                return (this.label = label), this
            }
            tooltip(tooltip) {
                return (this.tooltip = tooltip), this
            }
        }
    window.NotificationAction = Action
    window.NotificationActionGroup = ActionGroup
    window.Notification = Notification
    document.addEventListener('alpine:init', () => {
        window.Alpine.plugin(notification_default)
    })
})()
