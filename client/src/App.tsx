import React, { useState, useEffect, useRef } from "react";
import style from "styles/css/App.module.css";
import NavBar from "components/common/NavBar";
import RouteComponent from "pages/lib/index";
import getGPS from "components/plogging/functions/getGPS";
import { ploggingType } from "types/ploggingTypes";
import Swal from "sweetalert2";

import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { rootState } from "store/store";
import { setWindowHeight, setWindowWidth } from "store/window-slice";
import * as P from "store/plogging-slice";

// 부드러운 애니메이션 (https://animate.style/)
import "animate.css";

const intervalTime = 2;

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const interval = useRef<NodeJS.Timeout | null>(null);
  const worker = new Worker(new URL(`workers/worker.js`, import.meta.url));
  const windowHeight = useSelector<rootState, number>((state) => {
    return state.window.height;
  });
  const windowWidth = useSelector<rootState, number>((state) => {
    return state.window.width;
  });
  const useTimer = useSelector<rootState, boolean>((state) => {
    return state.plogging.ploggingType != "none" && !state.plogging.isEnd;
  });
  const second = useSelector<rootState, number>((state) => {
    return state.plogging.second;
  });
  const minute = useSelector<rootState, number>((state) => {
    return state.plogging.minute;
  });
  const nowType = useSelector<rootState, ploggingType>((state) => {
    return state.plogging.ploggingType;
  });
  const volTakePicture = useSelector<rootState, boolean>((state) => {
    return state.plogging.volTakePicture;
  });

  const [onSearch, setOnSearch] = useState<boolean>(false);

  useEffect(() => {
    function handleResize() {
      dispatch(setWindowHeight(window.innerHeight));
      dispatch(setWindowWidth(window.innerWidth));
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (useTimer) {
      getGPS()
        .then((response) => {
          const { latitude, longitude } = response.coords;
          dispatch(P.addPath({ latitude: latitude, longitude: longitude }));

          function addTime() {
            interval.current = setInterval(() => {
              dispatch(P.addTime());
            }, 1000);
          }
          if (window.Worker) {
            worker.postMessage("start");
            worker.onmessage = (event) => {
              if (event.data === "tick") {
                dispatch(P.addTime());
              }
            };
          } else {
            addTime();
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      if (interval.current) {
        clearInterval(interval.current);
      }
      worker.terminate();
    }

    return () => {
      worker.terminate();
    };
  }, [useTimer]);

  useEffect(() => {
    if (useTimer && second % intervalTime === 0) {
      setOnSearch(true);
    }
  }, [second]);

  useEffect(() => {
    if (nowType === "VOL" && minute >= 30 && !volTakePicture) {
      Swal.fire({
        icon: "info",
        title: "중간 사진 촬영",
        html: "<div>지금까지 플로깅한 봉투<br/>사진을 찍어주세요.</div>",
        confirmButtonText: "확인",
        confirmButtonColor: "#2CD261",
        didClose: () => {
          dispatch(P.setVolTakePicture(true));
          if (location.pathname !== "/plogging") {
            navigate("/plogging");
          }
        },
      });
    }
  }, [minute]);

  useEffect(() => {
    if (useTimer && onSearch) {
      getGPS()
        .then((response) => {
          const { latitude, longitude } = response.coords;
          dispatch(P.addPath({ latitude: latitude, longitude: longitude }));
          setOnSearch(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [onSearch]);

  return (
    <div
      className={style.App}
      style={{ height: `${windowHeight}px`, width: `${windowWidth}px` }}
    >
      <RouteComponent />
      <div className={style.navBar}>
        <NavBar />
      </div>
    </div>
  );
}

export default App;
