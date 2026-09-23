'use client';

import React from 'react';
import type { MysteryPickItem, MysteryPickConceptId } from '../../../types/eventMinigameTypes';
import MooncakeHero from './MooncakeHero';
import TetEnvelopeHero from './TetEnvelopeHero';
import HarvestHero from './HarvestHero';
import CyberMysteryBoxHero from './CyberMysteryBoxHero';
import ChristmasHero from './ChristmasHero';
import DaiLeHero from './DaiLeHero';
import CustomHero from './CustomHero';

interface MysteryPickCardHeroProps {
  conceptId: MysteryPickConceptId;
  item: MysteryPickItem;
  isSelected: boolean;
}

export default function MysteryPickCardHero({
  conceptId,
  item,
  isSelected,
}: MysteryPickCardHeroProps) {
  switch (conceptId) {
    case 'TRUNG_THU':
      return <MooncakeHero item={item} isSelected={isSelected} />;
    case 'TET_NGUYEN_DAN':
      return <TetEnvelopeHero item={item} isSelected={isSelected} />;
    case 'MUA_VANG':
      return <HarvestHero item={item} isSelected={isSelected} />;
    case 'MEGA_SALE':
      return <CyberMysteryBoxHero item={item} isSelected={isSelected} />;
    case 'GIANG_SINH':
      return <ChristmasHero item={item} isSelected={isSelected} />;
    case 'DAI_LE':
      return <DaiLeHero item={item} isSelected={isSelected} />;
    case 'CUSTOM':
    default:
      return <CustomHero item={item} isSelected={isSelected} />;
  }
}
