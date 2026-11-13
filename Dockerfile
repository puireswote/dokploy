FROM nginx:alpine

# Nginx config (replace stock default.conf — kills the "Welcome to nginx" page)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static sites
COPY main_website /usr/share/nginx/html/main_website
COPY sub_website /usr/share/nginx/html/sub_website
