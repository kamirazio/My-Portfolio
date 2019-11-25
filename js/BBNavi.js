var NAVI_MODEL = Backbone.Model.extend({
    defaults: {
        "reference": "",
        "is_greeting_done": false,
        'is_menu_open': false,
        // 'is_mobile_on': false,
        "order": 0,
        "number": 3,
        "canvas_list": ['metaball', 'lifegame', 'nodeloop']
    },
});

var NAVI_MODEL_VIEW = Backbone.View.extend({
    el: $('.wrap'),
    canvas_status: "center",
    top_status: [0, 0],
    top_header: true,
    events: {
        'click .m_menu': 'menuNaviOn',
        'click #menu_next': 'gotoNext',
        'click #top-carousel-indicators li': 'canvasChange',
        'click .top-btn': 'gotoTop',
        'click #navi1': 'homeButtonClicked',
        'click #navi2': 'toggleMenu',
        'click #navi3': 'goBack',
        'click #navi4': 'goAhead',
        'click #balloon .close_btn': 'hideGreetingBalloon',
    },
    // template: _.template(app.getTemplate('work_list')),
    initialize: function () {
        this.model = new NAVI_MODEL();
        this.listenTo(this.model, 'change:order', this.showCanvas);
        // this.listenTo(this.model, 'change:is_greeting_done', this.hideGreetingBalloon);
        this.listenTo(this.model, 'change:is_menu_open', this.setMenu);
        //this.listenTo(this.model, 'change:is_in_top_page', this.showGreetingBalloon); 
        // this.setMenu();
        // ========== read canvas ========== //
        var canvases = this.model.get("canvas_list");
        var list = _.shuffle(canvases);
        console.log(list);

        $.each(list, function (i, val) {
            var newCanvas = $('<canvas />', {
                'id': val,
                'data-paper-resize': true
            }).prop({
                width: $(window).width(),
                height: $(window).height(),
            });
            $('.carousel-inner #canvas' + i).append(newCanvas);
        });
        this.model.set("canvas_list", list);
        var canvases = this.model.get('canvas_list');
        this.loadCanvas(canvases[0], 0);
        this.showGreetingBalloon();
    },
    showGreetingBalloon: function (_switch) {
        
        // var duration = _switch ? 0 : 3000;
        if (!_switch && this.model.get('is_greeting_done')) {
            return
        } 
        
        var balloon_height = $('#balloon').height()+100;

        if(_switch){
            var balloon = $('#balloon').fadeIn(200)
                                    .addClass('balloon-popup')
                                    .delay(4000)
                                    .fadeOut(300); 
        }else{
            var balloon = $('#balloon').delay(3000)
                                    .fadeIn(200)
                                    .addClass('balloon-popup')
                                    .delay(3500)
                                    .fadeOut(300);
        }

        $('#header2').append(balloon)
        $(balloon).css({
            'margin-top': -(balloon_height)+'px'
            });
        this.model.set('is_greeting_done', true);
    },
    hideGreetingBalloon: function () {
        $('#balloon').fadeOut(300);
    },
    showCanvas: function () {
        $('.carousel-inner .item .mycanvas').removeClass('white_base');
        var order = this.model.get("order") || 0;
        var canvases = this.model.get("canvas_list");
        this.loadCanvas(canvases[order], order);
    },
    loadCanvas: function (name, order) {
        // return;
        window.is_metaball_activate = false;
        var canvas_file = "js/art/" + name + ".js";
        try {
            lifegame_clear();
        } catch (error) {}
        try {
            nodeloop_clear();
        } catch (error) {}
        // metaball_clear();

        switch (name) {
            case 'metaball':
                window.is_metaball_activate = true;

                $("#metaball").fadeIn(1000);
                if (window.is_metaball_ready) {
                    $('canvas#metaball').parent().addClass('white_base');
                } else {

                }
                break;

            case 'lifegame':
                $.ajax({
                    type: "GET",
                    url: canvas_file,
                    dataType: "script",
                    success: function (script, res, data) {
                        lifegame_init();
                        $('.carousel-inner .item .mycanvas')
                            .eq(order || 0)
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
                    success: function (script, res, data) {
                        nodes_init();
                        $('.carousel-inner .item .mycanvas').eq(order || 0).addClass('white_base');
                        clearSpiner();
                    }
                });
                break;

            case 'ink':
                $.ajax({
                    type: "GET",
                    url: canvas_file,
                    dataType: "script",
                    success: function (script, res, data) {
                        ink();
                        $('.carousel-inner .item .mycanvas').eq(order || 0).addClass('white_base');
                    }
                });
                break;
        }
    },
    toggleMenu: function () {
        this.model.set('is_menu_open', !this.model.get('is_menu_open') );
    },
    setMenu: function () {
        // var menu_width = $("#main_menu").width();
        if (!this.model.get('is_menu_open')) {
            $('#header').removeClass('menu--open');
        } else {
            $('#header').addClass('menu--open');
        }
    },
    gotoNext: function (e) {
        //Scroll in the page
        var i = $('.menu_next').index(e.currentTarget);
        var p = $('.section').eq(i + 1).offset().top; //要素の表示位置
        $('html,body').animate({
            scrollTop: p - 60
        }, 800);
        // this.navi_close();
    },
    homeButtonClicked: function(){
        if(app_v.model.get('is_in_top_page')){
            this.showGreetingBalloon(true);
        }else{
            this.gotoTop();
        }
    },
    naviToTopic: function (e) {
        // //Scroll in the page
        // this.toggleMenu();
        // var i = $('.m_menu').index(e.currentTarget);
        // var p = $('.section').eq(i).offset().top; //要素の表示位置
        // // console.log(i + "番地" + p + "pxへ行きます");

        // $('html,body').animate({
        //     scrollTop: p - 120
        // }, 800);
        // // this.navi_close();
    },
    menuNaviOn: function (e) {
        //Scroll in the page
        this.toggleMenu();
        var i = $('.m_menu').index(e.currentTarget);
        var p = $('.section').eq(i).offset().top; //要素の表示位置
        // console.log(i + "番地" + p + "pxへ行きます");

        $('html,body').animate({
            scrollTop: p - 120
        }, 800);
        // this.navi_close();
    },
    goAhead: function () {

        var order = this.model.get("order");
        console.log(order);

        // var canvas_top = $(".mycanvas").eq(0);
        if (this.model.get("number") > order + 1) {
            this.model.set({
                "order": ++order
            });
        } else {
            this.model.set({
                "order": 0
            });
        }
        // $('#navi4 > a').click();
        // canvas_top.appendTo("#screen");
    },
    goBack: function () {

        var order = this.model.get("order");
        console.log(order);
        // var canvas_end = $(".mycanvas").eq(this.model.get("number")-1);
        if (0 > order - 1) {
            this.model.set({
                "order": this.model.get("number") - 1
            });
        } else {
            this.model.set({
                "order": --order
            });
        }
        // $('#navi3 > a').click();
        // canvas_end.prependTo("#screen");
    },
    canvasChange: function (e) {

        console.log(e.currentTarget);
        var next_num = parseInt($(e.currentTarget).attr("data-slide-to"));
        this.model.set("order", next_num);
    },

    gotoTop: function (e) {
        console.log("top-btnが押されました");
        $('html,body').animate({
            scrollTop: 0
        }, 800);
        return false;
    }
});