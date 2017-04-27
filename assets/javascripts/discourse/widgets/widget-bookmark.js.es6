import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';
import { ajax } from 'discourse/lib/ajax';
import { popupAjaxError } from 'discourse/lib/ajax-error';




export default createWidget('widget-bookmark', {
  tagName: 'div.widget-bookmark.widget-container',
  buildKey: (attrs) => 'widget-bookmark',

  defaultState() {
    return {
      data: [],
      loaded: false,
      contents: []
  }
},

getData(){

    var user = Discourse.User.currentProp('username');
    var bookmarked;
    let self = this;
    if (user)
    {
        self.state.loaded = true;
        ajax(`user_actions.json?username=${user}&filter=3&no_results_help_key=user_activity.no_bookmarks`)
        .then(function(res,err){

            bookmarked = res.user_actions;
            if(bookmarked)
                for(var i = 0  ; i < bookmarked.length ; i++)
                {
                    self.state.data = bookmarked[i];


                    self.state.contents.push(h("div.bookmarkBlock",[h("button.bookmark-widget.btn.widget-button.no-text#"+bookmarked[i].post_id, [h("i.fa.fa-remove#"+bookmarked[i].post_id)]),h("a.bookmarded-link",{attributes: 
                        {href: "/t/" + bookmarked[i].slug + "/" + bookmarked[i].topic_id }},
                        h("span.title-widget", bookmarked[i].title))]));

                    self.state.contents.push(h("br"));
                    if (i == 5)
                        break;
                }
                if (!bookmarked) 
                    self.state.contents.push(h("span.title-widget.no-bookmark", [I18n.t("main.bookmark-no"), h("a.link.link-widget",{attributes: {href:I18n.t("main.more-detail-link")}}, I18n.t("main.more-detail"))]));
                else
                    self.state.contents.push(h("a.link.more-bookmark", {attributes:{href: `u/${user}/activity/bookmarks`}}, I18n.t("main.bookmark-more")));
                self.scheduleRerender();
            });
    }
    else
    {
        self.state.loaded = true;
        self.state.contents.push(h("span.title-widget.no-bookmark", [I18n.t("main.bookmark-no"), h("a.link.link-widget",{attributes: {href:I18n.t("main.more-detail-link")}}, I18n.t("main.more-detail"))]));
        self.scheduleRerender();
    }
},

html(attrs, state) {

    if (state.loaded == false)
    {
        state.contents.push(h("span.header-widget",I18n.t("main.bookmark-you")))
        state.contents.push(h("br"));
        this.getData();}
        return h('div.widget-inner', state.contents);
    },
    click(e){
        let self = this;
        if (e.target.localName != "button" && e.target.localName != "i")
            return;
        return ajax("/posts/" + e.target.id + "/bookmark", {
          type: 'PUT',
          data: { bookmarked: false }
      }).then(function (res, err){
        if (err) {
            popupAjaxError(err);
        }
        else
        {
            self.state.loaded = false;
            self.state.contents = [];
            self.scheduleRerender();
        };
    });
  }

});
