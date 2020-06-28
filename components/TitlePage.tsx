import styled from "styled-components";
import ButtonBack from "./ButtonBack";
interface TitlePageProps {
  title: string;
  pathBack?: string;
}
const TitlePage = ({ title, pathBack }: TitlePageProps) => {
  return (
    <Container>
      <ButtonBack pathBack={pathBack} />
      {title}
    </Container>
  );
};
export default TitlePage;
const Container = styled.div`
  position: relative;
  background: #fff;
  text-align: center;
  padding: 16px;
  margin-bottom: 16px;
  font-weight: bold;
`;
