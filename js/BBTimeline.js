
var ITEM_MODEL = Backbone.Model.extend({
  defaults: {
    category: "*",
    position: "*",
    location: "*",
    project:"*",
    role: "*",
    achievement: "*",
    to: "*",
    from: "*",
    visibility: true,
  }
});

var ITEM_LIST = Backbone.Collection.extend({
  model: ITEM_MODEL
});

var ITEM_MODEL_VIEW = Backbone.View.extend({
  tagName: "div",
  className: "record fadeup",
  template: _.template(app.getTemplate('item_list')),
  events: {
    'click': 'check'
  },
  check: function(){
    console.log(this.model);
  },
  render: function() {
    // ---- render each item in the history
    var html = this.template(this.model.toJSON());
    this.$el.html(html);
    // ---- .job .work
    this.$el.addClass(this.model.get("category"));
    this.render_item();
    
    var order = this.model.get("order");
    this.$el.addClass("order_"+order);

    if(order>=0){
      this.$(".condition").css({
        "marginTop": order*75
      });
    }
    return this;
  },

  render_item: function(){
    var time_to = this.model.get('to');
    var time_from = this.model.get('from');

    var year_height = (parseInt(time_to[0])-parseInt(time_from[0]))*240;
    var month_height = (parseInt(time_to[1])-parseInt(time_from[1]))*20;
    // var y_top = (this.getCurrentYear() - parseInt(time_to[0]))*240;
    var top = (12-parseInt(time_to[1])) *20;

    if(month_height < 0){
      // m_height = ((12-parseInt(time_from[1])+parseInt(time_to[1]))*20);
      // year_height = year_height - 240;
    }

    this.$el.css({
      "height":(year_height + month_height) + "px",
      "top": top+ "px",
    });

  },
  
});

var JOB_LIST_VIEW = Backbone.View.extend({
  el: '.timelist',
  start_year: 2005,
  current_year: 2019,
  initialize: function() {
    this.getCurrentYear();
    this.col = new ITEM_LIST();
        this.col.fetch({
          dataType : 'json',
          url: 'json/job_list.json',
          success: $.proxy(this.renderYear, this),
          error:  $.proxy(this.error, this)
    });
  },
  renderYear: function() {
    for(var i = this.start_year; i<= this.current_year+1; i++){
      var timebox = $('<div/>',{
                      "class" : 'timebox'
                    }).html( i<=this.current_year ? i : 'Present');

      var jobbox = $('<div/>',{
                      "class" : 'jobbox'
                    });
      var workbox = $('<div/>',{
                      "class" : 'edubox'
                    });

      var time_item = $('<li />', {
                          "class" : 'year',
                          "data-year": i-1
                      }).append(timebox).append(workbox).append(jobbox)
                    .prependTo(this.el);
    }
    this.renderJob();
  },
  renderJob: function() {
    _(this.col.models).each(function(model){
      var model_v = new ITEM_MODEL_VIEW({
        model: model
      });
      var target = $(".timelist").find("[data-year='" + model.get('to')[0] + "']");
      $(target).find('.'+model.get('category')+'box').append(model_v.render().el);
    }, this);
  },
  getCurrentYear: function(){
    var today = new Date();
    this.current_year = today.getFullYear();
  },
  error: function() {
    console.log('cannot load data...');
  },

});
