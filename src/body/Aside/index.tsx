import React from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { asideList, ROUTERPATH } from "../contants";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = asideList.map((aside) => {
  return {
    key: aside,
    label: aside,
  };
});

export const Aside: React.FC = () => {
  const navigate = useNavigate();

  const nowSecKey =
    (sessionStorage.getItem("secondKeys") as string) || "推荐歌单";
  const defaultMenu = sessionStorage.getItem("subMenu") as string;

  const onClick: MenuProps["onClick"] = (e) => {
    sessionStorage.setItem("subMenu", e.keyPath[1]);
    sessionStorage.setItem("secondKeys", e.key);
    navigate(`${ROUTERPATH[e.key]}`);
  };

  return (
    <AntMenu
      theme={"light"}
      onClick={onClick}
      defaultOpenKeys={[defaultMenu]}
      mode="inline"
      items={items}
      selectedKeys={[nowSecKey]}
    />
  );
};

const AntMenu = styled(Menu)`
  width: 20rem;
  height: 80%;
  background: rgb(250, 250, 252);
`;

const Arrow = styled.div`
  position: absolute;
  width: 100%;
  height: 5rem;
  bottom: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
