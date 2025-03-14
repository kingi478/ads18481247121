/**
 * Minified by jsDelivr using Terser v5.3.0.
 * Original file: /npm/toastify-js@1.9.3/src/toastify.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
/*!
 * Toastify js 1.9.3
 * https://github.com/apvarun/toastify-js
 * @license MIT licensed
 *
 * Copyright (C) 2018 Varun A P
 */
! function(t, o) {
    "object" == typeof module && module && module.exports ? module.exports = o() : t.Toastify = o()
}(this, (function(t) {
    var o = function(t) {
        return new o.lib.init(t)
    };

    function i(t, o) {
        return o.offset[t] ? isNaN(o.offset[t]) ? o.offset[t] : o.offset[t] + "px" : "0px"
    }

    function s(t, o) {
        return !(!t || "string" != typeof o) && !!(t.className && t.className.trim().split(/\s+/gi).indexOf(o) > -1)
    }
    return o.lib = o.prototype = {
        toastify: "1.9.3",
        constructor: o,
        init: function(t) {
            return t || (t = {}), this.options = {}, this.toastElement = null, this.options.text = t.text || "Hi there!", this.options.node = t.node, this.options.duration = 0 === t.duration ? 0 : t.duration || 3e3, this.options.selector = t.selector, this.options.callback = t.callback || function() {}, this.options.destination = t.destination, this.options.newWindow = t.newWindow || !1, this.options.close = t.close || !1, this.options.gravity = "bottom" === t.gravity ? "toastify-bottom" : "toastify-top", this.options.positionLeft = t.positionLeft || !1, this.options.position = t.position || "", this.options.backgroundColor = t.backgroundColor, this.options.avatar = t.avatar || "", this.options.className = t.className || "", this.options.stopOnFocus = void 0 === t.stopOnFocus || t.stopOnFocus, this.options.onClick = t.onClick, this.options.offset = t.offset || {
                x: 0,
                y: 0
            }, this
        },
        buildToast: function() {
            if (!this.options) throw "Toastify is not initialized";
            var t = document.createElement("div");
            if (t.className = "toastify on " + this.options.className, this.options.position ? t.className += " toastify-" + this.options.position : !0 === this.options.positionLeft ? (t.className += " toastify-left", console.warn("Property `positionLeft` will be depreciated in further versions. Please use `position` instead.")) : t.className += " toastify-right", t.className += " " + this.options.gravity, this.options.backgroundColor && (t.style.background = this.options.backgroundColor), this.options.node && this.options.node.nodeType === Node.ELEMENT_NODE) t.appendChild(this.options.node);
            else if (t.innerHTML = this.options.text, "" !== this.options.avatar) {
                var o = document.createElement("img");
                o.src = this.options.avatar, o.className = "toastify-avatar", "left" == this.options.position || !0 === this.options.positionLeft ? t.appendChild(o) : t.insertAdjacentElement("afterbegin", o)
            }
            if (!0 === this.options.close) {
                var s = document.createElement("span");
                s.innerHTML = "&#10006;", s.className = "toast-close", s.addEventListener("click", function(t) {
                    t.stopPropagation(), this.removeElement(this.toastElement), window.clearTimeout(this.toastElement.timeOutValue)
                }.bind(this));
                var n = window.innerWidth > 0 ? window.innerWidth : screen.width;
                ("left" == this.options.position || !0 === this.options.positionLeft) && n > 360 ? t.insertAdjacentElement("afterbegin", s) : t.appendChild(s)
            }
            if (this.options.stopOnFocus && this.options.duration > 0) {
                var e = this;
                t.addEventListener("mouseover", (function(o) {
                    window.clearTimeout(t.timeOutValue)
                })), t.addEventListener("mouseleave", (function() {
                    t.timeOutValue = window.setTimeout((function() {
                        e.removeElement(t)
                    }), e.options.duration)
                }))
            }
            if (void 0 !== this.options.destination && t.addEventListener("click", function(t) {
                    t.stopPropagation(), !0 === this.options.newWindow ? window.open(this.options.destination, "_blank") : window.location = this.options.destination
                }.bind(this)), "function" == typeof this.options.onClick && void 0 === this.options.destination && t.addEventListener("click", function(t) {
                    t.stopPropagation(), this.options.onClick()
                }.bind(this)), "object" == typeof this.options.offset) {
                var a = i("x", this.options),
                    p = i("y", this.options),
                    r = "left" == this.options.position ? a : "-" + a,
                    l = "toastify-top" == this.options.gravity ? p : "-" + p;
                t.style.transform = "translate(" + r + "," + l + ")"
            }
            return t
        },
        showToast: function() {
            var t;
            if (this.toastElement = this.buildToast(), !(t = void 0 === this.options.selector ? document.body : document.getElementById(this.options.selector))) throw "Root element is not defined";
            return t.insertBefore(this.toastElement, t.firstChild), o.reposition(), this.options.duration > 0 && (this.toastElement.timeOutValue = window.setTimeout(function() {
                this.removeElement(this.toastElement)
            }.bind(this), this.options.duration)), this
        },
        hideToast: function() {
            this.toastElement.timeOutValue && clearTimeout(this.toastElement.timeOutValue), this.removeElement(this.toastElement)
        },
        removeElement: function(t) {
            t.className = t.className.replace(" on", ""), window.setTimeout(function() {
                this.options.node && this.options.node.parentNode && this.options.node.parentNode.removeChild(this.options.node), t.parentNode && t.parentNode.removeChild(t), this.options.callback.call(t), o.reposition()
            }.bind(this), 400)
        }
    }, o.reposition = function() {
        for (var t, o = {
                top: 15,
                bottom: 15
            }, i = {
                top: 15,
                bottom: 15
            }, n = {
                top: 15,
                bottom: 15
            }, e = document.getElementsByClassName("toastify"), a = 0; a < e.length; a++) {
            t = !0 === s(e[a], "toastify-top") ? "toastify-top" : "toastify-bottom";
            var p = e[a].offsetHeight;
            t = t.substr(9, t.length - 1);
            (window.innerWidth > 0 ? window.innerWidth : screen.width) <= 360 ? (e[a].style[t] = n[t] + "px", n[t] += p + 15) : !0 === s(e[a], "toastify-left") ? (e[a].style[t] = o[t] + "px", o[t] += p + 15) : (e[a].style[t] = i[t] + "px", i[t] += p + 15)
        }
        return this
    }, o.lib.init.prototype = o.lib, o
}));