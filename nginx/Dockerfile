FROM nginx:1.25-alpine

# nginx 설정만 사용 (프록시 전용)
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
