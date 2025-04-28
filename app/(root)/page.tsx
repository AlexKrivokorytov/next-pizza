import { Container, Filters, TopBar, Title, ProductsGroupList } from '@/shared/components/shared';
import { prisma } from '@/prisma/prisma-client';
import { Button } from '@/shared/components/ui';
import { Filter } from 'lucide-react'; // Assuming lucide-react is installed or install it
import { FilterDrawer } from '@/shared/components/shared/filter-drawer'; // We will create this component

export default async function Home() {
  const categories = await prisma.category.findMany({
    include: {
      products: {
        include: {
          ingredients: true,
          items: true,
        },
      },
    },
  });

  // Filter out categories with no products
  const categoriesWithProducts = categories.filter((category) => category.products.length > 0);

  return (
    <>
      <Container className="mt-10">
        <Title text="Pizzas" size="lg" className="font-extrabold" />
      </Container>
      <TopBar categories={categories.filter((category) => category.products.length > 0)} />

      <Container className="mt-10 pb-14">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-[80px]">
          {/* Filters Sidebar - Hidden on screens smaller than lg */}
          <div className="hidden lg:block lg:w-[250px] lg:sticky lg:top-10 lg:self-start">
            <Filters />
          </div>

          {/* Products List */}
          <div className="flex-1">
            {/* Drawer Trigger Button - Visible only on screens smaller than lg */}
            <div className="lg:hidden mb-6">
              <FilterDrawer>
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Filter size={18} />
                  Filters
                </Button>
              </FilterDrawer>
            </div>

            {categoriesWithProducts.length > 0 ? (
              <div className="flex flex-col gap-16">
                {categoriesWithProducts.map((category) => (
                  <ProductsGroupList
                    key={category.id}
                    title={category.name}
                    items={category.products}
                    className="w-full"
                    listClassName="w-full"
                    categoryId={category.id}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="text-5xl mb-4">🍕</div>
                <h2 className="text-2xl font-bold mb-2">No products found</h2>
                <p className="text-gray-500 max-w-md">
                  We couldn't find any products that match your criteria. Try adjusting your
                  filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
