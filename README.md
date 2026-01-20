# MediNote

## 주제 "MSA 기반 개인 맞춤형 종합 건강 관리 웹 페이지"

### 📖 프로젝트 소개
- 프로젝트 목적: 통합적인 의료정보 제공 및 건강관리 플랫폼 제공하여 사용자의 편리한 건강관리 경험 제공
- 개발 기간: 2025.09.01 ~ 2025.10.21
- 참여 인원: 3인
- 담당 역할: 회원 관리 전반, Spring Security 관리, MSA GateWay 관리


### 🛠 기술 스택
### Backend
- Java 21
- Spring Boot 3.5.3
- Spring Security (JWT, OAuth2)
- JPA
- MapStruct
- MariaDB, Redis, Postman 등

### Frontend
- React (Vite)
- JavaScript
- StoryBook
- Zustand
- Tailwind CSS 등

### Infra / DevOps
- IntelliJ
- Goole Sheets
- Discord
- Github
- Docker
- Oracle Cloud Free Tier
- Nginx 등
  
### Table 정의서
<img width="1054" height="435" alt="image" src="https://github.com/user-attachments/assets/9d7144f6-3e7c-40ef-8a85-ced8105ad1bf" />

### 프로토타입 & WBS 
<img width="1110" height="398" alt="image" src="https://github.com/user-attachments/assets/f9d5f038-68d2-4ea9-8ccd-b18d781cf6df" />

### 프로젝트 구조
<img width="1094" height="417" alt="image" src="https://github.com/user-attachments/assets/8e830948-b8ba-4fe9-aa7b-12be981ad812" />

### 주요기능
<img width="994" height="561" alt="image" src="https://github.com/user-attachments/assets/cac14e58-311f-47c2-b0df-4ebc454b4d0c" />

### Test 계정 
- 1234@naver.com / 1234

#### 커밋이력
##### 20260120 기존 배포 프로젝트 오류 1차 수정 및 재배포 
- 구글 탭창 (vite+config) 수정, MediNote 로고 추가
- Docker Container 내부 Port 번호 오설정(로컬 개발 당시 application.yml 설정 그대로 배포 -> 전부 8080으로 수정)
- medinote_back_kc 내 GateWayController DockerNetWork 활용하여 도커 컨테이너 명:8080으로 변경하여 분기처리
- Google Redirect URL .env에 직접 주입
