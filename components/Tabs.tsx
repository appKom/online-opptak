import React, { useState } from "react";

type TabContent = {
  title?: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
};

type TabsProps = {
  content: TabContent[];
  activeTab?: number;
  setActiveTab?: (index: number) => void;
};

export const Tabs = (props: TabsProps) => {
  const [internalActiveTab, setInternalActiveTab] = useState(0);

  const currentActiveTab =
    props.activeTab !== undefined ? props.activeTab : internalActiveTab;
  const changeTab =
    props.setActiveTab !== undefined
      ? props.setActiveTab
      : setInternalActiveTab;

  const getTabClass = (tabIndex: number) => {
    const defaultTabClass =
      "inline-flex cursor-pointer items-center gap-2 px-1 py-3 ";

    return (
      defaultTabClass +
      (tabIndex === props.activeTab
        ? "relative text-online-darkTeal after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-online-darkTeal hover:text-online-darkTeal border-online-darkTeal dark:text-online-orange"
        : "text-gray-500 hover:text-online-darkTeal dark:text-gray-200 dark:hover:text-online-orange dark:border-gray-700")
    );
  };

  return (
    <>
      <div className="w-10/12 mb-5 border-b border-b-gray-300">
        <ul className="flex items-center gap-4 -mb-px text-sm font-medium">
          {props.content.map((tab, index) => (
            <li key={index}>
              <a
                onClick={() => changeTab(index)}
                className={getTabClass(index)}
              >
                {tab.icon}
                {tab.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="py-3">
        {props.content.map((tab, index) => (
          <div
            key={index}
            className={currentActiveTab === index ? "block" : "hidden"}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </>
  );
};
