import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { Dynamic } from "./Dynamic";
import { StaticFooter } from "./StaticFooter";
import { songsState } from "store/songs";

export const PlayFooter: React.FC = () => {
  const dispatch = useDispatch();
  const songsState = useSelector<
    RootState,
    Pick<songsState, "songId" | "song" | "prevornext">
  >((state) => state.songs);

  const { songId } = songsState;
  return (
    <>
      {songId ? (
        <Dynamic param={songsState} setParam={dispatch} />
      ) : (
        <StaticFooter />
      )}
    </>
  );
};
