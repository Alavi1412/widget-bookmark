# name: widget-bookmark
# version: 0.1
# authors: SMHassanAlavi

register_asset 'stylesheets/bookmark-widget.scss'

after_initialize do
	
  #SiteSetting.class_eval do
  #  @choices[:layouts_sidebar_right_widgets].push('widget-bookmark')
  #end
  DiscourseLayouts::WidgetHelper.add_widget('widget-bookmark')
end
