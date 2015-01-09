from django.conf.urls import patterns, url

urlpatterns = patterns('',
    url(r'^soundcloud/command-webhook$', 'soundcloud.views.command_webhook'),
    url(r'^soundcloud/__status', 'soundcloud.views.home'),
)
