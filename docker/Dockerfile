FROM harbor.jry.com/library/nginx
COPY dist/gov-client-web /etc/nginx/html/web
COPY nginx.conf /etc/nginx/
COPY load.sh .
RUN chmod +x load.sh
ENTRYPOINT ./load.sh && /usr/sbin/nginx -g "daemon off;"