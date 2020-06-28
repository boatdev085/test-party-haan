import React, { useState, useEffect } from "react";
import styled from "styled-components";
import withAuth from "hoc/withAuth";
import TitlePage from "components/TitlePage";
import { handleFetch } from "utils/index";
import { Table, Button, message, Tag } from "antd";
import PopupCreateParty from "components/PopupCreateParty";
const HOSTIMAGE = "http://localhost:8080/";
const Dashboard = () => {
  const [useData, setData] = useState({ load: true, data: [] });
  const [useFormEdit, setFormEdit] = useState<{
    id: string;
    partyName: string;
    peopleNumber: number;
    description: string;
    fileList: any[];
    fileListOld: any[];
  }>({
    id: "",
    partyName: "",
    peopleNumber: null,
    description: "",
    fileListOld: [],
    fileList: [],
  });
  const [useShowPopup, setShowPopup] = useState(false);
  const handleFetchData = async () => {
    setData({ load: true, data: [] });
    const getToken = localStorage.getItem("token");
    const response = await handleFetch(
      `/api/list/dashboard?token=${getToken}`,
      {
        method: "GET",
      }
    );
    if (response && response.data) {
      setData({ load: false, data: response.data || [] });
    } else {
      setData({ load: false, data: [] });
    }
  };
  const handleEdit = (item) => {
    setFormEdit({
      id: item.id,
      partyName: item.party_name,
      peopleNumber: item.people_number,
      description: item.description,
      fileListOld: [HOSTIMAGE + item.image],
      fileList: [],
    });
    setShowPopup(true);
  };
  const handleDelete = async (partyId) => {
    const getToken = localStorage.getItem("token");
    const response = await handleFetch(
      `/api/list?id=${partyId}&token=${getToken}`,
      { method: "DELETE" }
    );
    if (response && response.code === 200) {
      message.success("ลบปาร์ตี้เรียบร้อย");
      setTimeout(() => {
        handleFetchData();
      }, 500);
    } else {
      message.success(response.message);
    }
  };
  useEffect(() => {
    handleFetchData();
  }, []);
  const columns = [
    {
      title: "Party Name",
      dataIndex: "party_name",
      key: "party_name",
    },
    {
      title: "People Number",
      dataIndex: "people_number",
      key: "people_number",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "user join",
      dataIndex: "joins",
      key: "joins",
      render: (joins) => {
        return (
          <>
            {joins.map((join) => (
              <Tag color="blue" key={join.username}>
                {join.username}
              </Tag>
            ))}
          </>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (item) => [
        <Button
          type="primary"
          style={{ marginRight: "8px" }}
          onClick={() => handleEdit(item)}
        >
          edit
        </Button>,
        <Button type="primary" danger onClick={() => handleDelete(item.id)}>
          Delete
        </Button>,
      ],
    },
  ];
  return (
    <Container>
      <TitlePage title="จัดการปาร์ตี้ของฉัน" pathBack="/" />
      <WrapperCard>
        <Table
          loading={useData.load}
          dataSource={useData.data}
          columns={columns}
        />
      </WrapperCard>
      <AddParty>
        <Button onClick={() => setShowPopup(true)}>สร้างปาร์ตี้</Button>
      </AddParty>
      <PopupCreateParty
        visible={useShowPopup}
        setVisible={setShowPopup}
        fetchData={handleFetchData}
        formEdit={useFormEdit}
      />
    </Container>
  );
};

export default withAuth(Dashboard);
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
