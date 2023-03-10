import styled from "@emotion/styled";
import { Carousel } from "antd";
import {
  cookie,
  useBanner,
  useRecommend,
  useRecommendResource,
  useRecommendSongs,
} from "./utils";
import { AntCard } from "components/AntCard";
import { CardList } from "components";
import { arrAdds } from "utils/utils";

export const RecommendSongSheet: React.FC = () => {
  const { data: recommend } = useRecommend();
  const { data: banners } = useBanner();
  const { data: { data: { dailySongs = [] } = {} } = {} } = useRecommendSongs();
  const { data: { recommend: recommends = [] } = {} } = useRecommendResource();
  console.log("recommendSongs", dailySongs);
  console.log("recommend", recommend);

  console.log("推荐歌单", recommends);

  // const getNewList = recommend?.result.unshit()
  const onChange = (event: any) => {
    console.log(event);
  };

  // console.log("banners?.banners,", banners?.banners);

  // const adds = banners?.banners.map((ele: any) => {
  //   const getHttp = ele.imageUrl.slice(0, 4) as string;
  //   const getEnd = ele.imageUrl.slice(4) as string;
  //   const item = { ...ele };
  //   item.imageUrl = getHttp + "s" + getEnd;
  //   return item;

  //   // 修改数组中的对象属性，会引发浅拷贝（影响原 banners?.banners 数组 ），因此需要像24行起这样写
  //   // 结果导致，我们本来只想要添加一个s，却添加了多个s
  //   // ele.imageUrl = getHttp + "s" + getEnd;
  //   // return ele;
  // });

  return (
    <>
      <AntCarousel afterChange={(event) => onChange(event)} autoplay={true}>
        {arrAdds(banners?.banners, "imageUrl")?.map((item: any) => (
          <ImgContainer key={item.encodeId}>
            <Bannerimg src={item.imageUrl} alt="" />
          </ImgContainer>
        ))}
      </AntCarousel>
      <CardList
        grid={{ column: 4, lg: 4, xs: 2, xxl: 5 }}
        dataSource={arrAdds(cookie ? recommends : recommend?.result, "picUrl")}
      >
        <AntCard />
      </CardList>
    </>
  );
};

const AntCarousel = styled(Carousel)`
  width: 90%;
  height: 25rem;
  cursor: pointer;
  margin: 2rem;
`;

const ImgContainer = styled.div`
  width: 100%;
  height: 25rem;
`;

const Bannerimg = styled.img`
  width: 100%;
  height: 25rem;
`;
