var namespaces = {
    svg: 'http://www.w3.org/2000/svg',
    xmlns: 'http://www.w3.org/2000/xmlns',
    xlink: 'http://www.w3.org/1999/xlink',
    xhtml: 'http://www.w3.org/1999/xhtml'
};

var argumentsToArray = function (args, from) {
    return Array.prototype.slice.call(args, from);
};

var appendChild = function (target, els) {
    els.forEach(function (el) {
        if (typeof el === 'string') {
            target.innerHTML += el;
        } else {
            target.appendChild(el)
        }
    });
};

var detectNamespace = function (attr) {
    var index = attr.indexOf(':');
    return attr.slice(0, index === -1 ? 0 : index);
}

var appendAttributes = function (el, attributes) {
    for (var attr in attributes) {
        if (attributes.hasOwnProperty(attr)) {
            var namespace = namespaces[detectNamespace(attr)];
            if (namespace) {
                el.setAttributeNS(namespace, attr, attributes[attr]);
            } else {
                el.setAttribute(attr, attributes[attr]);
            }
        }
    }
}

var el = function (elName, attributes) {
    var el = document.createElementNS(namespaces[detectNamespace(elName) || 'svg'], elName);
    appendAttributes(el, attributes);
    appendChild(el, argumentsToArray(arguments, 2));
    return el;
}

var createImageSvg = function (attributes, imageSrc, maskId) {
    maskId = maskId || 'mask';
    return el('svg', {
        xmlns: namespaces.svg,
        width: attributes.width,
        height: attributes.height,
    },
        el('image', {
            width: attributes.width,
            height: attributes.height,
            'xlink:href': imageSrc,
            mask: 'url(#' + maskId + ')'
        })
    );
}

var circle = function (svg, attributes, maskId) {
    var circle = el('circle', {
        r: Math.min(attributes.width, attributes.height) / 2,
        cx: attributes.width / 2,
        cy: attributes.height / 2,
        fill: '#fff'
    });
    return svg.appendChild(el('mask', {
        id: maskId
    }, circle))
};

var polygon = function (svg, attributes, maskId) {
    var polygon = el('polygon', {
        points: "200,400 300,200 400,400",
        fill: '#fff'
    });
    return svg.appendChild(el('mask', {
        id: maskId
    }, polygon))
};

var liveCircle = function (radius) {
    return function (svg, attributes, maskId) {
        var circle = el('circle', {
            r: radius,
            cx: attributes.width / 2 - radius / 4,
            cy: attributes.height / 2 - radius / 4,
            fill: '#fff'
        });
        svg.addEventListener('mousemove', function (e) {
            var offset = svg.getBoundingClientRect();
            var x = e.clientX - offset.left;
            var y = e.clientY - offset.top;
            window.requestAnimationFrame(function () {
                appendAttributes(circle, {
                    cx: x,
                    cy: y
                })
            })
        });
        return svg.appendChild(el('mask', {
            id: maskId
        }, circle))
    }
};

module.exports.el = el;
module.exports.namespaces = namespaces;
module.exports.circle = circle;
module.exports.createImageSvg = createImageSvg;
module.exports.liveCircle = liveCircle;
module.exports.polygon = polygon;