import { Container, Title } from '../components/shared';
import { Filters } from '../components/shared/filters';
import { ProductsGroupList } from '../components/shared/products-group-list';
import { TopBar } from '../components/shared/top-bar';

export default function Home() {
  return (
    <>
      <Container className="mt-10">
        <Title text="Pizzas" size="lg" className="font-extrabold" />
      </Container>
      <TopBar />

      <Container className="mt-10 pb-14">
        <div className="flex gap-[80px]">
          {/*Filters*/}
          <div className="w-[250px]">
            <Filters />
          </div>
          {/*List of Products*/}
          <div className="flex-1">
            <div className="flex flex-col gap-16">
              <ProductsGroupList
                title={'Pizzas'}
                items={[
                  {
                    id: 1,
                    name: 'Hypnotica',
                    imageUrl: '/pizzas/hypnotica.png',
                    price: 13,
                    items: [
                      {
                        price: 13,
                      },
                    ],
                  },
                  {
                    id: 2,
                    name: 'Hypnotica',
                    imageUrl: '/pizzas/hypnotica.png',
                    price: 13,
                    items: [
                      {
                        price: 13,
                      },
                    ],
                  },
                  {
                    id: 3,
                    name: 'Hypnotica',
                    imageUrl: '/pizzas/hypnotica.png',
                    price: 13,
                    items: [
                      {
                        price: 13,
                      },
                    ],
                  },
                  {
                    id: 4,
                    name: 'Hypnotica',
                    imageUrl: '/pizzas/hypnotica.png',
                    price: 13,
                    items: [
                      {
                        price: 13,
                      },
                    ],
                  },
                  {
                    id: 5,
                    name: 'Hypnotica',
                    imageUrl: '/pizzas/hypnotica.png',
                    price: 13,
                    items: [
                      {
                        price: 13,
                      },
                    ],
                  },
                  {
                    id: 6,
                    name: 'Hypnotica',
                    imageUrl: '/pizzas/hypnotica.png',
                    price: 13,
                    items: [
                      {
                        price: 13,
                      },
                    ],
                  },
                  {
                    id: 7,
                    name: 'Hypnotica',
                    imageUrl: '/pizzas/hypnotica.png',
                    price: 13,
                    items: [
                      {
                        price: 13,
                      },
                    ],
                  },
                  {
                    id: 8,
                    name: 'Hypnotica',
                    imageUrl: '/pizzas/hypnotica.png',
                    price: 13,
                    items: [
                      {
                        price: 13,
                      },
                    ],
                  },
                ]}
                categoryId={1}
              />
              <ProductsGroupList
                title={'Breakfast'}
                items={[
                  {
                    id: 9,
                    name: 'Hypnotica',
                    imageUrl: '/pizzas/hypnotica.png',
                    price: 13,
                    items: [
                      {
                        price: 13,
                      },
                    ],
                  },
                  {
                    id: 10,
                    name: 'Hypnotica',
                    imageUrl: '/pizzas/hypnotica.png',
                    price: 13,
                    items: [
                      {
                        price: 13,
                      },
                    ],
                  },
                  {
                    id: 11,
                    name: 'Hypnotica',
                    imageUrl: '/pizzas/hypnotica.png',
                    price: 13,
                    items: [
                      {
                        price: 13,
                      },
                    ],
                  },
                  {
                    id: 12,
                    name: 'Hypnotica',
                    imageUrl: '/pizzas/hypnotica.png',
                    price: 13,
                    items: [
                      {
                        price: 13,
                      },
                    ],
                  },
                  {
                    id: 13,
                    name: 'Hypnotica',
                    imageUrl: '/pizzas/hypnotica.png',
                    price: 13,
                    items: [
                      {
                        price: 13,
                      },
                    ],
                  },
                  {
                    id: 14,
                    name: 'Hypnotica',
                    imageUrl: '/pizzas/hypnotica.png',
                    price: 13,
                    items: [
                      {
                        price: 13,
                      },
                    ],
                  },
                  {
                    id: 15,
                    name: 'Hypnotica',
                    imageUrl: '/pizzas/hypnotica.png',
                    price: 13,
                    items: [
                      {
                        price: 13,
                      },
                    ],
                  },
                  {
                    id: 16,
                    name: 'Hypnotica',
                    imageUrl: '/pizzas/hypnotica.png',
                    price: 13,
                    items: [
                      {
                        price: 13,
                      },
                    ],
                  },
                ]}
                categoryId={2}
              />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
