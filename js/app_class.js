// 'use strict';

function checkBrowser(){
  var userAgent = window.navigator.userAgent.toLowerCase();
  if (userAgent.indexOf('opera') != -1) {
    return 'opera';
  } else if (userAgent.indexOf('msie') != -1) {
    return 'ie';
  } else if (userAgent.indexOf('chrome') != -1) {
    return 'chrome';
  } else if (userAgent.indexOf('safari') != -1) {
    return 'safari';
  } else if (userAgent.indexOf('gecko') != -1) {
    return 'gecko';
  } else {
    return false;
  }
}

var APP = function() {

  // ========== read config ========== //
  // this.config_file = "js/config.js";
  // var config_txt = $.ajax({
  //         type: "GET",
  //         url: this.config_file,
  //         dataType: "json",
  //         async: false // false だと警告がでる
  // }).responseText; // ajax の結果をテキストにして出力
  //
  // // console.log(config_txt);
  // this.config = $.parseJSON(config_txt);

  //================ ブラウザチェック ================//
    // if('chrome'!=checkBrowser()){
    //   var msg = "This webpage only supports Google Chrome. Please ascess with it here again.";
    //   alert(msg);
    //   window.location = "https://www.google.co.jp/chrome/browser/";
    //   return;
    // }

  // ---- read template
  var templates = {};
  this.getTemplate = function(template_name) {
    if (template_name in templates === false) {
      var file_path = 'tmpl/' + template_name + ".html";
      var template_code = $.ajax({
        type: "GET",
        url: file_path,
        async: false,
      }).responseText;
      templates[template_name] = template_code;
    }
    return templates[template_name];
  };

};

window.app = new APP();
// console.log('===== new app =====');
// console.log(app);
