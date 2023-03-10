import dayjs from "dayjs";
import styled from "@emotion/styled";

import { useRecent } from "./utils";
import { CardList } from "components/CardList";
import SongsItem from "components/SongsItem";

const RESETDATA = { data: { total: 0, list: [] } };
const DATEFORMAT = "YYYY-MM-DD HH:mm:ss";

export const Recent: React.FC = () => {
  const { data: { data: { total, list } } = RESETDATA } = useRecent();

  // console.log("list", list);

  // 处理为 CardList 需要的数据格式
  const handelList = () => {
    return list.map((ele: any) => {
      return ele.data;
    });
  };

  // console.log("handelList", handelList());

  // 自定义渲染函数
  const renderFunc = (value: any) => {
    const { ar } = value;
    // const { ar, publishTime } = value;
    const authAndtime = ar.map((ele: any, index: number) => {
      if (index === 0) {
        return ele.name + "  ";
      }
      return "/" + "  " + ele.name;
    });

    // const formatTime = dayjs(publishTime).format(DATEFORMAT);

    // authAndtime.push(<span>{formatTime}</span>);
    return <Container>{authAndtime}</Container>;
  };

  const manyConfig = {
    renderFunc: renderFunc,
    // color: ["rgb(167, 83, 90)", "rgb(167, 83, 90)"],
    // background: ["rgb(240, 161, 168)", "rgb(241, 147, 156)"],
  };

  return (
    <CardList dataSource={handelList()} many={manyConfig}>
      <SongsItem />
    </CardList>
  );
};

const Container = styled.div`
  width: 50%;
  display: flex;
  justify-content: space-between;
`;
