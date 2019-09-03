FROM nginx
COPY staticweb /usr/share/nginx/html
COPY staticweb /www/data
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8087
