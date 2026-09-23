'use client';

import React from 'react';
import { useEventForm } from '@/features/admin/hooks/useEventForm';
import { EventSvgGalleryModal } from '@/features/events/components/decorations/EventSvgGalleryModal';
import type { EventDetailResponse } from '@/features/events/types/eventTypes';
import {
  EventFormHeader,
  EventBasicInfoSection,
  EventBannersSection,
  EventThemeSection,
  EventConceptSection,
  EventSellerPortalSection,
  EventMinigameSection,
  EventFormFooter,
} from './form';

interface EventFormPageProps {
  initialData?: EventDetailResponse | null;
}

export function EventFormPage({ initialData }: EventFormPageProps) {
  const {
    isEdit,
    submitting,
    uploadingDesktop,
    uploadingMobile,
    name,
    handleNameChange,
    code,
    setCode,
    slug,
    setSlug,
    description,
    setDescription,
    type,
    setType,
    startAt,
    setStartAt,
    endAt,
    setEndAt,
    isHomeFeatured,
    setIsHomeFeatured,
    bannerDesktopUrl,
    setBannerDesktopUrl,
    bannerMobileUrl,
    setBannerMobileUrl,
    handleUpload,
    sellerPortalVisible,
    setSellerPortalVisible,
    registrationStartAt,
    setRegistrationStartAt,
    registrationEndAt,
    setRegistrationEndAt,
    minOcopStar,
    setMinOcopStar,
    minDiscountPercent,
    setMinDiscountPercent,
    maxProductsPerShop,
    setMaxProductsPerShop,
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor,
    surfaceColor,
    setSurfaceColor,
    selectedPresetId,
    handleSelectPreset,
    conceptId,
    enableAtmosphere,
    setEnableAtmosphere,
    atmosphereType,
    setAtmosphereType,
    enableCornerStickers,
    setEnableCornerStickers,
    handleSelectConcept,
    showSvgGallery,
    setShowSvgGallery,
    handleOpenSvgGallery,
    minigameActive,
    setMinigameActive,
    minigameType,
    setMinigameType,
    minOrderValueForBonusSpin,
    setMinOrderValueForBonusSpin,
    freeSpinsPerDay,
    setFreeSpinsPerDay,
    spinsPerOrder,
    setSpinsPerOrder,
    minigameBudgetLimit,
    setMinigameBudgetLimit,
    minigameTotalClaimed,
    activeRewards,
    totalRewardWeight,
    handleRewardFieldChange,
    handleRewardWeightChange,
    handleResetDefaultRewards,
    mysteryPickConcept,
    customPickTitle,
    setCustomPickTitle,
    customPickSubtitle,
    setCustomPickSubtitle,
    customPickItems,
    effectiveMysteryPickConcept,
    handleSelectMysteryConcept,
    handlePickItemChange,
    handleResetPickItemsToConcept,
    handleSubmit,
  } = useEventForm({ initialData });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24">
      <EventFormHeader
        isEdit={isEdit}
        name={name}
        status={initialData?.status}
        eventId={initialData?.id}
        submitting={submitting}
        minigameActive={minigameActive}
        totalRewardWeight={totalRewardWeight}
        onSubmit={() => void handleSubmit()}
      />

      <div className="mt-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          <EventBasicInfoSection
            name={name}
            onNameChange={handleNameChange}
            type={type}
            onTypeChange={setType}
            code={code}
            onCodeChange={setCode}
            slug={slug}
            onSlugChange={setSlug}
            startAt={startAt}
            onStartAtChange={setStartAt}
            endAt={endAt}
            onEndAtChange={setEndAt}
            description={description}
            onDescriptionChange={setDescription}
            isHomeFeatured={isHomeFeatured}
            onIsHomeFeaturedChange={setIsHomeFeatured}
          />

          <EventBannersSection
            bannerDesktopUrl={bannerDesktopUrl}
            onBannerDesktopChange={setBannerDesktopUrl}
            bannerMobileUrl={bannerMobileUrl}
            onBannerMobileChange={setBannerMobileUrl}
            uploadingDesktop={uploadingDesktop}
            uploadingMobile={uploadingMobile}
            onUpload={handleUpload}
          />

          <EventThemeSection
            selectedPresetId={selectedPresetId}
            onSelectPreset={handleSelectPreset}
            primaryColor={primaryColor}
            onPrimaryColorChange={setPrimaryColor}
            secondaryColor={secondaryColor}
            onSecondaryColorChange={setSecondaryColor}
            surfaceColor={surfaceColor}
            onSurfaceColorChange={setSurfaceColor}
            eventName={name}
          />

          <EventConceptSection
            conceptId={conceptId}
            onSelectConcept={handleSelectConcept}
            enableAtmosphere={enableAtmosphere}
            onEnableAtmosphereChange={setEnableAtmosphere}
            atmosphereType={atmosphereType}
            onAtmosphereTypeChange={setAtmosphereType}
            enableCornerStickers={enableCornerStickers}
            onEnableCornerStickersChange={setEnableCornerStickers}
            onOpenSvgGallery={handleOpenSvgGallery}
          />

          <EventSellerPortalSection
            sellerPortalVisible={sellerPortalVisible}
            onSellerPortalVisibleChange={setSellerPortalVisible}
            registrationStartAt={registrationStartAt}
            onRegistrationStartAtChange={setRegistrationStartAt}
            registrationEndAt={registrationEndAt}
            onRegistrationEndAtChange={setRegistrationEndAt}
            startAt={startAt}
            minOcopStar={minOcopStar}
            onMinOcopStarChange={setMinOcopStar}
            minDiscountPercent={minDiscountPercent}
            onMinDiscountPercentChange={setMinDiscountPercent}
            maxProductsPerShop={maxProductsPerShop}
            onMaxProductsPerShopChange={setMaxProductsPerShop}
          />

          <EventMinigameSection
            minigameActive={minigameActive}
            onMinigameActiveChange={setMinigameActive}
            minigameType={minigameType}
            onMinigameTypeChange={setMinigameType}
            effectiveMysteryPickConcept={effectiveMysteryPickConcept}
            mysteryPickConcept={mysteryPickConcept}
            onSelectMysteryConcept={handleSelectMysteryConcept}
            customPickTitle={customPickTitle}
            onCustomPickTitleChange={setCustomPickTitle}
            customPickSubtitle={customPickSubtitle}
            onCustomPickSubtitleChange={setCustomPickSubtitle}
            customPickItems={customPickItems}
            onPickItemChange={handlePickItemChange}
            onResetPickItemsToConcept={handleResetPickItemsToConcept}
            minOrderValueForBonusSpin={minOrderValueForBonusSpin}
            onMinOrderValueForBonusSpinChange={setMinOrderValueForBonusSpin}
            spinsPerOrder={spinsPerOrder}
            onSpinsPerOrderChange={setSpinsPerOrder}
            freeSpinsPerDay={freeSpinsPerDay}
            onFreeSpinsPerDayChange={setFreeSpinsPerDay}
            minigameBudgetLimit={minigameBudgetLimit}
            onMinigameBudgetLimitChange={setMinigameBudgetLimit}
            minigameTotalClaimed={minigameTotalClaimed}
            activeRewards={activeRewards}
            totalRewardWeight={totalRewardWeight}
            onRewardFieldChange={handleRewardFieldChange}
            onRewardWeightChange={handleRewardWeightChange}
            onResetDefaultRewards={handleResetDefaultRewards}
          />

          <EventFormFooter
            isEdit={isEdit}
            submitting={submitting}
            minigameActive={minigameActive}
            totalRewardWeight={totalRewardWeight}
          />
        </form>
      </div>

      {showSvgGallery && (
        <EventSvgGalleryModal isOpen={showSvgGallery} onClose={() => setShowSvgGallery(false)} />
      )}
    </div>
  );
}
