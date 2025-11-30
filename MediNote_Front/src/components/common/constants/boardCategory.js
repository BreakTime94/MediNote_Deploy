/**
 * 게시판 카테고리 매핑 상수
 * 모든 게시판(공지사항, FAQ, QnA 등) 공통으로 사용.
 * DTO에서는 boardCategoryId만 내려주므로
 * 표시용 이름을 이 맵을 통해 해석한다.
 */

// 카테고리 ID → 이름 매핑
export const BOARD_CATEGORY_MAP = {
    // 상위 카테고리
    1: "공지사항",
    2: "QnA",
    3: "FAQ",

    // 공지사항 하위
    4: "업데이트",
    5: "점검안내",
    6: "이벤트",

    // QnA 하위
    9: "사이트 이용문의",
    10: "회원/계정",
    11: "오류신고",
    12: "기타",
};

/**
 * 상위-하위 관계까지 포함한 트리 구조
 */
export const BOARD_CATEGORY_TREE = {
    1: { name: "공지사항", parent: null },
    2: { name: "QnA", parent: null },
    3: { name: "FAQ", parent: null },
    4: { name: "업데이트", parent: 1 },
    5: { name: "점검안내", parent: 1 },
    6: { name: "이벤트", parent: 1 },
    9: { name: "사이트 이용문의", parent: 2 },
    10: { name: "회원/계정", parent: 2 },
    11: { name: "오류신고", parent: 2 },
    12: { name: "기타", parent: 2 },
};

/**
 * 특정 카테고리 ID로부터 이름을 구함
 * @param {number} id - boardCategoryId
 * @param {boolean} includeParent - 상위 카테고리 포함 여부 (ex: "QnA > 회원/계정")
 */
export function getCategoryName(id, includeParent = false) {
    const node = BOARD_CATEGORY_TREE[id];
    if (!node) return "";

    if (!includeParent || !node.parent) return node.name;

    const parent = BOARD_CATEGORY_TREE[node.parent];
    return parent ? `${parent.name} > ${node.name}` : node.name;
}
