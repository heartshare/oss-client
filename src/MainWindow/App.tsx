import React, { useEffect, useState } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./App.scss";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import TheSidebar from "./components/TheSidebar";
import TransferList from "./components/TransferList";
import { Direction, Page, Platform } from "./types";
import Bucket from "./components/Bucket";
import TransferDone from "./components/TransferDone";
import Setting from "./components/Setting";
import {
  getBgOffset,
  getThemeColor,
  platform,
  ThemeColor
} from "./helper/utils";
import Services from "./components/Services";
import {
  closeMainApp,
  getBuckets,
  initOss,
  maximizeMainWindow,
  minimizeMainWindow
} from "./ipc";
import { AppStore } from "../main/store/apps";

library.add(fas);

function App() {
  const [themeColor, setThemeColor] = useState<ThemeColor>(getThemeColor());
  const [bgOffset, setBgOffset] = useState<string>(getBgOffset());
  const [bucketLoading, setBucketLoading] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<Page>(Page.bucket);
  const [activeBucket, setActiveBucket] = useState<string>("");
  const [bucketList, setBucketList] = useState<string[]>([]);
  const [direction, setDirection] = useState<Direction>(Direction.down);
  const tabChange = async (page: Page, bucket?: string) => {
    await setDirection(page < activePage ? Direction.down : Direction.up);
    setActivePage(page);
    if (bucket) {
      if (bucket === activeBucket) return;
      setBucketLoading(true);
      setActiveBucket(bucket);
    }
  };
  const onLoadedBucket = () => {
    setBucketLoading(false);
  };
  const onOssActive = async (s: AppStore) => {
    await initOss(s._id);
    const buckets = await getBuckets();
    setBucketList(buckets);
  };

  useEffect(() => {
    setThemeColor(getThemeColor());
    setBgOffset(getBgOffset());
  }, [activePage]);

  // 相当于初始化流程
  useEffect(() => {
    (async () => {
      // 设置活动 oss 配置
      await initOss();
      // 获取 oss 中 bucket 列表，并选中活动项
      const buckets = await getBuckets();
      console.log(buckets);
      setBucketList(buckets);
      if (buckets.length > 0) {
        await tabChange(Page.bucket, buckets[0]);
      } else {
        setActivePage(Page.apps);
      }
    })();
  }, []);

  return (
    <div
      className="App"
      style={{
        background: themeColor.appColor
      }}
    >
      <div className="drag-area" />
      {platform === Platform.windows && (
        <div className="app-button">
          <FontAwesomeIcon
            className="icon"
            icon="minus-circle"
            onClick={minimizeMainWindow}
          />
          <FontAwesomeIcon
            className="icon"
            icon="plus-circle"
            onClick={maximizeMainWindow}
          />
          <FontAwesomeIcon
            className="icon"
            icon="times-circle"
            onClick={closeMainApp}
          />
        </div>
      )}
      <TheSidebar
        bucketLoading={bucketLoading}
        bucketList={bucketList}
        activeBucket={activeBucket}
        activePage={activePage}
        tabChange={tabChange}
        color={themeColor.asideColor}
      />
      <TransitionGroup mode="in-out">
        {Page.bucket === activePage && (
          <CSSTransition
            key={Page.bucket}
            addEndListener={(node, done) => {
              node.addEventListener("transitionend", done, false);
            }}
            classNames={direction}
          >
            <section
              className="main-wrapper"
              style={{ backgroundPosition: bgOffset }}
            >
              <Bucket bucketName={activeBucket} onLoadedBucket={onLoadedBucket} />
            </section>
          </CSSTransition>
        )}
        {Page.transferList === activePage && (
          <CSSTransition
            key={Page.transferList}
            addEndListener={(node, done) => {
              node.addEventListener("transitionend", done, false);
            }}
            classNames={direction}
          >
            <section
              className="main-wrapper"
              style={{ backgroundPosition: bgOffset }}
            >
              <TransferList />
            </section>
          </CSSTransition>
        )}
        {Page.transferDone === activePage && (
          <CSSTransition
            key={Page.transferDone}
            addEndListener={(node, done) => {
              node.addEventListener("transitionend", done, false);
            }}
            classNames={direction}
          >
            <section
              className="main-wrapper"
              style={{ backgroundPosition: bgOffset }}
            >
              <TransferDone />
            </section>
          </CSSTransition>
        )}
        {Page.setting === activePage && (
          <CSSTransition
            key={Page.setting}
            addEndListener={(node, done) => {
              node.addEventListener("transitionend", done, false);
            }}
            classNames={direction}
          >
            <section
              className="main-wrapper"
              style={{ backgroundPosition: bgOffset }}
            >
              <Setting />
            </section>
          </CSSTransition>
        )}
        {Page.apps === activePage && (
          <CSSTransition
            key={Page.apps}
            addEndListener={(node, done) => {
              node.addEventListener("transitionend", done, false);
            }}
            classNames={direction}
          >
            <section
              className="main-wrapper"
              style={{ backgroundPosition: bgOffset }}
            >
              <Services onOssActive={onOssActive} />
            </section>
          </CSSTransition>
        )}
      </TransitionGroup>
    </div>
  );
}

export default App;
