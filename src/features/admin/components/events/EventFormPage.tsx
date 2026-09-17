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
      {/* ── STICKY TOP NAVIGATION & ACTION BAR ── */}
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

      {/* ── FORM CONTENT CONTAINER ── */}
      <div className="mt-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. THÔNG TIN CƠ BẢN & LỊCH TRÌNH */}
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

          {/* 2. BANNER & HÌNH ẢNH TRUYỀN THÔNG */}
          <EventBannersSection
            bannerDesktopUrl={bannerDesktopUrl}
            onBannerDesktopChange={setBannerDesktopUrl}
            bannerMobileUrl={bannerMobileUrl}
            onBannerMobileChange={setBannerMobileUrl}
            uploadingDesktop={uploadingDesktop}
            uploadingMobile={uploadingMobile}
            onUpload={handleUpload}
          />

          {/* 3. THEME NHẬN DIỆN & BẢNG MÀU */}
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

          {/* 4. CONCEPT TRANG TRÍ & KHÍ QUYỂN LỄ HỘI */}
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

          {/* 5. CỔNG ĐĂNG KÝ CHO NHÀ BÁN OCOP (SELLER PORTAL) */}
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

          {/* 6. CẤU HÌNH MINIGAME VÀ VÒNG QUAY MAY MẮN */}
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

          {/* BOTTOM ACTION BAR */}
          <EventFormFooter
            isEdit={isEdit}
            submitting={submitting}
            minigameActive={minigameActive}
            totalRewardWeight={totalRewardWeight}
          />
        </form>
      </div>

      {/* SVG Gallery Modal */}
      {showSvgGallery && (
        <EventSvgGalleryModal isOpen={showSvgGallery} onClose={() => setShowSvgGallery(false)} />
      )}
    </div>
  );
}
