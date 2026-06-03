import { Container, Filters, TopBar, Title, ProductsGroupList } from '@/components/shared';
import { Button } from '@/components/ui';
import { Filter, Pizza } from 'lucide-react';
import { FilterDrawer } from '@/components/shared/filter-drawer';
import { CategoryService } from '@/lib/db/categories';

export const dynamic = 'force-dynamic';

interface SearchParams {
  priceFrom?: string;
  priceTo?: string;
  sizes?: string;
  pizzaTypes?: string;
  ingredients?: string;
  sortBy?: string;
}

export default async function Home({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;

  const priceFrom = params.priceFrom && !isNaN(Number(params.priceFrom)) ? Number(params.priceFrom) : undefined;
  const priceTo = params.priceTo && !isNaN(Number(params.priceTo)) ? Number(params.priceTo) : undefined;
  const sizesArr = params.sizes ? params.sizes.split(',').map(Number) : undefined;
  const pizzaTypesArr = params.pizzaTypes ? params.pizzaTypes.split(',').map(Number) : undefined;
  const ingredientsArr = params.ingredients ? params.ingredients.split(',').map(Number) : undefined;
  const sortBy = params.sortBy;

  const categoriesWithProducts = await CategoryService.getCategoriesWithProducts({
    priceFrom,
    priceTo,
    sizesArr,
    pizzaTypesArr,
    ingredientsArr,
    sortBy,
  });



  return (
    <>
      <Container className="mt-10">
        <Title text="Pizzas" size="lg" className="font-extrabold" />
      </Container>
      <TopBar categories={categoriesWithProducts} />

      <Container className="mt-10 pb-14">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-[80px]">
          {/* Filters Sidebar - Hidden on screens smaller than lg */}
          <div className="hidden lg:block lg:w-[250px] lg:sticky lg:top-[100px] lg:self-start lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto lg:scrollbar">
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
                <div className="mb-4">
                  <Pizza size={64} className="text-orange-400" />
                </div>
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
