//공통 라이브러리로 분리
import {show} from "./commonToast.jsx"

// Axios Promise든 일반 Promise든 OK
export function withToast(promise, msgs) {
    show.promise(promise, msgs);
    return promise; // then/await 체이닝 그대로
}