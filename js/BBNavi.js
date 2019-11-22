
var NAVI_MODEL = Backbone.Model.extend({
  defaults: {
    "reference":"",
    "is_greeting_done": false,
    "order": 0,
    "number": 3,
    "canvas_list":['metaball','lifegame','nodeloop']
  },
});

var NAVI_MODEL_VIEW = Backbone.View.extend({
  el: $('.wrap'),
  canvas_status:"center",
  top_status:[0,0],
  top_header: true,
  events: {
    'click .m_menu': 'gotoTopic',
    'click #menu_next': 'gotoNext',
    'click #top-carousel-indicators li': 'canvasChange',
    'click .top-btn': 'gotoTop',
    'click #navi1': 'gotoTop',
    'click #navi2': 'toggleMenu',
    'click #navi3': 'goBack',
    'click #navi4': 'goAhead',
  },
  // template: _.template(app.getTemplate('work_list')),
  initialize: function(){
    this.model = new NAVI_MODEL();
    this.listenTo(this.model, 'change:order', this.showCanvas);
    this.listenTo(this.model, 'change:is_greeting_done', this.hideGreetingBalloon);
    //this.listenTo(this.model, 'change:is_in_top_page', this.showGreetingBalloon); 

    // ========== read canvas ========== //
    var canvases = this.model.get("canvas_list");
    var list = _.shuffle(canvases);
    console.log(list);

    $.each(list, function(i, val){
        var newCanvas = $('<canvas />',{
          'id': val,
          'data-paper-resize': true
        }).prop({
          width: $(window).width(),
          height: $(window).height(),
        });
        $('.carousel-inner #canvas'+i).append(newCanvas);
    });
    this.model.set("canvas_list",list);
    var canvases = this.model.get('canvas_list');
    this.loadCanvas(canvases[0], 0);
    this.showGreetingBalloon();
  },
  showGreetingBalloon: function(){
    if(this.model.get('is_greeting_done')){ 
      return 
    }else{
      var balloon = $('#balloon')
                  .delay(3000)
                  .fadeIn(200)
                  .addClass('balloon-popup')
                  .delay(3000);
                  // .fadeOut(800);
      $('#header2').append(balloon);
      this.model.set('is_greeting_done', true);
    }
  },
  hideGreetingBalloon: function(){
    $('#balloon').fadeOut(1000);
  },
  showCanvas: function(){
    $('.carousel-inner .item .mycanvas').removeClass('white_base');
    var order = this.model.get("order") || 0;
    var canvases = this.model.get("canvas_list");
    this.loadCanvas(canvases[order], order);
  },
  loadCanvas: function(name, order){
    // return;
    window.is_metaball_activate= false;
    var canvas_file = "js/art/"+ name +".js";
    try {
      lifegame_clear();
    }catch(error){    }
    try {
      nodeloop_clear();
    }catch(error){    }
    // metaball_clear();
    
    switch(name){
      case 'metaball':
        window.is_metaball_activate= true;
        
        $("#metaball").fadeIn(1000);
        if(window.is_metaball_ready){
          $('canvas#metaball').parent().addClass('white_base');
        }else{

        }
        break;

      case 'lifegame':
        $.ajax({
            type: "GET",
            url: canvas_file,
            dataType: "script",
            success: function(script,res,data) {
              lifegame_init();
              $('.carousel-inner .item .mycanvas')
                .eq(order||0)
                .addClass('white_base');
              clearSpiner();
            }
        });
        break;

      case 'nodeloop':
        $.ajax({
            type: "GET",
            url: canvas_file,
            dataType: "script",
            success: function(script,res,data) {
              nodes_init();
              $('.carousel-inner .item .mycanvas').eq(order||0).addClass('white_base');
              clearSpiner();
            }
        });
        break;

      case 'ink':
        $.ajax({
            type: "GET",
            url: canvas_file,
            dataType: "script",
            success: function(script,res,data) {
              ink();
              $('.carousel-inner .item .mycanvas').eq(order||0).addClass('white_base');
            }
        });
        break;
      }
  },
  toggleMenu: function(){

    var menu_w = $("#main_menu").width();
    if(this.top_status[0]==0 && this.top_status[1]==0){
      $("#main_menu").animate({
        "marginRight": "0px"
      });
      $('#panel1,#navi1').animate({
        "marginLeft": (menu_w)*(-1)+"px"
      });
      $('#panel2,#navi2').animate({
        "marginRight": menu_w+"px"
      });
      $('.header_panel span').fadeOut();
      this.top_status[0]=1;

    }else if(this.top_status[0]==1 && this.top_status[1]==0){
      $('#panel1,#navi1').animate({
        "marginLeft": "0px"
      });
      $('#panel2,#navi2').animate({
        "marginRight": "0px"
      });
      $("#main_menu").animate({
        "marginRight": menu_w*(-1) +"px"
      });
      $('.header_panel span').fadeIn();
      this.top_status[0]=0;
    }

    return false;
  },
  gotoNext: function(e){
    //Scroll in the page
    var i = $('.menu_next').index(e.currentTarget);
    var p = $('.section').eq(i+1).offset().top;	//要素の表示位置
    console.log(i+"番地"+p+"pxへ行きます");
    // $('html,body').animate({ scrollTop: p-120 }, 800);
    $('html,body').animate({ scrollTop: p-60}, 800);
    // this.navi_close();
  },
  gotoTopic: function(e){
    //Scroll in the page
    this.toggleMenu();
    var i = $('.m_menu').index(e.currentTarget);
    var p = $('.section').eq(i).offset().top;	//要素の表示位置
    console.log(i+"番地"+p+"pxへ行きます");

    $('html,body').animate({ scrollTop: p-120 }, 800);
    // this.navi_close();
  },
  goAhead: function(){
    
    var order = this.model.get("order");
    console.log(order);

    // var canvas_top = $(".mycanvas").eq(0);
    if( this.model.get("number") > order+1){
      this.model.set({
        "order": ++order
      });
    }else{
      this.model.set({
        "order": 0
      });
    }
    // $('#navi4 > a').click();
    // canvas_top.appendTo("#screen");
  },
  goBack: function(){
    
    var order = this.model.get("order");
    console.log(order);
    // var canvas_end = $(".mycanvas").eq(this.model.get("number")-1);
    if( 0 > order-1){
      this.model.set({
        "order": this.model.get("number")-1
      });
    }else{
      this.model.set({
        "order": --order
      });
    }
    // $('#navi3 > a').click();
    // canvas_end.prependTo("#screen");
  },
  canvasChange: function(e){
    
    console.log(e.currentTarget);
    var next_num = parseInt($(e.currentTarget).attr("data-slide-to"));
    this.model.set("order", next_num);
  },

  gotoTop: function(e){
    console.log("top-btnが押されました");
    $('html,body').animate({ scrollTop: 0 }, 800);
    return false;
  },
    // contactMe: function(e){
    //     if(this.top_status[0]==0 && this.top_status[1]==0){
    //       $('html,body').animate({ scrollTop: 0 }, 800, function(){
    //         $('#panel2>span, #panel1>span, #navi2>i').fadeOut(800);
    //         $('#header2').animate({
    //           "bottom": ((-1)* $('#header2').height())+"px",
    //         },800);
    //         $('#panel1').animate({
    //           "height": $('#top').height()+"px",
    //           "color": "#f8f8f8"
    //         }, 800, function(){
    //           $('canvas').fadeOut(800);
    //           $('#top').append("<h1>hellow</h1>");
    //           $('#panel2').animate({
    //             "marginTop": -100+"px"
    //           });
    //         });
    //       });
    //       this.top_status[0]=1;
    //     }else if(this.top_status[0]==1 && this.top_status[1]==0){
    //       $('html,body').animate({ scrollTop: 0 }, 800, function(){
    //         $('#header2').animate({
    //           "bottom": "0",
    //         },800, function(){
    //         });
    //         $('#panel1').animate({ "height": 100 +"px" }, 800, function(){
    //           $('#panel2').animate({
    //             "marginTop": "0px"
    //           },400,function(){
    //             $('#panel2').animate({ "height": 100 +"px" },100);
    //             $('canvas').fadeIn(800);
    //             $('#panel1>span, #panel2>span, #navi2>i').fadeIn(800);
    //           });
    //         });
    //       });
    //         this.top_status[0]=0;
    //     }
    //   return false;
    // },
});
