'use client';

import { X } from 'lucide-react';
import { Filters } from './filters';
import { Button } from '../ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerTitle, DrawerTrigger } from '../ui/drawer';

interface FilterDrawerProps {
  children: React.ReactNode;
}

/**
 * Drawer component for displaying pizza filters on mobile or small screens.
 *
 * @param children - The trigger element(s) to open the drawer.
 *
 * @returns A drawer UI containing the Filters panel.
 */
export const FilterDrawer: React.FC<FilterDrawerProps> = ({ children }) => {
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent
        className="left-0 right-auto w-[85vw] max-w-[300px] h-full p-4 rounded-r-lg rounded-l-none border-r"
        aria-label="Filters panel"
      >
        <div className="flex items-center justify-between mb-4">
          <DrawerTitle className="text-lg font-bold">Filters</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Close filters">
              <X size={20} />
              <span className="sr-only">Close</span>
            </Button>
          </DrawerClose>
        </div>
        {/* Make the Filters component scrollable within the drawer */}
        <div className="overflow-y-auto flex-1 pb-4 pr-1 -mr-1">
          <Filters />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
