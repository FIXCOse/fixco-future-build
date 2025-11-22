import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';

interface ContentItem {
  id: string;
  type: 'text' | 'heading' | 'image' | 'list' | 'button';
  value: string | string[];
  styles?: {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    fontFamily?: string;
    textAlign?: string;
    lineHeight?: string;
    letterSpacing?: string;
    textDecoration?: string;
    textTransform?: string;
    fontStyle?: string;
    userEdited?: boolean;
  };
  className?: string;
}

interface SectionData {
  id: string;
  title?: string;
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
  margin?: string;
  visibility?: boolean;
  customCss?: string;
  styles?: Record<string, any>;
}

interface GlobalSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  faviconUrl: string;
  maintenanceMode: boolean;
  analyticsEnabled: boolean;
  chatEnabled: boolean;
  customFonts: Array<{
    name: string;
    url: string;
    family: string;
  }>;
}

interface ContentStore {
  content: Record<string, Record<string, ContentItem>>; // locale -> id -> content
  sections: Record<string, SectionData>;
  globalSettings: GlobalSettings;
  isLoading: boolean;
  isHydrated: boolean;
  
  // Content methods
  updateContent: (id: string, data: Partial<ContentItem>, locale?: string) => Promise<void>;
  getContent: (id: string, locale?: string) => ContentItem | undefined;
  
  // Section methods
  updateSection: (id: string, data: Partial<SectionData>) => Promise<void>;
  getSection: (id: string) => SectionData | undefined;
  
  // Global settings methods
  updateGlobalSettings: (data: Partial<GlobalSettings>) => Promise<void>;
  
  // Database sync methods
  loadContent: () => Promise<void>;
  saveContentToDatabase: (id: string, data: ContentItem, locale: string) => Promise<void>;
  
  // Utility methods
  reset: () => void;
  clearHeroContent: () => void;
  clearGradientColors: () => void;
  resetGradientContent: () => void;
  exportData: () => string;
  importData: (data: string) => void;
}

const initialGlobalSettings: GlobalSettings = {
  siteName: 'Fixco',
  siteDescription: 'Professionella hemtjänster för ditt hem',
  contactEmail: 'info@fixco.se',
  contactPhone: '08-123 456 78',
  primaryColor: '#3b82f6',
  secondaryColor: '#64748b',
  logoUrl: '/assets/fixco-logo-black.png',
  faviconUrl: '/favicon.ico',
  maintenanceMode: false,
  analyticsEnabled: true,
  chatEnabled: true,
  customFonts: []
};

export const useContentStore = create<ContentStore>()(
  persist(
    (set, get) => ({
      content: { sv: {}, en: {} },
      sections: {},
      globalSettings: initialGlobalSettings,
      isLoading: false,
      isHydrated: false,
      
      updateContent: async (id: string, data: Partial<ContentItem>, locale: string = 'sv') => {
        const currentLocaleContent = get().content[locale] || {};
        const contentItem: ContentItem = {
          ...currentLocaleContent[id],
          ...data,
          id
        };

        // Update local state immediately for responsive UI
        set((state) => ({
          content: {
            ...state.content,
            [locale]: {
              ...(state.content[locale] || {}),
              [id]: contentItem
            }
          }
        }));

        // Save to database
        await get().saveContentToDatabase(id, contentItem, locale);

        // If saving Swedish content, trigger automatic translation
        if (locale === 'sv' && typeof contentItem.value === 'string') {
          console.log('Triggering automatic translation for:', id);
          try {
            const { data: translationData, error } = await supabase.functions.invoke('translate-site-content', {
              body: {
                content_id: id,
                sv_text: contentItem.value,
                content_type: contentItem.type,
                styles: contentItem.styles
              }
            });

            if (error) {
              console.error('Translation error:', error);
            } else {
              console.log('Automatic translation completed:', translationData);
              
              // Update English content in store
              if (translationData?.en_text) {
                set((state) => ({
                  content: {
                    ...state.content,
                    en: {
                      ...(state.content.en || {}),
                      [id]: {
                        id,
                        type: contentItem.type,
                        value: translationData.en_text,
                        styles: contentItem.styles
                      }
                    }
                  }
                }));
              }
            }
          } catch (error) {
            console.error('Failed to trigger automatic translation:', error);
          }
        }
      },
      
      getContent: (id: string, locale: string = 'sv') => {
        const localeContent = get().content[locale] || {};
        return localeContent[id];
      },
      
      updateSection: async (id: string, data: Partial<SectionData>) => {
        const sectionData: SectionData = {
          ...get().sections[id],
          ...data,
          id
        };

        // Update local state immediately
        set((state) => ({
          sections: {
            ...state.sections,
            [id]: sectionData
          }
        }));

        // Save section as content to database
        await get().saveContentToDatabase(`section_${id}`, {
          id: `section_${id}`,
          type: 'section' as any,
          value: JSON.stringify(sectionData),
          styles: {}
        }, 'sv');
      },
      
      getSection: (id: string) => {
        return get().sections[id];
      },
      
      updateGlobalSettings: async (data: Partial<GlobalSettings>) => {
        const newSettings = {
          ...get().globalSettings,
          ...data
        };

        // Update local state immediately
        set((state) => ({
          globalSettings: newSettings
        }));

        // Save global settings to database
        await get().saveContentToDatabase('global_settings', {
          id: 'global_settings',
          type: 'settings' as any,
          value: JSON.stringify(newSettings),
          styles: {}
        }, 'sv');
      },

      loadContent: async () => {
        try {
          set({ isLoading: true });
          
          const { data: contentData, error } = await supabase
            .from('site_content')
            .select('*');

          if (error) {
            console.error('Error loading content:', error);
            return;
          }

          const content: Record<string, Record<string, ContentItem>> = { sv: {}, en: {} };
          const sections: Record<string, SectionData> = {};
          let globalSettings = initialGlobalSettings;

          contentData?.forEach((item) => {
            const locale = item.locale || 'sv';
            
            if (item.content_id === 'global_settings') {
              try {
                globalSettings = JSON.parse(item.value as string);
              } catch (error) {
                console.error('Error parsing global settings:', error);
              }
            } else if (item.content_id.startsWith('section_')) {
              const sectionId = item.content_id.replace('section_', '');
              try {
                sections[sectionId] = JSON.parse(item.value as string);
              } catch (error) {
                console.error('Error parsing section data:', error);
              }
            } else {
              if (!content[locale]) {
                content[locale] = {};
              }
              content[locale][item.content_id] = {
                id: item.content_id,
                type: item.content_type as any,
                value: typeof item.value === 'string' ? item.value : JSON.stringify(item.value),
                styles: (item.styles as any) || {}
              };
            }
          });

          set({
            content,
            sections,
            globalSettings,
            isLoading: false
          });
        } catch (error) {
          console.error('Failed to load content from database:', error);
          set({ isLoading: false });
        }
      },

      saveContentToDatabase: async (id: string, data: ContentItem, locale: string) => {
        try {
          const { error } = await supabase
            .from('site_content')
            .upsert({
              content_id: id,
              content_type: data.type,
              value: data.value,
              styles: data.styles,
              locale: locale
            }, {
              onConflict: 'content_id,locale'
            });

          if (error) {
            console.error('Error saving content to database:', error);
            throw error;
          }

          console.log('Content saved successfully:', id, 'locale:', locale);
        } catch (error) {
          console.error('Failed to save content to database:', error);
          throw error;
        }
      },
      
      reset: () => {
        localStorage.removeItem('fixco-content-store');
        set({
          content: { sv: {}, en: {} },
          sections: {},
          globalSettings: initialGlobalSettings
        });
      },
      
      clearHeroContent: () => {
        const store = localStorage.getItem('fixco-content-store');
        if (store) {
          try {
            const parsed = JSON.parse(store);
            if (parsed?.state?.content?.sv?.['hero-title']) {
              delete parsed.state.content.sv['hero-title'];
            }
            if (parsed?.state?.content?.sv?.['hero-subtitle']) {
              delete parsed.state.content.sv['hero-subtitle'];
            }
            if (parsed?.state?.content?.en?.['hero-title']) {
              delete parsed.state.content.en['hero-title'];
            }
            if (parsed?.state?.content?.en?.['hero-subtitle']) {
              delete parsed.state.content.en['hero-subtitle'];
            }
            localStorage.setItem('fixco-content-store', JSON.stringify(parsed));
          } catch (error) {
            console.error('Failed to clear hero content:', error);
          }
        }
      },
      
      clearGradientColors: () => {
        const gradientContentIds = [
          'services-title',
          'services-categories-title', 
          'services-all-title',
          'services-rot-title',
          'services-rot-what-title',
          'services-rot-handle-title'
        ];

        // Step 1: Manipulate localStorage DIRECTLY
        const store = localStorage.getItem('fixco-content-store');
        if (store) {
          try {
            const parsed = JSON.parse(store);
            
            // Remove color from localStorage DIRECTLY
            if (parsed?.state?.content) {
              ['sv', 'en'].forEach(locale => {
                if (parsed.state.content[locale]) {
                  gradientContentIds.forEach(id => {
                    if (parsed.state.content[locale][id]?.styles?.color) {
                      delete parsed.state.content[locale][id].styles.color;
                      console.log(`🧹 Removed color from ${id} (${locale})`);
                    }
                  });
                }
              });
            }
            
            // Write back to localStorage IMMEDIATELY
            localStorage.setItem('fixco-content-store', JSON.stringify(parsed));
            console.log('✅ Cleared gradient colors from localStorage');
          } catch (error) {
            console.error('Failed to clear gradient colors from localStorage:', error);
          }
        }
        
        // Step 2: Also clear from current store (for this session)
        const state = get();
        ['sv', 'en'].forEach(locale => {
          const localeContent = state.content[locale];
          if (localeContent) {
            gradientContentIds.forEach(id => {
              const item = localeContent[id];
              if (item?.styles?.color) {
                const { color, ...restStyles } = item.styles;
                set((currentState) => ({
                  content: {
                    ...currentState.content,
                    [locale]: {
                      ...currentState.content[locale],
                      [id]: {
                        ...item,
                        styles: restStyles
                      }
                    }
                  }
                }));
              }
            });
          }
        });
        
        // NO RELOAD HERE - let onRehydrateStorage handle it with proper timing
        console.log('✅ Cleared gradient colors from content store');
      },
      
      resetGradientContent: async () => {
        const gradientContentIds = [
          'services-title',
          'services-categories-title', 
          'services-all-title',
          'services-rot-title',
          'services-rot-what-title',
          'services-rot-handle-title'
        ];

        // Step 1: Remove from localStorage
        const store = localStorage.getItem('fixco-content-store');
        if (store) {
          try {
            const parsed = JSON.parse(store);
            
            // NUCLEAR OPTION: Delete entire content entries from localStorage
            if (parsed?.state?.content) {
              ['sv', 'en'].forEach(locale => {
                if (parsed.state.content[locale]) {
                  gradientContentIds.forEach(id => {
                    if (parsed.state.content[locale][id]) {
                      delete parsed.state.content[locale][id];
                      console.log(`🗑️ DELETED ${id} from localStorage (${locale})`);
                    }
                  });
                }
              });
            }
            
            // Write back to localStorage IMMEDIATELY
            localStorage.setItem('fixco-content-store', JSON.stringify(parsed));
            console.log('✅ RESET gradient content from localStorage');
          } catch (error) {
            console.error('Failed to reset gradient content from localStorage:', error);
          }
        }
        
        // Step 2: Remove from current store (for this session)
        const state = get();
        ['sv', 'en'].forEach(locale => {
          const localeContent = state.content[locale];
          if (localeContent) {
            gradientContentIds.forEach(id => {
              if (localeContent[id]) {
                set((currentState) => {
                  const newContent = { ...currentState.content };
                  if (newContent[locale]) {
                    const newLocaleContent = { ...newContent[locale] };
                    delete newLocaleContent[id];
                    newContent[locale] = newLocaleContent;
                  }
                  return { content: newContent };
                });
              }
            });
          }
        });
        
        // Step 3: Remove from Supabase database (NEW!)
        try {
          const { error } = await supabase
            .from('site_content')
            .delete()
            .in('content_id', gradientContentIds)
            .in('locale', ['sv', 'en']);
          
          if (error) {
            console.error('Failed to delete gradient content from database:', error);
          } else {
            console.log('✅ Deleted gradient content from database');
          }
        } catch (error) {
          console.error('Failed to delete gradient content from database:', error);
        }
        
        console.log('✅ Reset gradient content from ALL sources (localStorage + store + database)');
      },
      
      exportData: () => {
        return JSON.stringify(get(), null, 2);
      },
      
      importData: (data: string) => {
        try {
          const parsed = JSON.parse(data);
          set(parsed);
        } catch (error) {
          console.error('Failed to import data:', error);
        }
      }
    }),
    {
      name: 'fixco-content-store',
      version: 1,
        onRehydrateStorage: () => {
          return async (state, error) => {
            if (error) {
              console.error('Error rehydrating store:', error);
              return;
            }
            
            if (state) {
              // Mark as hydrated when rehydration is complete
              state.isHydrated = true;
            }
          };
        }
    }
  )
);