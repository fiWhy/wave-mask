var Mask = require('./mask');
var Vector = require('./vector');
var withMaskImages = document.getElementsByClassName('with-mask');
Array.prototype.forEach.call(withMaskImages, function (el) {
    new Mask(el)
        .cover(
            Vector.polygon
        ).done(function (svg) {
            console.log(svg);
            var parent = el.parentElement;
            parent.innerHTML = '';
            parent.appendChild(svg);
        })
});