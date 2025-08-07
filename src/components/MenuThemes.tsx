interface MenuTheme {
  id: string;
  name: string;
  description: string;
  classes: {
    container: string;
    header: string;
    title: string;
    subtitle: string;
    card: string;
    categoryHeader: string;
    categoryTitle: string;
    productCard: string;
    productTitle: string;
    productPrice: string;
    offerCard: string;
    accent: string;
  };
}

export const menuThemes: Record<string, MenuTheme> = {
  classic: {
    id: 'classic',
    name: 'Classic Elegance',
    description: 'Timeless sophistication with clean lines',
    classes: {
      container: 'min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800',
      header: 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200/60 dark:border-slate-700/60 sticky top-0 z-50 shadow-lg shadow-slate-900/5',
      title: 'text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-slate-900 dark:text-slate-50',
      subtitle: 'text-slate-600 dark:text-slate-400 text-sm font-medium',
      card: 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/40 dark:border-slate-700/40 rounded-2xl shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-500',
      categoryHeader: 'cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-all duration-300 rounded-xl',
      categoryTitle: 'text-xl font-medium text-slate-900 dark:text-slate-100 tracking-wide',
      productCard: 'group flex gap-6 p-6 rounded-xl hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition-all duration-300 border-b border-slate-100/80 dark:border-slate-700/50 last:border-b-0',
      productTitle: 'font-medium text-slate-900 dark:text-slate-100 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors',
      productPrice: 'font-semibold text-slate-800 dark:text-slate-200 text-xl tracking-wide',
      offerCard: 'border-slate-200/60 bg-gradient-to-br from-slate-50/90 to-white/90 dark:from-slate-800/90 dark:to-slate-700/90 dark:border-slate-600/60 rounded-2xl p-6 border shadow-lg',
      accent: 'text-slate-700 dark:text-slate-300'
    }
  },
  modern: {
    id: 'modern',
    name: 'Modern Luxury',
    description: 'Contemporary design with premium touches',
    classes: {
      container: 'min-h-screen bg-gradient-to-br from-zinc-50 via-neutral-50 to-stone-100 dark:from-zinc-950 dark:via-neutral-950 dark:to-stone-900',
      header: 'bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-700/50 sticky top-0 z-50 shadow-2xl shadow-zinc-900/10',
      title: 'text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tighter text-zinc-900 dark:text-zinc-50',
      subtitle: 'text-zinc-600 dark:text-zinc-400 text-sm font-light tracking-wide',
      card: 'bg-white/70 dark:bg-zinc-800/70 backdrop-blur-lg border border-zinc-200/30 dark:border-zinc-700/30 rounded-3xl shadow-2xl shadow-zinc-900/5 hover:shadow-zinc-900/15 hover:scale-[1.02] transition-all duration-500',
      categoryHeader: 'cursor-pointer hover:bg-zinc-50/90 dark:hover:bg-zinc-700/40 transition-all duration-400 rounded-2xl',
      categoryTitle: 'text-xl font-light text-zinc-900 dark:text-zinc-100 tracking-wider',
      productCard: 'group flex gap-6 p-6 rounded-2xl hover:bg-zinc-50/40 dark:hover:bg-zinc-700/20 transition-all duration-400 border-b border-zinc-100/60 dark:border-zinc-700/40 last:border-b-0',
      productTitle: 'font-light text-zinc-900 dark:text-zinc-100 text-lg group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors tracking-wide',
      productPrice: 'font-medium text-zinc-800 dark:text-zinc-200 text-xl tracking-wider',
      offerCard: 'border-blue-200/40 bg-gradient-to-br from-blue-50/60 to-indigo-50/60 dark:from-blue-950/40 dark:to-indigo-950/40 dark:border-blue-800/40 rounded-3xl p-6 border shadow-xl backdrop-blur-sm',
      accent: 'text-blue-600 dark:text-blue-400'
    }
  },
  luxury: {
    id: 'luxury',
    name: 'Royal Gold',
    description: 'Opulent elegance with gold accents',
    classes: {
      container: 'min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50/50 to-orange-50 dark:from-amber-950 dark:via-yellow-950/50 dark:to-orange-950',
      header: 'bg-gradient-to-r from-amber-100/95 via-yellow-50/95 to-orange-100/95 dark:from-amber-900/80 dark:via-yellow-900/80 dark:to-orange-900/80 backdrop-blur-xl border-b border-amber-200/60 dark:border-amber-700/60 sticky top-0 z-50 shadow-2xl shadow-amber-900/20',
      title: 'text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-amber-900 dark:text-amber-100 tracking-tight',
      subtitle: 'text-amber-700/90 dark:text-amber-300/90 text-sm font-medium tracking-wide',
      card: 'bg-gradient-to-br from-white/90 via-amber-50/60 to-yellow-50/60 dark:from-amber-900/60 dark:via-yellow-900/40 dark:to-orange-900/60 border border-amber-200/50 dark:border-amber-700/50 rounded-3xl shadow-2xl shadow-amber-900/15 hover:shadow-amber-900/25 hover:scale-[1.01] transition-all duration-600',
      categoryHeader: 'cursor-pointer hover:bg-gradient-to-r hover:from-amber-50/80 hover:via-yellow-50/80 hover:to-orange-50/80 dark:hover:from-amber-900/30 dark:hover:via-yellow-900/30 dark:hover:to-orange-900/30 transition-all duration-400 rounded-2xl',
      categoryTitle: 'text-xl font-serif font-semibold text-amber-900 dark:text-amber-100 tracking-wide',
      productCard: 'group flex gap-6 p-6 rounded-2xl hover:bg-gradient-to-r hover:from-amber-50/50 hover:via-yellow-50/50 hover:to-orange-50/50 dark:hover:from-amber-900/20 dark:hover:via-yellow-900/20 dark:hover:to-orange-900/20 transition-all duration-400 border-b border-amber-200/40 dark:border-amber-700/40 last:border-b-0',
      productTitle: 'font-serif font-semibold text-amber-900 dark:text-amber-100 text-lg group-hover:text-amber-800 dark:group-hover:text-amber-200 transition-colors',
      productPrice: 'font-serif font-bold text-amber-800 dark:text-amber-200 text-xl tracking-wide',
      offerCard: 'border-amber-300/60 bg-gradient-to-br from-amber-100/80 via-yellow-100/80 to-orange-100/80 dark:from-amber-900/50 dark:via-yellow-900/50 dark:to-orange-900/50 dark:border-amber-600/60 rounded-3xl p-6 border shadow-2xl shadow-amber-900/20',
      accent: 'text-amber-700 dark:text-amber-300'
    }
  },
  rustic: {
    id: 'rustic',
    name: 'Warmth & Heritage',
    description: 'Cozy tradition with earthy warmth',
    classes: {
      container: 'min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 dark:from-orange-950 dark:via-amber-950 dark:to-red-950',
      header: 'bg-gradient-to-r from-orange-100/95 via-amber-100/95 to-red-100/95 dark:from-orange-900/80 dark:via-amber-900/80 dark:to-red-900/80 backdrop-blur-xl border-b border-orange-200/60 dark:border-orange-700/60 sticky top-0 z-50 shadow-2xl shadow-orange-900/20',
      title: 'text-3xl sm:text-4xl lg:text-5xl font-bold text-orange-900 dark:text-orange-100 tracking-tight',
      subtitle: 'text-orange-700/90 dark:text-orange-300/90 text-sm font-semibold tracking-wide',
      card: 'bg-gradient-to-br from-orange-50/90 via-amber-50/90 to-red-50/90 dark:from-orange-900/70 dark:via-amber-900/70 dark:to-red-900/70 border border-orange-200/50 dark:border-orange-700/50 rounded-3xl shadow-2xl shadow-orange-900/15 hover:shadow-orange-900/25 hover:scale-[1.01] transition-all duration-500',
      categoryHeader: 'cursor-pointer hover:bg-gradient-to-r hover:from-orange-100/80 hover:via-amber-100/80 hover:to-red-100/80 dark:hover:from-orange-900/40 dark:hover:via-amber-900/40 dark:hover:to-red-900/40 transition-all duration-300 rounded-2xl',
      categoryTitle: 'text-xl font-bold text-orange-900 dark:text-orange-100 tracking-wide',
      productCard: 'group flex gap-6 p-6 rounded-2xl hover:bg-gradient-to-r hover:from-orange-100/60 hover:via-amber-100/60 hover:to-red-100/60 dark:hover:from-orange-900/30 dark:hover:via-amber-900/30 dark:hover:to-red-900/30 transition-all duration-300 border-b border-orange-200/50 dark:border-orange-700/50 last:border-b-0',
      productTitle: 'font-bold text-orange-900 dark:text-orange-100 text-lg group-hover:text-orange-800 dark:group-hover:text-orange-200 transition-colors',
      productPrice: 'font-bold text-orange-800 dark:text-orange-200 text-xl tracking-wide',
      offerCard: 'border-orange-300/60 bg-gradient-to-br from-orange-100/80 via-amber-100/80 to-red-100/80 dark:from-orange-900/60 dark:via-amber-900/60 dark:to-red-900/60 dark:border-orange-600/60 rounded-3xl p-6 border shadow-2xl shadow-orange-900/20',
      accent: 'text-orange-700 dark:text-orange-300'
    }
  },
  vibrant: {
    id: 'vibrant',
    name: 'Artistic Flair',
    description: 'Bold creativity with vibrant energy',
    classes: {
      container: 'min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950 dark:via-pink-950 dark:to-rose-950',
      header: 'bg-gradient-to-r from-purple-100/95 via-pink-100/95 to-rose-100/95 dark:from-purple-900/80 dark:via-pink-900/80 dark:to-rose-900/80 backdrop-blur-xl border-b border-purple-200/60 dark:border-purple-700/60 sticky top-0 z-50 shadow-2xl shadow-purple-900/20',
      title: 'text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 dark:from-purple-400 dark:via-pink-400 dark:to-rose-400 bg-clip-text text-transparent tracking-tight',
      subtitle: 'text-purple-700/90 dark:text-purple-300/90 text-sm font-semibold tracking-wide',
      card: 'bg-gradient-to-br from-white/90 via-purple-50/40 to-pink-50/40 dark:from-slate-800/80 dark:via-purple-900/30 dark:to-pink-900/30 border border-purple-200/50 dark:border-purple-700/50 rounded-3xl shadow-2xl shadow-purple-900/15 hover:shadow-purple-900/25 hover:scale-[1.01] transition-all duration-500',
      categoryHeader: 'cursor-pointer hover:bg-gradient-to-r hover:from-purple-100/80 hover:via-pink-100/80 hover:to-rose-100/80 dark:hover:from-purple-900/40 dark:hover:via-pink-900/40 dark:hover:to-rose-900/40 transition-all duration-400 rounded-2xl',
      categoryTitle: 'text-xl font-bold bg-gradient-to-r from-purple-700 via-pink-700 to-rose-700 dark:from-purple-300 dark:via-pink-300 dark:to-rose-300 bg-clip-text text-transparent tracking-wide',
      productCard: 'group flex gap-6 p-6 rounded-2xl hover:bg-gradient-to-r hover:from-purple-50/60 hover:via-pink-50/60 hover:to-rose-50/60 dark:hover:from-purple-900/30 dark:hover:via-pink-900/30 dark:hover:to-rose-900/30 transition-all duration-400 border-b border-purple-200/50 dark:border-purple-700/50 last:border-b-0',
      productTitle: 'font-bold text-purple-900 dark:text-purple-100 text-lg group-hover:text-purple-800 dark:group-hover:text-purple-200 transition-colors',
      productPrice: 'font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 dark:from-purple-400 dark:via-pink-400 dark:to-rose-400 bg-clip-text text-transparent text-xl tracking-wide',
      offerCard: 'border-purple-300/60 bg-gradient-to-br from-purple-100/80 via-pink-100/80 to-rose-100/80 dark:from-purple-900/60 dark:via-pink-900/60 dark:to-rose-900/60 dark:border-purple-600/60 rounded-3xl p-6 border shadow-2xl shadow-purple-900/20',
      accent: 'text-purple-600 dark:text-purple-400'
    }
  }
};

export const getTheme = (themeId: string = 'classic'): MenuTheme => {
  return menuThemes[themeId] || menuThemes.classic;
};