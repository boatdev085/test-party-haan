import React from "react";
import styled from "styled-components";
import Router from "next/router";
import { Form, Input, Button, Checkbox, message } from "antd";
import { handleFetch } from "utils/index";
import ButtonBack from "components/ButtonBack";
const Register = () => {
  const handleSubmit = async (input) => {
    const { username, password, policy } = input;
    if (!username || !password || !policy) {
      message.error("กรุณากรอกรายละเอียดให้ครบถ้วน");
      return;
    }
    try {
      const response = await handleFetch("/api/register", {
        method: "POST",
        body: input,
      });
      if (response && response.code === 200) {
        const { data } = response;
        await localStorage.setItem("token", data.token || "");
        Router.push("/");
      }
    } catch (e) {
      message.error("ไม่สามารถทำรายการได้ กรุณาติดต่อเจ้าหน้าที่");
    }
  };
  return (
    <Container>
      <ButtonBack />
      <h1>สร้างปัญชีผู้ใช้</h1>
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
          <Form.Item
            name="policy"
            rules={[{ required: true, message: "กรุณากดยอมรับเงื่อนไข" }]}
            valuePropName="checked"
            style={{ marginBottom: "4px" }}
          >
            <Checkbox>
              <span className="text-checkbox">
                ฉันยอมรับเงื่อนไขและข้อตกลงเกี่ยวกับการใช้งาน PartyHaan
                รวมถึงนโยบายความเป็นส่วนตัว
              </span>
            </Checkbox>
          </Form.Item>
          <Form.Item name="newfeed" valuePropName="checked">
            <Checkbox>
              <span className="text-checkbox">
                ฉันต้องการรับข่าวสารเกี่ยวกับโปรโมชั่นจาก PartyHaan
              </span>
            </Checkbox>
          </Form.Item>
          <Form.Item style={{ textAlign: "center" }}>
            <Button type="primary" htmlType="submit">
              เข้าสู่ระบบ
            </Button>
          </Form.Item>
        </Form>
      </WrapperRegister>
    </Container>
  );
};

export default Register;
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
const WrapperRegister = styled.div`
  margin: 24px;
  position: relative;
  background-color: #ffffff;
  border: 1px solid gray;
  border-radius: 6px;
  max-width: 500px;
  @media only screen and (max-width: 768px) {
    max-width: 300px;
  }
  width: 100%;
  padding: 24px;
`;
