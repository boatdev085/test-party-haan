import React, { useState, useEffect } from "react";
import styled from "styled-components";
import withAuth from "hoc/withAuth";
import TitlePage from "components/TitlePage";
import { useRouter } from "next/router";
import { Card, Button, message } from "antd";
import { handleFetch } from "utils/index";
const HOSTIMAGE = "http://localhost:8080/";
const List = () => {
  const { query } = useRouter();
  const [usePartyData, setPartyData] = useState<any>(null);
  const [useLoadJoinParty, setLoadJoinParty] = useState("");
  const fetchData = async () => {
    const getToken = localStorage.getItem("token");
    const response = await handleFetch(
      `/api/list/${query.id}?token=${getToken}`,
      { method: "GET" }
    );
    if (response && response.code === 200) {
      setPartyData(response.data || {});
    }
  };
  const handleJoinParty = async (partyId) => {
    setLoadJoinParty(partyId);
    const getToken = localStorage.getItem("token");
    const response = await handleFetch(`/api/list/join`, {
      method: "POST",
      body: { token: getToken, partyId },
    });
    if (response && response.code === 200) {
      message.success("เข้าร่วมปาร์ตี้เรียบร้อย");
      setLoadJoinParty("");
      setTimeout(() => {
        fetchData();
      }, 100);
    } else {
      message.error(response.message || "");
      setLoadJoinParty("");
    }
  };
  const handleShowButtonJoin = (peopleNumber, join) => {
    if (!join) return "";
    if (peopleNumber === join.length) return "party-full";
    return "";
  };
  useEffect(() => {
    fetchData();
  }, []);
  if (!usePartyData) return null;
  return (
    <Container>
      <WrapperBoxTitle>
        <TitlePage title={usePartyData.party_name || ""} pathBack="/list" />
      </WrapperBoxTitle>

      <WrapperDetail>
        <Card
          style={{ margin: "16px 16px 0 0" }}
          hoverable
          actions={[
            <Button
              loading={usePartyData.id === useLoadJoinParty}
              onClick={() => handleJoinParty(usePartyData.id)}
              disabled={
                handleShowButtonJoin(
                  usePartyData.people_number,
                  usePartyData.joins
                ) === "party-full" || usePartyData.isJoin
              }
            >
              {handleShowButtonJoin(
                usePartyData.people_number,
                usePartyData.joins
              ) === "party-full"
                ? "ปาร์ตี้เต็มแล้ว"
                : usePartyData.isJoin
                ? "คุณได้เข้าร่วมปาร์ตี้นี้แล้ว"
                : "เข้าร่วมปาร์ตี้"}
            </Button>,
          ]}
          cover={
            <BoxImageCard>
              <img
                alt={(usePartyData.image && usePartyData.party_name) || ""}
                src={HOSTIMAGE + usePartyData.image}
              />
            </BoxImageCard>
          }
        >
          <WrapTitleAndPeople>
            <h1>{usePartyData.party_name} </h1>
            <h2>
              จำนวน {usePartyData.joins.length}/{usePartyData.people_number} คน
            </h2>
          </WrapTitleAndPeople>
        </Card>
      </WrapperDetail>
    </Container>
  );
};

export default withAuth(List);
const Container = styled.div`
  position: relative;
  height: 100vh;
  margin: 0 auto;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const WrapperDetail = styled.div`
  position: relative;
  max-width: 500px;
  @media only screen and (max-width: 768px) {
    max-width: 300px;
  }
  width: 100%;
`;
const WrapperBoxTitle = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
`;
const BoxImageCard = styled.div`
  width: 100%;
  height: 200px;
  background: #f0f3f0;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const WrapTitleAndPeople = styled.div`
  position: relative;
  overflow: hidden;
  white-space: normal;
  h1 {
    border-bottom: 1px solid black;
    white-space: normal;
    display: block;
    display: -webkit-box;
    height: 43px;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  h2 {
    font-size: 14px;
    margin: 0;
  }
`;
