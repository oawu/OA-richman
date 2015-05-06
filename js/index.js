/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 OA Wu Design
 */

$(function () {

  function initialize () {
    var $loading = $('<div />').attr ('id', 'loading')
                               .append ($('<div />'))
                               .appendTo ($('body'));
    var $runDice = $('#run_dice');
    var $dice = $('#dice');
    var $popUp = $('#pop_up');

    var popUp = [
      {t: '關於 OA-richman', is: [
        {t: '作者名稱', h: 'http://www.ioa.tw', c: 'OA Wu'},
        {t: 'E-mail', h: '', c: 'comdan66@gmail.com'},
        {t: '作品名稱', h: '', c: 'OA-richman'},
        {t: '最新版本', h: '', c: '1.0.0'},
        {t: 'GitHub', h: 'https://github.com/comdan66/OA-richman', c: 'OA-richman'},
        {t: '相關資源', h: 'https://developers.google.com/maps/documentation/javascript/markers', c: 'Google maps API'},
        {t: '更新日期', h: '', c: '2015/05/05'},
      ]},
      {t: '更多相關作品', is: [
        {t: 'Material Design UI', h: 'https://github.com/comdan66/OA-material', c: 'OA-material'},
        {t: '北港迎媽祖', h: 'http://comdan66.github.io/matsu/2015/din-tao_map-19an.html', c: 'OA-matsu'},
        {t: 'Js 迷宮', h: 'https://github.com/comdan66/OA-maze', c: 'OA-maze'},
        {t: 'Js imgLiquid', h: 'https://github.com/comdan66/OA-imgLiquid', c: 'OA-imgLiquid'},
        {t: '導航列', h: 'https://github.com/comdan66/OA-navbar', c: 'OA-navbar'},
        {t: 'Js Slider View', h: 'https://github.com/comdan66/OA-scrollSliderView', c: 'OA-scrollSliderView'},
        {t: 'Youtube Play List', h: 'https://github.com/comdan66/u2', c: 'OA-u2'},
      ]}

    ];
    
    var markerInfos = [{position: new google.maps.LatLng (23.568038757736595, 120.30465692281723)}, {position: new google.maps.LatLng (23.565363909701762, 120.30417948961258)}, {position: new google.maps.LatLng (23.564550135385016, 120.30402392148972)}, {position: new google.maps.LatLng (23.565029549867546, 120.30180037021637)}, {position: new google.maps.LatLng (23.56839031919102, 120.30243337154388)}, {position: new google.maps.LatLng (23.568697627383873, 120.30138731002808)}, {position: new google.maps.LatLng (23.57121506902716, 120.30256748199463)}, {position: new google.maps.LatLng (23.572736819430755, 120.29828935861588)}, {position: new google.maps.LatLng (23.5747059726961, 120.29707431793213)}, {position: new google.maps.LatLng (23.576242432573448, 120.3018781542778)}, {position: new google.maps.LatLng (23.57265323424432, 120.30320584774017)}, {position: new google.maps.LatLng (23.57215172200842, 120.3030127286911)}, {position: new google.maps.LatLng (23.571478119226718, 120.30489563941956)}, {position: new google.maps.LatLng (23.569523668242216, 120.30414193868637)}, {position: new google.maps.LatLng (23.568901679626702, 120.30510485172272)}];

    var map = new window.funcs ();
    
    if (!map.init ($('#map'), markerInfos))
      return alert ('地圖資料初始化失敗');

    var user = map.createUser ();
    user.setPosition ();

    $('#throw_dice').click (function () {
      var step = Math.floor ((Math.random () * 6) + 1);
      $dice.attr ('class', 'show' + step);

      $runDice.fadeIn (function () {
        for (var nStep = Math.floor ((Math.random () * 6) + 1); nStep == step; nStep = Math.floor ((Math.random () * 6) + 1));

        $dice.attr ('class', 'show' + nStep);

        setTimeout (function () {
          $runDice.fadeOut (function () { user.goStep (nStep); });
        }, 800);
      });
    });

    $('.btns .about').click (function () {
      var data = popUp[0];

      $popUp.find ('.paper').empty ().append ($('<h2 />').text (data.t)).append ($('<div />').addClass ('pop_up').append (data.is.map (function (t) {
        return $('<div />').addClass ('i').append ($('<div />').addClass ('l').text (t.t)).append ($('<div />').addClass ('r').append (t.h === '' ? t.c : $('<a />').attr ('href', t.h).attr ('target', '_blank').text (t.c)));
      }))).append ($('<div />').addClass ('close').html ('&#10006;'));

      $popUp.removeClass ('hide');
    });
    $('.btns .more').click (function () {
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

    $loading.fadeOut (function () {
      $(this).hide (function () {
        $(this).remove ();
      });
    });
  }

  google.maps.event.addDomListener (window, 'load', initialize);
});