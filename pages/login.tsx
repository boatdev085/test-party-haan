import React from "react";
import styled from "styled-components";
import Router from "next/router";
import { Form, Input, Button, message } from "antd";
import { handleFetch } from "utils/index";
const Login = () => {
  const handleSubmit = async (input) => {
    const { username, password } = input;
    if (!username || !password) {
      message.error("กรุณากรอกรายละเอียดให้ครบถ้วน");
      return;
    }
    try {
      const response = await handleFetch("/api/login", {
        method: "POST",
        body: input,
      });
      if (response && response.code === 200) {
        const { data } = response;
        await localStorage.setItem("token", data.token || "");
        Router.push("/");
      } else {
        message.error(response.message || "");
      }
    } catch (e) {
      message.error("ไม่สามารถทำรายการได้ กรุณาติดต่อเจ้าหน้าที่");
    }
  };
  return (
    <Container>
      <h1>เข้าสู่ระบบ</h1>
      <WrapperRegister>
        <Form name="basic" onFinish={handleSubmit}>
          <div className="form">
            <label>ชื่อผู้ใช้งาน</label>
            <Form.Item
              name="username"
              rules={[{ required: true, message: "กรุณากรอกชื่อผู้ใช้งาน" }]}
            >
              <Input />
            </Form.Item>
          </div>
          <div className="form">
            <label>รหัสผ่าน</label>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน" }]}
            >
              <Input type="password" />
            </Form.Item>
          </div>
          <Form.Item style={{ textAlign: "center" }}>
            <Button type="primary" htmlType="submit">
              เข้าสู่ระบบ
            </Button>
          </Form.Item>
        </Form>
      </WrapperRegister>
      <Button onClick={() => Router.push("/register")}>สร้างปัญชีผู้ใช้</Button>
    </Container>
  );
};

export default Login;
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const WrapperRegister = styled.div`
  margin: 24px;
  position: relative;
  background-color: #ffffff;
  border: 1px solid gray;
  border-radius: 6px;
  width: 100%;
  padding: 24px;
`;
