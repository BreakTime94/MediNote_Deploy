# 1) Vite 빌드 단계
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# 2) Nginx 정적 파일 서빙 단계
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# nginx 기본 파일 제거
RUN rm -rf ./*

# dist 파일 복사
COPY --from=builder /app/dist ./

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
