/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 OA Wu Design
 */

$(function () {

  function initialize () {
    var $loading = $('<div />').attr ('id', 'loading')
                               .append ($('<div />'))
                               .appendTo ($('body'));
    
    var markerInfos = [{position: new google.maps.LatLng (23.568038757736595, 120.30465692281723)}, {position: new google.maps.LatLng (23.565363909701762, 120.30417948961258)}, {position: new google.maps.LatLng (23.564550135385016, 120.30402392148972)}, {position: new google.maps.LatLng (23.565029549867546, 120.30180037021637)}, {position: new google.maps.LatLng (23.56839031919102, 120.30243337154388)}, {position: new google.maps.LatLng (23.568697627383873, 120.30138731002808)}, {position: new google.maps.LatLng (23.57121506902716, 120.30256748199463)}, {position: new google.maps.LatLng (23.572736819430755, 120.29828935861588)}, {position: new google.maps.LatLng (23.5747059726961, 120.29707431793213)}, {position: new google.maps.LatLng (23.576242432573448, 120.3018781542778)}, {position: new google.maps.LatLng (23.57265323424432, 120.30320584774017)}, {position: new google.maps.LatLng (23.57215172200842, 120.3030127286911)}, {position: new google.maps.LatLng (23.571478119226718, 120.30489563941956)}, {position: new google.maps.LatLng (23.569523668242216, 120.30414193868637)}, {position: new google.maps.LatLng (23.568901679626702, 120.30510485172272)}];

    var map = new window.funcs ();
    
    if (!map.init ($('#map'), markerInfos))
      return alert ('地圖資料初始化失敗');

    var user = map.createUser ();
    user.setPosition ();

    $('#throw_dice').click (function () {
      user.goStep (3);
    });

    $loading.fadeOut (function () {
      $(this).hide (function () {
        $(this).remove ();
      });
    });
  }

  google.maps.event.addDomListener (window, 'load', initialize);
});