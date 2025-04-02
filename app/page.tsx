import {
  Categories,
  Container,
  SortPopup,
  Title,
} from '../components/shared';

export default function Home() {
  return (
    <>
      <Container className="mt-10">
        <Title text="Pizzas" size="lg" className="font-extrabold" />
        <Categories />
        <SortPopup />
      </Container>
    </>
  );
}
