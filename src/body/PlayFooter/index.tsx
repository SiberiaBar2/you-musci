import {
  GoEnd,
  GoStart,
  Play,
  PauseOne,
  // Like,
  ShareOne,
  Acoustic,
  PlayOnce,
  LoopOnce,
  PlayCycle,
  ShuffleOne,
  ListBottom,
  VolumeSmall,
  VolumeMute,
} from "@icon-park/react";
import { useMemo, useReducer, useRef, useState } from "react";
import Drawer from "./Drawer";
import { Slider, Tooltip, message } from "antd";
import { useMount, useInterVal } from "hooks";
import { useSongIdSearchParam } from "./comutils";
import { Like } from "./like";
import { useSongs } from "./useSongs";
import {
  Container,
  DivOne,
  DivTwo,
  DivThree,
  VolumeWrap,
  Progress,
} from "./style";

enum PlayType {
  dan,
  shun,
  liexun,
  sui,
}

export interface DrawProps {
  picUrl: string;
  time: string;
  musicRef: React.MutableRefObject<any>;
  lyric: string;
  songId?: number | undefined;
}

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case PlayType.dan:
      return { type: PlayType.shun };
    case PlayType.shun:
      return { type: PlayType.liexun };
    case PlayType.liexun:
      return { type: PlayType.sui };
    case PlayType.sui:
      return { type: PlayType.dan };
    default:
      return { type: PlayType.liexun };
  }
};

export const PlayFooter = () => {
  const [play, setPlay] = useState(false);
  const [open, setOpen] = useState(true);
  const [type, dispatch] = useReducer(reducer, { type: PlayType.liexun });

  const [volume, setVolume] = useState(50);
  const [duration, setDuration] = useState(0);

  const drawerRef: React.MutableRefObject<any> = useRef();
  const musicRef: React.MutableRefObject<any> = useRef();
  const [time, setTime] = useState("");

  const [param, setParam] = useSongIdSearchParam();
  const songId = param.songId;

  const { song, prevornext } = param;

  const playMusic = (play: boolean) => {
    play && data[0]?.url ? musicRef.current?.play() : musicRef.current?.pause();
    setPlay(play);
  };

  // 切歌时重置播放进度
  useMemo(() => {
    setDuration(0);
  }, [songId]);

  // 初始音量
  useMount(() => {
    if (musicRef.current) musicRef.current.volume = volume * 0.01;
  });

  const { data, name, picUrl, authName, lyric } = useSongs(songId);

  const changeOpen = (open: boolean) => {
    setOpen(open);
    if (!open) {
      musicRef.current.volume = 0;
      setVolume(0);
      return;
    }
  };

  const handeChangeType = (type: number) => {
    dispatch({ type });
  };

  const goPrevorNext = (key: string) => {
    let togo = key === "prev" ? Number(song) - 1 : Number(song) + 1;

    const getSongsId = prevornext.split(",");
    const min = 0;
    const max = getSongsId?.length - 1;

    if (togo < min) {
      togo = 0;
      message.warning("不能再往上了哦！", 2);
      return;
    }
    if (togo > max) {
      togo = max;
      message.warning("到底再也没有了！", 2);
      return;
    }

    setParam({
      ...param,
      song: togo,
      songId: getSongsId[togo],
    });

    // 下一首 、上一首切换、播放 success
    setTimeout(() => {
      playMusic(true);
    }, 2000);
  };
  const getElement = (type: number) => {
    switch (type) {
      case PlayType.dan:
        return (
          <PlayOnce
            title="单曲播放"
            onClick={() => handeChangeType(PlayType.dan)}
            theme="outline"
            size="24"
            fill="rgb(237, 195, 194)"
          />
        );
      case PlayType.shun:
        return (
          <LoopOnce
            title="顺序播放"
            onClick={() => handeChangeType(PlayType.shun)}
            theme="outline"
            size="24"
            fill="rgb(237, 195, 194)"
          />
        );
      case PlayType.liexun:
        return (
          <PlayCycle
            title="列表循环"
            onClick={() => handeChangeType(PlayType.liexun)}
            theme="outline"
            size="24"
            fill="rgb(237, 195, 194)"
          />
        );
      case PlayType.sui:
        return (
          <ShuffleOne
            title="随机播放"
            onClick={() => handeChangeType(PlayType.sui)}
            theme="outline"
            size="24"
            fill="rgb(237, 195, 194)"
          />
        );

      default:
        break;
    }
  };

  const musicTime = () => {
    const audio = musicRef.current;
    const timeCount = Math.floor(audio.currentTime); // 总时长秒数
    const minutes = parseInt(audio.duration / 60 + ""); // 获取总时长分钟
    const seconds = parseInt((audio.duration % 60) + ""); // 获取总时长秒数
    const timeMinute = Math.floor(timeCount / 60); // 当前播放进度 分
    const timeDisplay = Math.floor(audio.currentTime % 60); // 当前播放进度 秒
    const secondsTime = timeDisplay < 10 ? "0" + timeDisplay : timeDisplay; // 秒

    const t = timeMinute < 10 ? "0" + timeMinute : timeMinute;
    const m = minutes < 10 ? "0" + minutes : minutes;
    const s = seconds < 10 ? "0" + seconds : seconds;
    return [t + ":" + secondsTime, "/", m + ":" + s] as const;
  };

  // 随着音乐播放，进度条自动行进
  useInterVal(() => {
    // 这里 && musicRef.current 之后播放就稳定了
    // 不会再出现切歌后进度条在走，也显示播放图标，但音频时而播放时而不播放的问题
    // 做到了同步
    // 但同时也必须配合2.5s
    if (play && musicRef.current && data[0].url) {
      setDuration((dura) => dura + 1);
      // 重置播放状态
      if (duration >= musicRef.current?.duration) {
        setPlay(false);
      }
    }
  }, 1000);

  const audioTimeUpdate = () => {
    const { currentTime = 0 } = musicRef.current;
    const minutes = parseInt(currentTime / 60 + "");
    const seconds = parseInt((currentTime % 60) + "");

    const timeStr =
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds);

    setTime(timeStr);
  };

  const songAndAuth = () => {
    return name + "-" + authName;
  };

  const DrawerConfig: DrawProps = {
    picUrl: picUrl,
    time: time,
    musicRef: musicRef,
    lyric: lyric,
    songId: songId,
  };

  return (
    <Container>
      <Progress>
        <Slider
          value={duration}
          onChange={(dura) => {
            setDuration(dura);
            playMusic(true);
            musicRef.current.currentTime = dura;
          }}
          tooltip={{ open: false }}
          min={0}
          max={musicRef.current?.duration}
          step={1}
          style={{ height: "85%", bottom: "none" }}
        />
      </Progress>
      <DivOne>
        {picUrl ? (
          <div onClick={() => drawerRef.current.changeVisiable()}>
            <img src={picUrl} alt="" />
          </div>
        ) : (
          <div onClick={() => drawerRef.current.changeVisiable()}>
            <p>music</p>
          </div>
        )}
        <div>
          <Tooltip title={songAndAuth()}>
            <div>
              {songAndAuth().length > 16
                ? songAndAuth().slice(0, 16) + "..."
                : songAndAuth()}
            </div>
          </Tooltip>
          {data[0] &&
            musicTime().map((time, index) => {
              return (
                <span key={index} style={{ margin: "2px" }}>
                  {time}
                </span>
              );
            })}
        </div>
      </DivOne>
      <DivTwo>
        <GoStart
          onClick={() => goPrevorNext("prev")}
          theme="outline"
          size="24"
          fill="rgb(237, 195, 194)"
          style={{ cursor: "pointer" }}
        />
        {!play ? (
          <Play
            onClick={() => playMusic(true)}
            theme="filled"
            size="24"
            fill="rgb(237, 195, 194)"
            style={{ cursor: "pointer" }}
          />
        ) : (
          <PauseOne
            onClick={() => playMusic(false)}
            theme="filled"
            size="24"
            fill="rgb(192, 44, 56)"
            style={{ cursor: "pointer" }}
          />
        )}
        <GoEnd
          onClick={() => goPrevorNext("next")}
          theme="outline"
          size="24"
          fill="rgb(237, 195, 194)"
          style={{ cursor: "pointer" }}
        />
        {/* <Like songId={songId} /> */}
      </DivTwo>
      <DivThree>
        {/* <Acoustic
          title="音效"
          theme="outline"
          size="24"
          fill="rgb(237, 195, 194)"
        /> */}
        {/* {getElement(type.type)} */}
        {/* <ListBottom
          title="播放列表"
          theme="outline"
          size="24"
          fill="rgb(237, 195, 194)"
        /> */}
        <VolumeWrap>
          <div>
            <Slider
              vertical
              value={volume}
              onChange={(volume) => {
                setVolume(volume);
                musicRef.current.volume = volume * 0.01;
                volume && changeOpen(true);
              }}
              min={0}
              max={100}
              step={5}
              style={{ height: "85%", bottom: "none" }}
            />
          </div>
          {open && volume !== 0 ? (
            <VolumeSmall
              theme="outline"
              onClick={() => changeOpen(false)}
              size="24"
              fill="rgb(237, 195, 194)"
            />
          ) : (
            <VolumeMute
              theme="outline"
              onClick={() => changeOpen(true)}
              size="24"
              fill="rgb(237, 195, 194)"
            />
          )}
        </VolumeWrap>
      </DivThree>
      <audio
        controls
        ref={musicRef}
        src={data[0]?.url}
        style={{ display: "none" }}
        onTimeUpdate={audioTimeUpdate}
      />
      <Drawer ref={drawerRef} {...DrawerConfig} />
    </Container>
  );
};

PlayFooter.whyDidYouRender = true;
