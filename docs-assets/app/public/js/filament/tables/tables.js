;(() => {
    function src_default(Alpine) {
        Alpine.directive('collapse', collapse),
            (collapse.inline = (el, { modifiers }) => {
                !modifiers.includes('min') ||
                    ((el._x_doShow = () => {}), (el._x_doHide = () => {}))
            })
        function collapse(el, { modifiers }) {
            let duration = modifierValue(modifiers, 'duration', 250) / 1e3,
                floor = modifierValue(modifiers, 'min', 0),
                fullyHide = !modifiers.includes('min')
            el._x_isShown || (el.style.height = `${floor}px`),
                !el._x_isShown && fullyHide && (el.hidden = !0),
                el._x_isShown || (el.style.overflow = 'hidden')
            let setFunction = (el2, styles) => {
                    let revertFunction = Alpine.setStyles(el2, styles)
                    return styles.height ? () => {} : revertFunction
                },
                transitionStyles = {
                    transitionProperty: 'height',
                    transitionDuration: `${duration}s`,
                    transitionTimingFunction: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
                }
            el._x_transition = {
                in(before = () => {}, after = () => {}) {
                    fullyHide && (el.hidden = !1),
                        fullyHide && (el.style.display = null)
                    let current = el.getBoundingClientRect().height
                    el.style.height = 'auto'
                    let full = el.getBoundingClientRect().height
                    current === full && (current = floor),
                        Alpine.transition(
                            el,
                            Alpine.setStyles,
                            {
                                during: transitionStyles,
                                start: { height: current + 'px' },
                                end: { height: full + 'px' },
                            },
                            () => (el._x_isShown = !0),
                            () => {
                                el.getBoundingClientRect().height == full &&
                                    (el.style.overflow = null)
                            },
                        )
                },
                out(before = () => {}, after = () => {}) {
                    let full = el.getBoundingClientRect().height
                    Alpine.transition(
                        el,
                        setFunction,
                        {
                            during: transitionStyles,
                            start: { height: full + 'px' },
                            end: { height: floor + 'px' },
                        },
                        () => (el.style.overflow = 'hidden'),
                        () => {
                            ;(el._x_isShown = !1),
                                el.style.height == `${floor}px` &&
                                    fullyHide &&
                                    ((el.style.display = 'none'),
                                    (el.hidden = !0))
                        },
                    )
                },
            }
        }
    }
    function modifierValue(modifiers, key, fallback) {
        if (modifiers.indexOf(key) === -1) return fallback
        let rawValue = modifiers[modifiers.indexOf(key) + 1]
        if (!rawValue) return fallback
        if (key === 'duration') {
            let match = rawValue.match(/([0-9]+)ms/)
            if (match) return match[1]
        }
        if (key === 'min') {
            let match = rawValue.match(/([0-9]+)px/)
            if (match) return match[1]
        }
        return rawValue
    }
    var module_default = src_default
    document.addEventListener('alpine:init', () => {
        window.Alpine.plugin(module_default)
    })
})()
