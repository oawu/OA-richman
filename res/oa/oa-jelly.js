/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2014 OA Wu Design
 */

(function( factory ) {
  if ((typeof define === 'function') && define.amd) define (['jquery'], factory);
  else factory (jQuery);
}(function ($) {
  $.fn.extend ({
    OAjelly: function (opt) {
      var d4Opt = {
        rippleColor: 'rgba(0, 0, 0, 0.15)',
        event: 'click'
      },
      init = function (opt) {
        $(this).addClass ('oa-jelly')
        .on (opt.event, function () {
          $(this).addClass ('oa-jelly-effect')
                 .bind ('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function () {
                   $(this).removeClass ('oa-jelly-effect');
                 });
        });
      }
      return $(this).each (function () { init.bind ($(this), $.extend({}, d4Opt, opt)).apply (); });
    }
  });
}));