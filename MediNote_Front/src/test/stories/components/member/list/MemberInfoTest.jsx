import React, {useEffect, useState} from "react";
import api from "@/test/stories/components/member/axiosInterceptor.js";

export default function MemberInfoTest() {
  const [memberInfo, setMemberInfo] = useState(null);

  useEffect(()=> {
    api.get("/member/list/info")
        .then((resp) => {
          console.log(resp.data.status);
          console.log(resp.data.memberInfoList);
          setMemberInfo(resp.data.memberInfoList);
        })
  },[])

  return(
      <div>
        {memberInfo && memberInfo.length > 0 &&
            (<ul className={"flex flex-col border-1"}>
              {memberInfo.map((member) =>(
                <li key={member.id}>
                  <div>ID: {member.id}</div>
                  <div>Role: {member.role}</div>
                  <div>nickname: {member.nickname}</div>
                </li>
              ))}
            </ul>)}
      </div>
  );
}