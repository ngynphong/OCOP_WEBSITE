code mẫu trang sản phẩm hãy thực hiện áp dụng vafcos thể điều chỉnh cho phù hợp với dự án, về màu sắc và font chữ hãy tuân thủ theo thiết kế của dự án

<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>OCOP Market | Search Results</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              "background": "#fbfbe2",
              "outline-variant": "#bfcaba",
              "on-error-container": "#93000a",
              "tertiary-container": "#baad4a",
              "on-secondary-container": "#795950",
              "on-error": "#ffffff",
              "on-tertiary-fixed": "#201c00",
              "secondary-fixed-dim": "#e7bdb1",
              "primary-fixed-dim": "#88d982",
              "primary-fixed": "#a3f69c",
              "on-surface-variant": "#40493d",
              "surface-container-low": "#f5f5dc",
              "tertiary": "#695f00",
              "secondary": "#77574d",
              "outline": "#707a6c",
              "surface-container-highest": "#e4e4cc",
              "on-secondary-fixed-variant": "#5d4037",
              "on-primary-fixed-variant": "#005312",
              "error": "#ba1a1a",
              "tertiary-fixed": "#f3e57b",
              "surface-variant": "#e4e4cc",
              "secondary-fixed": "#ffdbd0",
              "primary": "#0d631b",
              "on-secondary-fixed": "#2c160e",
              "surface-container-lowest": "#ffffff",
              "primary-container": "#2e7d32",
              "on-primary": "#ffffff",
              "inverse-on-surface": "#f2f2d9",
              "surface-dim": "#dbdcc3",
              "on-surface": "#1b1d0e",
              "inverse-primary": "#88d982",
              "on-tertiary": "#ffffff",
              "surface-container-high": "#eaead1",
              "error-container": "#ffdad6",
              "on-primary-fixed": "#002204",
              "surface-container": "#efefd7",
              "tertiary-fixed-dim": "#d6c862",
              "surface-tint": "#1b6d24",
              "surface-bright": "#fbfbe2",
              "on-tertiary-fixed-variant": "#4f4700",
              "surface": "#fbfbe2",
              "secondary-container": "#fed3c7",
              "on-tertiary-container": "#474000",
              "on-background": "#1b1d0e",
              "inverse-surface": "#303221",
              "on-secondary": "#ffffff",
              "on-primary-container": "#cbffc2"
            },
            fontFamily: {
              "headline": ["Inter"],
              "body": ["Inter"],
              "label": ["Inter"]
            },
            borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
          },
        },
      }
    </script>
<style>
      .material-symbols-outlined {
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      }
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
</head>
<body class="bg-background text-on-surface font-body antialiased">

<main class="pt-28 pb-16 max-w-7xl mx-auto px-8">
<!-- Header Stats -->
<div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
<div>
<h1 class="text-[3.5rem] font-bold leading-tight tracking-tight text-on-surface">Results for 'Trà'</h1>
<p class="text-lg text-outline font-medium mt-2">120 products sourced directly from regional artisans</p>
</div>
<div class="flex items-center gap-4">
<span class="text-sm font-semibold text-on-surface-variant uppercase tracking-widest">Sort by</span>
<div class="relative group">
<button class="flex items-center gap-2 bg-surface-container-lowest px-6 py-3 rounded-xl border border-outline-variant/20 font-medium text-sm hover:bg-surface-container-high transition-colors">
                        Latest
                        <span class="material-symbols-outlined text-sm">expand_more</span>
</button>
</div>
</div>
</div>
<div class="flex flex-col lg:flex-row gap-12">
<!-- Sidebar Filter -->
<aside class="w-full lg:w-72 flex-shrink-0 space-y-10">
<!-- OCOP Rating -->
<section>
<h3 class="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-6">OCOP Star Rating</h3>
<div class="grid grid-cols-3 gap-2">
<button class="flex flex-col items-center justify-center p-3 rounded-xl bg-tertiary-container/10 border border-tertiary-container/20 hover:bg-tertiary-container/20 transition-all">
<span class="material-symbols-outlined text-tertiary" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="text-xs font-bold mt-1 text-tertiary">3★</span>
</button>
<button class="flex flex-col items-center justify-center p-3 rounded-xl bg-tertiary-container/20 border-2 border-tertiary-container transition-all shadow-sm">
<span class="material-symbols-outlined text-tertiary" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="text-xs font-bold mt-1 text-tertiary">4★</span>
</button>
<button class="flex flex-col items-center justify-center p-3 rounded-xl bg-tertiary-container/10 border border-tertiary-container/20 hover:bg-tertiary-container/20 transition-all">
<span class="material-symbols-outlined text-tertiary" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="text-xs font-bold mt-1 text-tertiary">5★</span>
</button>
</div>
</section>
<!-- Regions -->
<section>
<h3 class="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-6">Regions</h3>
<div class="space-y-3">
<label class="flex items-center group cursor-pointer">
<input class="rounded-sm border-outline text-primary focus:ring-primary w-5 h-5 bg-surface transition-all" type="checkbox"/>
<span class="ml-4 text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors">North Vietnam</span>
</label>
<label class="flex items-center group cursor-pointer">
<input class="rounded-sm border-outline text-primary focus:ring-primary w-5 h-5 bg-surface transition-all" type="checkbox"/>
<span class="ml-4 text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors">Central Highlands</span>
</label>
<label class="flex items-center group cursor-pointer">
<input class="rounded-sm border-outline text-primary focus:ring-primary w-5 h-5 bg-surface transition-all" type="checkbox"/>
<span class="ml-4 text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors">Mekong Delta</span>
</label>
</div>
</section>
<!-- Price Range -->
<section>
<h3 class="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-6">Price Range</h3>
<div class="px-2">
<input class="w-full h-1.5 bg-outline-variant/30 rounded-full appearance-none cursor-pointer accent-primary" type="range"/>
<div class="flex justify-between mt-4 text-[10px] font-bold text-outline">
<span>0đ</span>
<span>2.000.000đ</span>
</div>
</div>
</section>
<!-- Categories -->
<section>
<h3 class="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-6">Categories</h3>
<div class="flex flex-wrap gap-2">
<span class="px-4 py-2 rounded-full bg-surface-container-highest text-xs font-semibold text-on-surface-variant hover:bg-primary hover:text-on-primary cursor-pointer transition-all">Agricultural Products</span>
<span class="px-4 py-2 rounded-full bg-surface-container-highest text-xs font-semibold text-on-surface-variant hover:bg-primary hover:text-on-primary cursor-pointer transition-all">Handicrafts</span>
<span class="px-4 py-2 rounded-full bg-surface-container-highest text-xs font-semibold text-on-surface-variant hover:bg-primary hover:text-on-primary cursor-pointer transition-all">Herbal Products</span>
</div>
</section>
</aside>
<!-- Product Grid -->
<div class="flex-grow">
<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
<!-- Product Card 1 -->
<div class="group relative bg-surface-container-lowest rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-2">
<div class="relative aspect-[4/5] overflow-hidden">
<img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="Premium loose leaf green tea leaves in a traditional ceramic bowl on a dark rustic wooden table, soft morning light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYl7pGK-VhevPdtmusorLw2NDi8Yp4exrOqttoU0juVkVQfLu1tR9QzjVWEYOWsul9elt6mstpLlXe5RuJDdU9a4brFJ8vGvJSmIVDnBRyR1uQX4QlH7AzOAHC_QAG0C_1SBhc4QE8M6QDlBpmXUH6Q7c4SqAAj4NpPC6tbbEXTBdw-pqtUP2ahXk2qeNYZQKvNdWDU6cB-309pty9wW_nFCkbQXEAJc7_-kn6ziBmVlcWZ9b3OBGrHdJaUKf5v5Aa2SCs4kab8_Ti"/>
<!-- OCOP Badge -->
<div class="absolute top-4 left-4 bg-tertiary-container/90 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-lg">
<span class="material-symbols-outlined text-[14px] text-on-tertiary-container" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="text-[10px] font-black text-on-tertiary-container tracking-tighter">OCOP 5-STAR</span>
</div>
<!-- Wishlist -->
<button class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white hover:text-error">
<span class="material-symbols-outlined">favorite</span>
</button>
<!-- Hover Action -->
<div class="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8 px-6">
<button class="w-full bg-primary text-on-primary py-3 rounded-full font-bold text-sm shadow-xl flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
<span class="material-symbols-outlined text-sm">shopping_cart</span>
                                    Quick Add
                                </button>
</div>
</div>
<div class="p-6">
<span class="text-[10px] font-bold text-outline uppercase tracking-widest mb-2 block">Thai Nguyen Province</span>
<h3 class="text-lg font-semibold text-on-surface group-hover:text-primary transition-colors leading-tight mb-2">Tan Cuong Special Green Tea</h3>
<div class="flex items-center justify-between">
<span class="text-xl font-bold text-primary">350.000đ</span>
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-tertiary text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="text-xs font-bold text-on-surface-variant">4.9</span>
</div>
</div>
</div>
</div>
<!-- Product Card 2 -->
<div class="group relative bg-surface-container-lowest rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-2">
<div class="relative aspect-[4/5] overflow-hidden">
<img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="Beautifully packaged herbal lotus tea in silk pouches arranged on a bamboo mat with fresh lotus flowers" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDB181Ld5OG-8-q8ONpvfUsABA98C2EwSectwTcpy3x3Onsdj7PlOL9eJMm9u_3R7imsxgH74NMelz0kBT9rwJY60FxF1R5WCWcUsjbF3Gvh5ST0MggysEDHLP6GcRKKp--R4BWq-RB7MRemRZGAwEgmhl4mV9YAEaJMH84t_CbVY6SE73S7JUcCeMMvhNGuEfibLP64yiBtE1HAhm2iQhlrAYuFCbcyJNTemfS_XFY6OqqNE6wwELO10yJYCehw6KwqQK4wbPp35az"/>
<div class="absolute top-4 left-4 bg-tertiary-container/90 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-lg">
<span class="material-symbols-outlined text-[14px] text-on-tertiary-container" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="text-[10px] font-black text-on-tertiary-container tracking-tighter">OCOP 4-STAR</span>
</div>
<button class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white hover:text-error">
<span class="material-symbols-outlined">favorite</span>
</button>
<div class="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8 px-6">
<button class="w-full bg-primary text-on-primary py-3 rounded-full font-bold text-sm shadow-xl flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
<span class="material-symbols-outlined text-sm">shopping_cart</span>
                                    Quick Add
                                </button>
</div>
</div>
<div class="p-6">
<span class="text-[10px] font-bold text-outline uppercase tracking-widest mb-2 block">Hue Ancient Capital</span>
<h3 class="text-lg font-semibold text-on-surface group-hover:text-primary transition-colors leading-tight mb-2">Imperial Lotus Heart Tea</h3>
<div class="flex items-center justify-between">
<span class="text-xl font-bold text-primary">280.000đ</span>
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-tertiary text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="text-xs font-bold text-on-surface-variant">4.8</span>
</div>
</div>
</div>
</div>
<!-- Product Card 3 -->
<div class="group relative bg-surface-container-lowest rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-2">
<div class="relative aspect-[4/5] overflow-hidden">
<img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="Traditional Vietnamese tea set with a small teapot and cups on a stone tray, steam rising gently in a moody forest setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuChfghWBexQ4imIJEZzhBrlPSWCm8Oh9iq3-Q2rScfxb6k81h5feQHXE-Dd6F91JhaKBwC5_3P76eOJnaGBG7eXvod24Dt9XqneMo7KvUS0WJbuQE8ojgfFMbZKzyBS1d7h_V3rkiNGwwq_xOeKahuX3AvFb18h4o6DoS4zprA8cumqlZUfnahPewzgAtOZnIw1grQD4gNcZsTFGmkhj6VfK6-iM0P8FR2WMcXIO41ZpWOFmhFSaDWVPFG-sy7U_cuTuE7_eVkTZR-p"/>
<div class="absolute top-4 left-4 bg-tertiary-container/90 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-lg">
<span class="material-symbols-outlined text-[14px] text-on-tertiary-container" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="text-[10px] font-black text-on-tertiary-container tracking-tighter">OCOP 5-STAR</span>
</div>
<button class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white hover:text-error">
<span class="material-symbols-outlined">favorite</span>
</button>
<div class="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8 px-6">
<button class="w-full bg-primary text-on-primary py-3 rounded-full font-bold text-sm shadow-xl flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
<span class="material-symbols-outlined text-sm">shopping_cart</span>
                                    Quick Add
                                </button>
</div>
</div>
<div class="p-6">
<span class="text-[10px] font-bold text-outline uppercase tracking-widest mb-2 block">Ha Giang Highlands</span>
<h3 class="text-lg font-semibold text-on-surface group-hover:text-primary transition-colors leading-tight mb-2">Ancient Shan Tuyet Tea</h3>
<div class="flex items-center justify-between">
<span class="text-xl font-bold text-primary">520.000đ</span>
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-tertiary text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="text-xs font-bold text-on-surface-variant">5.0</span>
</div>
</div>
</div>
</div>
<!-- Row 2 Card 4 -->
<div class="group relative bg-surface-container-lowest rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-2">
<div class="relative aspect-[4/5] overflow-hidden">
<img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="Artisan flower tea blooming in a glass teapot, warm golden lighting reflecting through the water" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKX1SIRXkcpG5S33Z9NTfx-FuAmte8C1TeHQo5jPqQoiF63TGIulgxgGjSq4ecxUYNrBK5CGViJei5NoxUJhZ_gfA83N-YN2NhmLdZzYWGKU3EfBlg26wpztw9b23B31mIQ6DmD_C2IOVc2uMboz0Uze9XBKcRbgd6pNW-KZ-yWSvS817vTx7jiwKx4Jb0C6AJin3B5_e3PuO6EKeGgXAkMmsnAx4xAd1f26RIDScVEOBkhqi9AqOJsJuSl19n1LgtnedGYRqUWf1d"/>
<div class="absolute top-4 left-4 bg-tertiary-container/90 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-lg">
<span class="material-symbols-outlined text-[14px] text-on-tertiary-container" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="text-[10px] font-black text-on-tertiary-container tracking-tighter">OCOP 3-STAR</span>
</div>
<div class="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8 px-6">
<button class="w-full bg-primary text-on-primary py-3 rounded-full font-bold text-sm shadow-xl">Quick Add</button>
</div>
</div>
<div class="p-6">
<span class="text-[10px] font-bold text-outline uppercase tracking-widest mb-2 block">Lam Dong Province</span>
<h3 class="text-lg font-semibold text-on-surface mb-2">Artichoke Herbal Tea</h3>
<div class="flex items-center justify-between">
<span class="text-xl font-bold text-primary">125.000đ</span>
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-tertiary text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="text-xs font-bold text-on-surface-variant">4.2</span>
</div>
</div>
</div>
</div>
<!-- Row 2 Card 5 -->
<div class="group relative bg-surface-container-lowest rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-2">
<div class="relative aspect-[4/5] overflow-hidden">
<img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="Handcrafted bamboo tea whisk and scoop on a dark ceramic plate, elegant shadows" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDY_WrEOcmbrpbBiw3tNH2gYoMLbSFw7N3T15iaxEbf8xcoQK4D4uO35-PbcXfKcMmnT5lo3IG1tWsRt9WFteSd6raa8XrEu5nXlZeR_w0XoatWgvUwY_E0CqOWrU4gj2ZLoRJ-ueBzJZIaM1VIpgRX-oCCFjtYB3OR_tSrqZpdAKuAVq0BeT1Ch8g9-qV8u0eJDOQ34g8xoIZafUdelE1I372_LqUwl0mrEJ50t1qQ112Mi7xZif7hW-lS2VM6N_I_z_1jr9bNMcpz"/>
<div class="absolute top-4 left-4 bg-tertiary-container/90 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-lg">
<span class="material-symbols-outlined text-[14px] text-on-tertiary-container" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="text-[10px] font-black text-on-tertiary-container tracking-tighter">OCOP 4-STAR</span>
</div>
<div class="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8 px-6">
<button class="w-full bg-primary text-on-primary py-3 rounded-full font-bold text-sm shadow-xl">Quick Add</button>
</div>
</div>
<div class="p-6">
<span class="text-[10px] font-bold text-outline uppercase tracking-widest mb-2 block">Bac Ninh Province</span>
<h3 class="text-lg font-semibold text-on-surface mb-2">Handmade Bamboo Tea Scoop</h3>
<div class="flex items-center justify-between">
<span class="text-xl font-bold text-primary">95.000đ</span>
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-tertiary text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="text-xs font-bold text-on-surface-variant">4.7</span>
</div>
</div>
</div>
</div>
<!-- Row 2 Card 6 -->
<div class="group relative bg-surface-container-lowest rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-2">
<div class="relative aspect-[4/5] overflow-hidden">
<img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="Modern tea canisters with minimalist labels, earthy tones, set against a soft beige background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5K7vFa5x3VUVfQLA-EGiXTGwi1wdRHjXHwHu5fjrZgjdDtkwNGVkabvm4dkobb6ck6oQc-Rh7rQ02NFnla4Ogbj2LnfPrNIdlRaF_NPagLoAUIXQ6RAFDtkDQOrlT35FZUxMBjqusizmlXUf1E7DGZic4IbJ5eFdyh_Zd8WQib1bNH4ns664E05Q86LdvlLgcIcI3vnPTNHP8_9YGLeFclslF65MxYD807qmXNt6Vg_MmVILMPqzLk-bX0EyAfHkpLmaXx6KbkICf"/>
<div class="absolute top-4 left-4 bg-tertiary-container/90 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-lg">
<span class="material-symbols-outlined text-[14px] text-on-tertiary-container" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="text-[10px] font-black text-on-tertiary-container tracking-tighter">OCOP 5-STAR</span>
</div>
<div class="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8 px-6">
<button class="w-full bg-primary text-on-primary py-3 rounded-full font-bold text-sm shadow-xl">Quick Add</button>
</div>
</div>
<div class="p-6">
<span class="text-[10px] font-bold text-outline uppercase tracking-widest mb-2 block">Dalat City</span>
<h3 class="text-lg font-semibold text-on-surface mb-2">Oolong Gold Reserve</h3>
<div class="flex items-center justify-between">
<span class="text-xl font-bold text-primary">420.000đ</span>
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-tertiary text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="text-xs font-bold text-on-surface-variant">4.9</span>
</div>
</div>
</div>
</div>
</div>
<!-- Pagination -->
<nav class="mt-20 flex items-center justify-center gap-4">
<button class="w-12 h-12 rounded-full flex items-center justify-center text-secondary border border-secondary-container/50 hover:bg-secondary-container transition-all">
<span class="material-symbols-outlined">chevron_left</span>
</button>
<div class="flex items-center gap-2">
<button class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm bg-secondary text-white shadow-lg">1</button>
<button class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm text-secondary hover:bg-secondary-container transition-all">2</button>
<button class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm text-secondary hover:bg-secondary-container transition-all">3</button>
<span class="text-secondary font-bold px-2">...</span>
<button class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm text-secondary hover:bg-secondary-container transition-all">10</button>
</div>
<button class="w-12 h-12 rounded-full flex items-center justify-center text-secondary border border-secondary-container/50 hover:bg-secondary-container transition-all">
<span class="material-symbols-outlined">chevron_right</span>
</button>
</nav>
</div>
</div>
</main>
</body></html>
