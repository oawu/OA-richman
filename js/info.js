/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 OA Wu Design
 */

$(function () {

    var $loading = $('<div />').attr ('id', 'loading')
                               .append ($('<div />'))
                               .appendTo ($('body'));

    var $about = $('#about');
    var $more = $('#more');
    var $popUp = $('#pop_up');

    var popUp = [
      {t: '關於 OA-richman', is: [
        {t: '作者名稱', h: 'http://www.ioa.tw', c: 'OA Wu'},
        {t: 'E-mail', h: '', c: 'comdan66@gmail.com'},
        {t: '作品名稱', h: '', c: 'OA-richman'},
        {t: '最新版本', h: '', c: '1.1.0'},
        {t: 'GitHub', h: 'https://github.com/comdan66/OA-richman', c: 'OA-richman'},
        {t: '相關資源', h: 'https://developers.google.com/maps/documentation/javascript/markers', c: 'Google maps API'},
        {t: '更新日期', h: '', c: '2015/05/13'},
      ]},
      {t: '更多相關作品', is: [
        {t: 'Material Design UI', h: 'https://github.com/comdan66/OA-material', c: 'OA-material'},
        {t: '北港迎媽祖', h: 'https://works.ioa.tw/matsu/2015/din-tao_map-19an.html', c: 'OA-matsu'},
        {t: 'Js 迷宮', h: 'https://github.com/comdan66/OA-maze', c: 'OA-maze'},
        {t: 'Js imgLiquid', h: 'https://github.com/comdan66/OA-imgLiquid', c: 'OA-imgLiquid'},
        {t: '導航列', h: 'https://github.com/comdan66/OA-navbar', c: 'OA-navbar'},
        {t: 'Js Slider View', h: 'https://github.com/comdan66/OA-scrollSliderView', c: 'OA-scrollSliderView'},
        {t: 'Youtube Play List', h: 'https://github.com/comdan66/u2', c: 'OA-u2'},
      ]}
    ];

    $about.click (function () {
      var data = popUp[0];

      $popUp.find ('.paper').empty ().append ($('<h2 />').text (data.t)).append ($('<div />').addClass ('pop_up').append (data.is.map (function (t) {
        return $('<div />').addClass ('i').append ($('<div />').addClass ('l').text (t.t)).append ($('<div />').addClass ('r').append (t.h === '' ? t.c : $('<a />').attr ('href', t.h).attr ('target', '_blank').text (t.c)));
      }))).append ($('<div />').addClass ('close').html ('&#10006;'));

      $popUp.removeClass ('hide');
    });

    $more.click (function () {
      var data = popUp[1];

      $popUp.find ('.paper').empty ().append ($('<h2 />').text (data.t)).append ($('<div />').addClass ('pop_up').append (data.is.map (function (t) {
        return $('<div />').addClass ('i').append ($('<div />').addClass ('l').text (t.t)).append ($('<div />').addClass ('r').append (t.h === '' ? t.c : $('<a />').attr ('href', t.h).attr ('target', '_blank').text (t.c)));
      }))).append ($('<div />').addClass ('close').html ('&#10006;'));

      $popUp.removeClass ('hide');
    });

    $popUp.on ('click', '.close', function () {
      $popUp.find ('.paper').empty ();
      $popUp.addClass ('hide');
    });
});