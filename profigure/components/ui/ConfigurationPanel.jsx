'use client';

import {useModel} from '../../context/ModelContext';
import {
  HeadingXS,
  HeadingSM,
  Accordion,
  ButtonLG,
} from '../uiComponents';
import Image from 'next/image';

// Production page sidebar — renders settings sections as accordions
function ConfigurationPanel({settings, productImages = {}}) {
  const {meta, sections} = settings;

  return (
    <div className="flex overflow-y-scroll relative flex-col col-span-3 row-span-2 gap-4 p-4 h-full bg-gray-100 lg:row-span-3 lg:col-span-1">
      <div className="flex sticky inset-0 top-0 z-10 justify-between p-4 bg-gray-50 rounded-lg border border-gray-300">
        <div className="flex flex-col gap-2F">
          <HeadingXS className="text-gray-500">Build Your Own</HeadingXS>
          <HeadingSM>{meta.name}</HeadingSM>
        </div>
        <div className="overflow-hidden relative w-auto h-full rounded-full bg-brandPrimary aspect-square">
          <Image src="/K-Bird-Icon.svg" alt="icon" fill className="object-contain" />
        </div>
      </div>

      {sections.map((section, index) => (
        <Accordion key={index} section={section} productImages={productImages} />
      ))}

      <ButtonLG className="sticky bottom-0 p-4 w-full bg-brandPrimary">
        Add To Cart
      </ButtonLG>
    </div>
  );
}

export default ConfigurationPanel;
