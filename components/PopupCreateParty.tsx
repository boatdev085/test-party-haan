import { useState, useEffect } from "react";
import styled from "styled-components";
import { Modal, Button, Input, InputNumber, message, Upload } from "antd";
import { handleFetch } from "utils/index";
import Router from "next/router";
interface PopupCreatePartyProps {
  visible: boolean;
  setVisible: Function;
  redirect?: boolean;
  fetchData?: Function;
  formEdit?: {
    id: string;
    partyName: string;
    peopleNumber: number | null;
    description: string;
    fileList: any[];
    fileListOld: string[];
  };
}
const initialForm = {
  partyName: "",
  peopleNumber: null,
  description: "",
  fileList: [],
};
const PopupCreateParty = ({
  visible,
  setVisible,
  redirect,
  fetchData,
  formEdit,
}: PopupCreatePartyProps) => {
  const [useLoading, setLoading] = useState(false);
  const [useForm, setForm] = useState({ ...formEdit } || initialForm);
  const [useValidate, setValidate] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    const { partyName, peopleNumber } = useForm;
    if (!partyName || !peopleNumber) {
      setValidate(true);
      setLoading(false);
      message.error("กรุณากรอกรายละเอียดให้ครบถ้วน");
      return;
    }
    const getToken = localStorage.getItem("token");
    const newMapImage = useForm.fileList.map((item) => item.thumbUrl);
    if (formEdit.id) {
      const response = await handleFetch("/api/list/edit", {
        method: "POST",
        body: {
          partyId: formEdit.id,
          token: getToken,
          ...useForm,
          image: newMapImage,
          imageOld: formEdit.fileListOld,
        },
      });
      if (response && response.code === 200) {
        handleCancel();
        fetchData();
        message.success("ทำรายการเรียบร้อย");
      } else {
        setLoading(false);
        message.error(response.message);
      }
    } else {
      const response = await handleFetch("/api/list", {
        method: "POST",
        body: { token: getToken, ...useForm, image: newMapImage },
      });
      if (response && response.data && response.data.id) {
        if (redirect) {
          Router.push(`/detail/${response.data.id}`);
          return;
        } else {
          if (fetchData) {
            fetchData();
          }
        }
        handleCancel();
        message.success("ทำรายการเรียบร้อย");
      } else {
        setLoading(false);
        message.error(response.message);
      }
    }
  };
  const handleSetForm = (e) => {
    setForm({ ...useForm, [e.target.id]: e.target.value });
  };
  const handleSetPeopleNumber = (number) => {
    setForm({ ...useForm, peopleNumber: number });
  };
  const handleCancel = () => {
    setVisible(false);
    setForm(initialForm);
  };
  const onChangePicture = ({ fileList: newFileList }) => {
    setForm({ ...useForm, fileList: newFileList });
  };

  const onPreview = async (file) => {
    let src;
    if (typeof file === "string") {
      src = file;
    } else {
      src = file.url;
    }
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };
  useEffect(() => {
    if (formEdit) {
      setForm(formEdit);
    }
  }, [formEdit]);
  const { partyName, peopleNumber, description, fileList } = useForm;
  return (
    <Modal
      title={formEdit.id ? "แก้ไขปาร์ตี้" : "สร้างปาร์ตี้"}
      visible={visible}
      footer={[
        <Button
          key="submit"
          style={{ width: "100%", textAlign: "center" }}
          loading={useLoading}
          onClick={handleSubmit}
        >
          {formEdit.id ? "แก้ไขปาร์ตี้" : "สร้างปาร์ตี้"}
        </Button>,
      ]}
      onCancel={handleCancel}
    >
      <FormInput>
        <label>ชื่อปาร์ตี้</label>
        <Input
          id="partyName"
          value={partyName}
          onChange={handleSetForm}
          style={{
            border: (useValidate && !partyName && "1px solid red") || "",
          }}
        />
      </FormInput>
      <FormInput>
        <label>จำนวนคนที่ขาด</label>
        <InputNumber
          type="number"
          value={peopleNumber}
          onChange={(number) => handleSetPeopleNumber(number)}
          style={{
            width: "100%",
            border: (useValidate && !peopleNumber && "1px solid red") || "",
          }}
        />
      </FormInput>
      <FormInput>
        <label>รายละเอียดเพิ่มเติม</label>
        <Input id="description" value={description} onChange={handleSetForm} />
      </FormInput>
      <FormInput>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={onChangePicture}
          onPreview={onPreview}
        >
          {useForm.fileList.length > 0
            ? null
            : formEdit.fileListOld &&
              formEdit.fileListOld.length > 0 && (
                <img src={formEdit.fileListOld[0]} alt="" />
              )}
          {formEdit.id ? null : fileList.length < 1 ? "+ Upload" : null}
        </Upload>
      </FormInput>
    </Modal>
  );
};
export default PopupCreateParty;
const FormInput = styled.div`
  position: relative;
  margin-bottom: 16px;
  label {
    margin-bottom: 8px;
  }
`;
