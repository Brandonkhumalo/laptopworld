from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.views.static import serve

urlpatterns = [
    path('', lambda r: JsonResponse({'status': 'ok'})),
    path('django-admin/', admin.site.urls),
    path('api/', include('api.urls')),
    # Serve media files in all environments (no separate file server like nginx)
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]
