import React, { useEffect } from "react";
import useSocket from "components/plogging/functions/useSocket";
import CommonButton from "components/common/CommonButton";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as P from "store/plogging-slice";
import * as Crewping from "store/crewping-slice";

const Test = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div>
      <button
        onClick={() => {
          dispatch(Crewping.clear());
          dispatch(P.clear());
          dispatch(Crewping.setRoomId("박주성"));
          dispatch(Crewping.setCharge(true));
          dispatch(P.setBeforeCrewping(true));
          navigate("/plogging");
        }}
      >
        크루핑
      </button>
      <button
        onClick={() => {
          navigate("/test2");
        }}
      >
        소켓 연결 테스트
      </button>
    </div>
  );
};

export default Test;
