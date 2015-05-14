/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 OA Wu Design
 */

$(function () {

  function initialize () {

    var $dice = $('#dice');
    var $loading = $('#loading');
    var $runDice = $('#run_dice');
    var $throwDice = $('#throw_dice');

    var markerInfos = [
      {position: new google.maps.LatLng (23.568086083371814, 120.30466228723526), title: '北港朝天宮', price: 1000},
      {position: new google.maps.LatLng (23.564542759763924, 120.30401922762394), title: '日興堂餅店', price: 300},
      {position: new google.maps.LatLng (23.565024632804803, 120.30178427696228), title: '北港大橋', price: 100},
      {position: new google.maps.LatLng (23.568382943785544, 120.3024172782898), title: '仁愛眼鏡', price: 400},
      {position: new google.maps.LatLng (23.56869271045844, 120.30137121677399), title: '北港圓環', price: 300},
      {position: new google.maps.LatLng (23.569646590544906, 120.3018057346344), title: '第一銀行', price: 300},
      {position: new google.maps.LatLng (23.570438207418054, 120.29966801404953), title: '麥當勞', price: 350},
      {position: new google.maps.LatLng (23.572139430017806, 120.30015349388123), title: '黑仔當歸鴨', price: 400},
      {position: new google.maps.LatLng (23.571205235364623, 120.30257821083069), title: '85度C ', price: 300},
      {position: new google.maps.LatLng (23.569961271115567, 120.30586391687393), title: '廟後街', price: 200},
    ];

    var name1 = '玩家';
    var name2 = '電腦';
    name1 = prompt ("請輸入您的暱稱吧！", name1);
    if (!name1 || name1.length <= 0)
      name1 = '玩家';

    $('#quota1 b').text (name1);
    $('#quota2 b').text (name2);

    var map = new window.funcs ();

    if (!map.init ($('#map'), markerInfos, $('#logs')))
      return alert ('地圖資料初始化失敗');
    map.logs ('地圖資料初始化成功！', 'title');

    var user1 = map.createUser (name1, $('#quota1 span'), 'rgba(0, 0, 255, 0.9)');
    user1.setPosition ();

    var user2 = map.createUser (name2, $('#quota2 span'), 'rgba(0, 128, 0, 0.9)');
    user2.setPosition ();

    map.logs ('使用者初始化成功！', 'title');
    map.logs ('遊戲開始，請擲骰子吧！', 'title');


    $throwDice.click (function () {
      $throwDice.prop ('disabled', true);

      var step = Math.floor ((Math.random () * 6) + 1);
      $dice.attr ('class', 'show' + step);

      $runDice.fadeIn (function () {
        for (var nStep = Math.floor ((Math.random () * 6) + 1); nStep == step; nStep = Math.floor ((Math.random () * 6) + 1));

        $dice.attr ('class', 'show' + nStep);
        map.logs (user1.name + ' 擲出 ' + nStep + ' 點！');

        setTimeout (function () {
          $runDice.fadeOut (function () { user1.goStep (nStep, false, function () {
            map.logs ('換 ' + user2.name + ' 擲骰子！', 'title');

            nStep = Math.floor ((Math.random () * 6) + 1);
            map.logs (user2.name + ' 擲出 ' + nStep + ' 點！');

            user2.goStep (nStep, true, function () {
              $throwDice.prop ('disabled', false);
              map.logs ('換 ' + user1.name + ' 擲骰子！', 'title');
            });
          }); });
        }, 800);
      });
    });

    $loading.fadeOut (function () {
      $(this).hide (function () {
        $(this).remove ();
      });
    });
  }

  google.maps.event.addDomListener (window, 'load', initialize);
});