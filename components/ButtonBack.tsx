import Router from "next/router";
import styled from "styled-components";
import { ArrowLeftOutlined } from "@ant-design/icons";
interface ButtonBackProps {
  pathBack?: string;
}
const ButtonBack = ({ pathBack }: ButtonBackProps) => {
  const handleBack = () => {
    if (pathBack) {
      Router.push(pathBack);
    } else {
      Router.back();
    }
  };
  return (
    <Container onClick={handleBack}>
      <ArrowLeftOutlined />
    </Container>
  );
};
export default ButtonBack;
const Container = styled.div`
  position: absolute;
  left: 16px;
  top: 16px;
  cursor: pointer;
`;
