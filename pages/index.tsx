import React, { useState } from "react";
import Router from "next/router";
import styled from "styled-components";
import withAuth from "hoc/withAuth";
import PopupCreateParty from "components/PopupCreateParty";
const Index = () => {
  const [useShowPopup, setShowPopup] = useState(false);
  return (
    <Container>
      <PopupCreateParty
        visible={useShowPopup}
        setVisible={setShowPopup}
        redirect={true}
      />
      <BoxMenu onClick={() => Router.push("/list")}>ปาร์ตี้ทั้งหมด</BoxMenu>
      <BoxMenu onClick={() => setShowPopup(true)}>สร้างปาร์ตี้</BoxMenu>
      <BoxMenu onClick={() => Router.push("/dashboard")}>จัดการปาร์ตี้</BoxMenu>
    </Container>
  );
};

export default withAuth(Index);
const Container = styled.div`
  position: relative;
  height: 100vh;
  margin: 0 auto;
  width: 100%;
  max-width: 500px;
  @media only screen and (max-width: 768px) {
    max-width: 300px;
  }
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
const BoxMenu = styled.div`
  position: relative;
  background: #fff;
  border-radius: 24px;
  margin-right: 16px;
  width: 400px;
  height: 100px;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:last-child {
    margin-right: 0px;
  }
`;
