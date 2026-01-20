package com.medinote.medinote_back_kc.security.controller;

import com.medinote.medinote_back_kc.security.util.CookieUtil;
import com.medinote.medinote_back_kc.security.util.JWTUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.Collections;
import java.util.stream.Collectors;

@RestController
@RequestMapping
@RequiredArgsConstructor
@Log4j2
public class GateWayController {
  private final RestTemplate restTemplate;
  private final JWTUtil jwtUtil;
  private final CookieUtil cookieUtil;

  @RequestMapping("/**")
  public ResponseEntity<byte[]> proxy(HttpServletRequest request, @RequestBody(required=false) byte[] body) throws IOException {
    //1. token 관련 유효성 검증은 컨트롤러에 들어오기 직전에 Filter로 처리가 된다.
    log.info("모든 요청은 GateWayController를 탄답니다?");
    //2. 쿠키파싱 -> accessToken 추출 -> memberId 추출
    String accessToken = cookieUtil.getCookieValue(request,"ACCESS_COOKIE");
    Long memberId = null;
    String role = null;
    if (accessToken != null && !accessToken.isBlank()) {
      try {
        memberId = jwtUtil.getUserId(accessToken);
        role = String.valueOf(jwtUtil.getRole(accessToken));
        log.info("Gateway에서 추출한 memberId = {}", memberId);
      } catch (Exception e) {
        log.error("토큰 파싱 실패", e);
      }
    }

    //3. 내부 서비스 추출
    String originUri = request.getRequestURI();

    // 정적 파일 요청 프록시 대상 제외
    if (originUri.matches(".*\\.(html|css|js|png|jpg|jpeg|gif|ico|svg)$")) {
      log.info("정적 리소스 요청은 프록시하지 않습니다: {}", originUri);
      return ResponseEntity.notFound().build();
    }

    String queryString = request.getQueryString();
    String path = originUri.replace("/api", "");

    if (path.equals("/") || path.equals("") || originUri.equals("/api/")) {
      log.info("루트 요청이라 프록시 안 함");
      return ResponseEntity.ok("MediNote Gateway is alive!".getBytes());
    }

    log.info("Origin URI: " + originUri);
    log.info("Path: " + path);
    // String body = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));

    //4. 서비스 매핑 규칙
    String targetBase;

    if(path.startsWith("/health")){
      targetBase = "http://medinote-back-khs:8080/api";
    } else if(path.startsWith("/member") || path.startsWith("/social")){
      targetBase = "http://medinote-back-kc:8080/api";
    } else {
      targetBase = "http://medinote-back-kys:8080/api";
    }

    String targetUri = targetBase + path + (queryString != null ? "?" + queryString : "") ;

    HttpMethod method = HttpMethod.valueOf(request.getMethod());

    HttpHeaders headers = new HttpHeaders();

    // headers.setContentType(MediaType.APPLICATION_JSON);
    headers.putAll(Collections.list(request.getHeaderNames())
            .stream()
            .collect(Collectors.toMap(
                    h -> h,
                    h -> Collections.list(request.getHeaders(h))
            )));

    if (memberId != null) {
      headers.add("X-Member-Id", memberId.toString()); //
      headers.add("X-Member-Role", role);
    }

    HttpEntity<byte[]> entity = new HttpEntity<>(body, headers);
    ResponseEntity<byte[]> response = restTemplate.exchange(targetUri, method, entity, byte[].class);

    HttpHeaders filteredHeaders = new HttpHeaders();

    response.getHeaders().forEach((key, value) -> {
      if (!key.equalsIgnoreCase(HttpHeaders.TRANSFER_ENCODING)
              && !key.equalsIgnoreCase(HttpHeaders.CONNECTION)
              && !key.equalsIgnoreCase(HttpHeaders.CONTENT_LENGTH)) {
        filteredHeaders.put(key, value);
      }
    });

    return ResponseEntity
            .status(response.getStatusCode())
            .headers(filteredHeaders)
            .body(response.getBody());
  }
}
