FROM nginx:1.25-alpine

# 기본 설정 삭제
RUN rm /etc/nginx/conf.d/default.conf

# 커스텀 설정 복사
COPY default.conf /etc/nginx/conf.d/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
