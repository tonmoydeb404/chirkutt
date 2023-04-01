import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import iconList from "../../../../lib/iconList";
import { ListItemType } from "../../../../types/ListType";
import AppbarOption from "./AppbarOption";

const AppbarMenu = ({ list }: { list: ListItemType[] }) => {
  return (
    <Popover as="div">
      <Popover.Button className={"flex outline-none"}>
        {({ open }) => (
          <span className={`appbar_icon ${open ? "active" : ""}`}>
            {iconList.menu}
          </span>
        )}
      </Popover.Button>
      <Popover.Overlay className="fixed inset-0 bg-black opacity-40 -z-[1]" />
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Popover.Panel className="absolute bottom-full mb-0 w-full left-0 right-0 z-[999]">
          {({ close }) => (
            <div className="flex flex-col box px-2 py-4 gap-1">
              {list.map((link) => (
                <AppbarOption item={link} onClick={close} key={link.title} />
              ))}
            </div>
          )}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default AppbarMenu;
