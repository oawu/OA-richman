/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 OA Wu Design
 */

$(function () {
  var now = document.URL.replace (/^.*[\\\/]/, '');
  var footer = [
    'Rule © 2015',
    "如有相關問題歡迎<a href=''>來信</a>或至<a href='' target='_blank'>作者臉書</a>留言。"
  ];
  var mainMenu = [
    {name: '空格', file: 'space.html'},
    {name: '字串', file: 'string.html'},
    {name: '括號', file: 'symbol.html'},
    {name: '換行縮排', file: 'tab.html'},
    {name: '命名', file: 'naming.html'},
    {name: '註解', file: 'comment.html'},
    {name: '關鍵字', file: 'keyword.html'},
    {name: '其他', file: 'other.html'}
  ];

  var $loading = $('<div />').attr ('id', 'loading').append ($('<div />')).appendTo ($('body').append ($('<div />').attr ('id', 'footer').append (footer.map (function (t) {
    return $('<div />').append (t);
  }))).prepend ($('<div />').attr ('id', 'header').append ($('<div />').append (mainMenu.map (function (t) {
    return $('<a />').addClass (now == t.file ? 'active' : null).attr ('href', t.file).append (t.name);
  })))));

  $('pre').each (function () {
    var length = $(this).parent ().html ().indexOf ('<pre') + 1;
    $(this).html ($(this).html ().replace (new RegExp ("(\n {" + length + "})|(^ {" + length + "})", 'g'), '\n').replace (/^\n/g, '').replace (/ *$/g, ''));
  });

  $loading.fadeOut (function () {
    $(this).hide (function () {
      $(this).remove ();
      console.error ('ss');
    });
  });
});