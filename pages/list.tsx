import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";
import withAuth from "hoc/withAuth";
import TitlePage from "components/TitlePage";
import { handleFetch } from "utils/index";
import { Card, Col, Row, Empty, Button, message } from "antd";
import PopupCreateParty from "components/PopupCreateParty";
const HOSTIMAGE = "http://localhost:8080/";
const List = () => {
  const [useData, setData] = useState({ load: true, data: [] });
  const [useLoadJoinParty, setLoadJoinParty] = useState("");
  const [useShowPopup, setShowPopup] = useState(false);
  const handleFetchData = async () => {
    setData({ load: true, data: [] });
    const getToken = localStorage.getItem("token");
    const response = await handleFetch(`/api/list?token=${getToken}`, {
      method: "GET",
    });
    if (response && response.data) {
      setData({ load: false, data: response.data || [] });
    } else {
      setData({ load: false, data: [] });
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
        handleFetchData();
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
    handleFetchData();
  }, []);
  return (
    <Container>
      <TitlePage title="ปาร์ตี้ทั้งหมด" pathBack="/" />
      <WrapperCard>
        <Row>
          {useData.data.map((item: any) => {
            return (
              <Col
                span={11}
                style={{ margin: "16px 16px 0 0" }}
                key={item.party_name + item.id}
              >
                <Link href={`/detail/${item.id}`}>
                  <Card
                    style={{ margin: "16px 16px 0 0" }}
                    hoverable
                    actions={[
                      <Button
                        loading={item.id === useLoadJoinParty}
                        onClick={() => handleJoinParty(item.id)}
                        disabled={
                          handleShowButtonJoin(
                            item.people_number,
                            item.joins
                          ) === "party-full" || item.isJoin
                        }
                      >
                        {handleShowButtonJoin(
                          item.people_number,
                          item.joins
                        ) === "party-full"
                          ? "ปาร์ตี้เต็มแล้ว"
                          : item.isJoin
                          ? "คุณได้เข้าร่วมปาร์ตี้นี้แล้ว"
                          : "เข้าร่วมปาร์ตี้"}
                      </Button>,
                    ]}
                    cover={
                      <BoxImageCard>
                        <img
                          alt={(item.image && item.party_name) || ""}
                          src={HOSTIMAGE + item.image}
                        />
                      </BoxImageCard>
                    }
                  >
                    <WrapTitleAndPeople>
                      <h1>{item.party_name} </h1>
                      <h2>
                        จำนวน {item.joins.length}/{item.people_number} คน
                      </h2>
                    </WrapTitleAndPeople>
                  </Card>
                </Link>
              </Col>
            );
          })}
        </Row>
        {(useData.load && (
          <Row>
            <Col span={11} style={{ margin: "16px 16px 0 0" }}>
              <Card
                loading={true}
                hoverable
                actions={[]}
                cover={
                  <BoxImageCard>
                    <img alt="" src="" />
                  </BoxImageCard>
                }
              >
                loading
              </Card>
            </Col>
            <Col span={11}>
              <Card
                style={{ margin: "16px 16px 0 0" }}
                loading={true}
                hoverable
                actions={[]}
                cover={
                  <BoxImageCard>
                    <img alt="" src="" />
                  </BoxImageCard>
                }
              >
                loading
              </Card>
            </Col>
          </Row>
        )) ||
          (!useData.load && useData.data.length === 0 && (
            <Empty description={"ไม่พบข้อมูล"} />
          ))}
      </WrapperCard>
      <AddParty>
        <Button onClick={() => setShowPopup(true)}>สร้างปาร์ตี้</Button>
      </AddParty>
      <PopupCreateParty
        visible={useShowPopup}
        setVisible={setShowPopup}
        fetchData={handleFetchData}
      />
    </Container>
  );
};

export default withAuth(List);
const Container = styled.div`
  position: relative;
  height: 100vh;
  background: #f0f2f5;
`;
const WrapperCard = styled.div`
  margin: 24px;
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
const AddParty = styled.div`
  position: absolute;
  right: 16px;
  bottom: 16px;
`;
